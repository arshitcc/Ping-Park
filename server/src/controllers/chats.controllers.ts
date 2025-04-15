import mongoose, { isValidObjectId } from "mongoose";
import { ChatEvents } from "../constants";
import User, { CustomRequest } from "../models/users.model";
import Chat, { IChat } from "../models/chats.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { emitSocket } from "../socket";
import { Response } from "express";
import { deleteFile, uploadFile } from "../utils/cloudinary";
import Message, { IMessage } from "../models/messages.model";


const chatCommonAggregation = () => {
    return [
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "participantIds",
          as: "participants",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          foreignField: "_id",
          localField: "latestMessageId",
          as: "latestMessage",
          pipeline: [
            {
              $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "senderId",
                as: "sender",
                pipeline: [
                  {
                    $project: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                sender: { $first: "$sender" },
              },
            },
          ],
        },
      },
      {
        $addFields: {
            latestMessage: { $first: "$latestMessage" },
        },
      },
    ];
};

const validateGroupChat = async(req : CustomRequest) => {
    
    const { participantIds, isGroupChat, chatName } : IChat = JSON.parse(req.body.chatData);

    if(!chatName?.trim()){
        throw new ApiError(400, "Group Name is required");
    }

    if(!participantIds){
        throw new ApiError(400, "Participants are required");
    }

    if(participantIds.length<2){
        throw new ApiError(400, "Participants cannot be less than 2 for group chat");
    }

    const members = [...new Set([...participantIds, req.user._id])];

    if(members.length<3){
        throw new ApiError(400, "Duplicate participants passed");
    }

    let newChat =  {chatName, isGroupChat, participantIds: members, admin : req.user._id};

    const groupPhoto = req.file?.path || "";
    let avatar = null;
    if(groupPhoto.trim()) avatar = await uploadFile(groupPhoto);

    if(!avatar) return {...newChat, avatar : {publicId : "ping-park", url : "https://res.cloudinary.com/arshitcc/image/upload/v1744499657/ping-park-group.png"}};
    return {...newChat, avatar : {publicId : avatar.public_id, url : avatar.url}};

}   

const validateSingleChat = async (req : CustomRequest) => {
    
    const { participantIds, isGroupChat } : IChat = JSON.parse(req.body.chatData);

    if(!participantIds){
        throw new ApiError(400, "Participants are required");
    }

    if(participantIds.length>1){
        throw new ApiError(400, "Participants cannot be more than 1 for single chat");
    }

    const existingChat = await Chat.find({
      participantIds : [...participantIds, req.user._id.toString()]
    })
    
    if(existingChat.length){
        throw new ApiError(400, "Chat already exists");
    }

    let members = [...participantIds, req.user._id];
    return { isGroupChat, participantIds : members};

}   

const deleteChatAssets = async(chat : IChat) => {
  try {
    const messages : IMessage[] = await Message.find({ chatId: chat._id });

    for(const message of messages){
      if(typeof message.message!=="string") await deleteFile(message.message.file.publicId, message.message.file.resource_type);
    }

    await Message.deleteMany({ chatId : chat._id });
    if(chat.avatar) await deleteFile(chat.avatar.publicId, "image");
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to delete chat assets"); 
  }
}

const createChat = asyncHandler( async(req : CustomRequest, res : Response) => {

    const { participantIds, isGroupChat } : IChat = JSON.parse(req.body.chatData);

    if(!participantIds || !participantIds.length){
        throw new ApiError(400, "Participants are required");
    }

    if(participantIds.includes(req.user._id.toString())){
        throw new ApiError(400, "Participants should not contain the group creator");
    }

    if(participantIds.some((id) => !isValidObjectId(id))){
        throw new ApiError(400, "Invalid Participant Ids");
    }

    let newChat = isGroupChat? await validateGroupChat(req) : await validateSingleChat(req);

    const groupChat = await Chat.create(newChat);

    const chat = await Chat.aggregate([
        {
          $match: {
            _id: groupChat._id,
          },
        },
        ...chatCommonAggregation(),
    ]);

    const payload : IChat = chat[0];

    if (!payload) {
        throw new ApiError(500, "Internal server error");
    }

    payload?.participants?.forEach((participant) => {
        if (participant._id === req.user._id) return;
        emitSocket(req, participant._id?.toString(),ChatEvents.NEW_CHAT_EVENT, payload);
    });

    return res.status(201).json(new ApiResponse(true, 200, "Chat Created Successfully", payload, []));
});

const getMyChats = asyncHandler( async(req : CustomRequest, res : Response) => {

    const chats = await Chat.aggregate([
      {
        $match: {
          participantIds: req.user._id,
        },
      },
      {
        $sort : {
          updatedAt : -1
        }
      },
      ...chatCommonAggregation(),
    ]);

    return res.status(200).json(new ApiResponse(true, 200, "Chats Fetched Successfully", chats, []));
});

const deleteChat = asyncHandler( async(req : CustomRequest, res : Response) => {

    const { chatId } = req.params;

    if(!isValidObjectId(chatId)){
      throw new ApiError(400, "Invalid ChatId");
    }

    const myChat: IChat[] = await Chat.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(chatId)
        }
      },
      ...chatCommonAggregation()
    ]);

    if(!myChat.length){
        throw new ApiError(404, "Chat not found");
    }
    
    const chat = myChat[0];

    if(chat.admin && chat.admin.toString() !== req.user._id.toString()){
      throw new ApiError(403, "You are not authorized to delete this chat");
    }

    if (!chat.participantIds?.some(id => id.toString() === req.user._id.toString())) {
      throw new ApiError(403, "You are not authorized to delete this chat");
    }

    await deleteChatAssets(chat);
    await Chat.findByIdAndDelete(chatId);

    chat?.participantIds?.forEach((participantId) => {
      if (participantId.toString() === req.user._id.toString()) return; 
      emitSocket( req, participantId?.toString(), ChatEvents.LEAVE_CHAT_EVENT, chat);
    });
  
    return res
      .status(200)
      .json(new ApiResponse(true, 200, "Group chat deleted successfully", {}, []));
});

const updateGroupChatAvatar = asyncHandler( async(req : CustomRequest, res : Response) => {

  const { chatId } = req.params;

  if(!isValidObjectId(chatId)){
    throw new ApiError(400, "Invalid ChatId");
  }

  if(!req.file?.path){
    throw new ApiError(400, "Chat avatar is required");
  }

  const chatAvatar = await uploadFile(req.file.path);

  if(!chatAvatar){
    throw new ApiError(500, "Failed to upload chat avatar");
  }

  const updatedChat : IChat|null = await Chat.findOneAndUpdate(
    {
      _id : new mongoose.Types.ObjectId(chatId),
      isGroupChat : true,
      admin : req.user._id,
      participantIds : req.user._id, // useless but still just for more safety
    }, 
    {
      $set : {
        avatar : {
          publicId : chatAvatar.public_id,
          url : chatAvatar.url
        }
      }
    }
  );

  if(!updatedChat){
    await deleteFile(chatAvatar.public_id, "image");
    throw new ApiError(400, "Unable to update chat");
  }

  updatedChat.avatar && await deleteFile(updatedChat.avatar.publicId, "image");

  updatedChat.participantIds?.map((participantId) => {
    emitSocket( req, participantId?.toString(), ChatEvents.UPDATE_GROUP_AVATAR_EVENT, updatedChat);
  });

  return res.status(200).json(new ApiResponse(true, 200, "Chat avatar updated successfully", updatedChat, []));

});

const updateGroupChatName = asyncHandler( async(req : CustomRequest, res : Response) => {

  const { chatId } = req.params;

  if(!isValidObjectId(chatId)){
    throw new ApiError(400, "Invalid ChatId");
  }

  const { chatName } : IChat = req.body;

  if(!chatName?.trim()){
    throw new ApiError(400, "Chat name is required");
  }

  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id : new mongoose.Types.ObjectId(chatId),
      isGroupChat : true,
      admin : req.user._id,
      participantIds : req.user._id,
    },
    {
      $set : {
        chatName
      }
    },
    {
      new : true
    }
  );

  if(!updatedChat){
    throw new ApiError(400, "Unable to update chat");
  }

  const myChat : IChat[] = await Chat.aggregate([
    {
      $match: {
        _id: updatedChat._id,
      },
    },
    ...chatCommonAggregation(),
  ]);


  const chat = myChat[0];

  if (!chat) {
    throw new ApiError(500, "Internal server error");
  }

  chat?.participantIds?.forEach((participantId) => {
    if (participantId.toString() === req.user._id.toString()) return;
    emitSocket(req, participantId.toString(),ChatEvents.UPDATE_GROUP_NAME_EVENT, chat);
  });

  return res.status(200).json(new ApiResponse(true, 200, "Group chat renamed successfully", chat, []));
});

const addNewParticipantsToGroupChat = asyncHandler( async(req : CustomRequest, res : Response) => {

  const { chatId } = req.params;
  const { newParticipantIds } = req.body;

  if([chatId, ...newParticipantIds].some((field)=>!isValidObjectId(field))){
    throw new ApiError(400, "Invalid ChatId");
  }

  const participants = newParticipantIds.map((participantId : string) => new mongoose.Types.ObjectId(participantId));

  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id : new mongoose.Types.ObjectId(chatId),
      isGroupChat : true,
      admin : req.user._id,
      participantIds : {
        $all : [req.user._id],
        $nin : participants
      }
    },
    {
      $addToSet : {
        participantIds : {
          $each : participants
        }
      }
    },
    {
      new : true
    }
  );

  if(!updatedChat){
    throw new ApiError(404, "Chat not found");
  }

  const myChat : IChat[] = await Chat.aggregate([
    {
      $match : {
        _id : updatedChat._id
      }
    },
    ...chatCommonAggregation()
  ]);

  if(!myChat.length){
    throw new ApiError(500, "Internal server error");
  }

  const chat = myChat[0];

  newParticipantIds.forEach((participantId : string) => {
    emitSocket(req, participantId, ChatEvents.NEW_CHAT_EVENT, chat);
  });

  return res.status(200).json(new ApiResponse(true, 200, "Participants added successfully", chat, []));
});

const removeParticipantsFromGroupChat = asyncHandler( async(req : CustomRequest, res : Response) => {

  const { chatId } = req.params;
  const { removeParticipantIds } = req.body;

  if(!removeParticipantIds?.length){
    throw new ApiError(400, "ParticipantIds are required");
  }

  if([chatId, ...removeParticipantIds].some((field) => !isValidObjectId(field))){
    throw new ApiError(400, "Invalid ChatId or NewParticipantId");
  }

  const participantIds = removeParticipantIds.map((participantId : string) => new mongoose.Types.ObjectId(participantId));

  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id : new mongoose.Types.ObjectId(chatId),
      isGroupChat : true,
      admin : req.user._id,
      participantIds : {
        $all : [req.user._id, ...participantIds]
      }
    },
    {
      $pullAll : {
        participantIds : participantIds
      }
    },
    {
      new : true
    }
  );

  if(!updatedChat){
    throw new ApiError(404, "Chat not found");
  }

  const myChat : IChat[] = await Chat.aggregate([
    {
      $match: {
        _id: updatedChat._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  if(!myChat.length){
    throw new ApiError(500, "Internal server error");
  }

  const chat = myChat[0];

  removeParticipantIds.forEach((participantId : string) => {
    emitSocket(req, participantId, ChatEvents.LEAVE_CHAT_EVENT, chat);
  });

  return res.status(200).json(new ApiResponse(true, 200, "Group chat updated successfully", chat, []));
});

const leaveFromGroupChat = asyncHandler( async(req : CustomRequest, res : Response) => {

  const { chatId } = req.params;

  if(!isValidObjectId(chatId)){
    throw new ApiError(400, "Invalid ChatId");
  }

  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
      participantIds: req.user._id,
    },
    {
      $pullAll: { participantIds: [req.user._id] },
    },
    {
      new: true,
    }
  );

  if (!updatedChat) {
    throw new ApiError(400, "Unable to update chat");
  }

  const myChat : IChat[] = await Chat.aggregate([
    {
      $match: {
        _id: updatedChat._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  if(!myChat.length){
    throw new ApiError(500, "Internal server error");
  }

  const chat = myChat[0];

  chat?.participantIds?.forEach((participantId) => {
    emitSocket(req, participantId.toString(),ChatEvents.LEAVE_CHAT_EVENT, chat);
  });

  return res.status(200).json(new ApiResponse(true, 200, "Group chat updated successfully", chat, []));
});

const getGroupChat = asyncHandler( async(req : CustomRequest, res : Response) => {

  const { chatId } = req.params;

  if(!isValidObjectId(chatId)){
    throw new ApiError(400, "Invalid ChatId");
  }

  const myChat : IChat[] = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
        participantIds: req.user._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  if(!myChat.length){
    throw new ApiError(500, "Internal server error");
  }

  return res.status(200).json(new ApiResponse(true, 200, "Group chat found successfully", myChat[0], []));
});

export {
    createChat,
    getMyChats,
    deleteChat,
    updateGroupChatAvatar,
    updateGroupChatName,
    addNewParticipantsToGroupChat,
    removeParticipantsFromGroupChat,
    leaveFromGroupChat,
    getGroupChat,
}
import mongoose, { isValidObjectId } from "mongoose";
import { ChatEvents } from "../constants";
import Chat, { IChat } from "../models/chats.model";
import Message, { IMessage } from "../models/messages.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFile, deleteFile } from "../utils/cloudinary";
import { emitSocket } from "../socket";
import { CustomRequest } from "../models/users.model";
import { Response } from "express";
import { chatCommonAggregation } from "./chats.controllers";

const messageCommonAggregation = () => [
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
];

const deleteMessageAndAssets = async(chatId : string, messages : IMessage[]) => {
    try {
    
        for(const message of messages){
          if(typeof message.message!=="string") await deleteFile(message.message.file.publicId, message.message.file.resource_type);
        }

        await Message.deleteMany({ chatId, _id : { $in : messages.map((message) => message._id) } });

      } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed to delete chat assets"); 
      }
}

const sendMessages = asyncHandler(async (req : CustomRequest, res : Response) => {
    const { chatId } = req.params;

    if(!isValidObjectId(chatId)){
      throw new ApiError(400, "Invalid ChatId");
    }

    const chat = await Chat.findOne(
        {
            _id : chatId,
            participantIds : req.user._id
        }
    );

    if(!chat){
        throw new ApiError(400, "Chat not found");
    }

    const { captionText, message } : { captionText : string, message : string } = req.body;
    const attachments = req.files as Express.Multer.File[];

    const captions = captionText?.trim().split(',');
    let newMessages : IMessage[] = [];

    if(captions && attachments && attachments.length && captions.length){
        for(let idx = 0; idx<attachments.length; idx++){
            const file = await uploadFile(attachments[idx].path);
            const newMessage = await Message.create({
                chatId,
                senderId : req.user._id,
                message : {
                    caption : captions[idx].trim(),
                    file : {
                        publicId : file.public_id,
                        url : file.url,
                        original_filename : file.original_filename,
                        resource_type : file.resource_type
                    }
                }
            }); 
            newMessages.push(newMessage);
        }
    }
    else {
        if(!message.trim()) throw new ApiError(400, "Message cannot be empty");
        const newMessage = await Message.create({
            chatId,
            senderId : req.user._id,
            message,
        });
        newMessages.push(newMessage);
    }

    const updatedTheChat = await Chat.findOneAndUpdate(
        {
            _id : new mongoose.Types.ObjectId(chatId),
            isGroupChat : chat.isGroupChat,
            participantIds : req.user._id,
        },
        {
            $set : {
                latestMessageId : newMessages[newMessages.length - 1]?._id
            }
        },
        {
            new : true
        }
    );

    if(!updatedTheChat){
        throw new ApiError(400, "Unable to update the chat");
    }

    const messagesSent = await Message.aggregate([
        {
            $match : {
                chatId : new mongoose.Types.ObjectId(chatId),
                senderId : req.user._id,
            }
        },
        ...messageCommonAggregation(),
        {
            $sort : {
                createdAt : -1
            }
        },
        {
            $limit : newMessages.length || 1
        }
    ]);

    updatedTheChat.participantIds && updatedTheChat.participantIds.forEach((participantId) => {
        if(participantId.toString() !== req.user._id.toString()) return;
        emitSocket(req, participantId, ChatEvents.MESSAGE_RECEIVED_EVENT, messagesSent);
    });
    
    return res.status(200).json(new ApiResponse(true, 200, "Messages Sent Successfully", messagesSent, []));
});

const deleteMessages = asyncHandler(async (req : CustomRequest, res : Response) => {

    const { chatId } = req.params;
    const { toDeleteMessageIds } = req.body;

    if([chatId, ...toDeleteMessageIds].some((id) => !isValidObjectId(id))){
        throw new ApiError(400, "Invalid Chat or Message Ids");
    }

    const myChatId = new mongoose.Types.ObjectId(chatId);

    const messageIds = toDeleteMessageIds.map((id : string) => new mongoose.Types.ObjectId(id));

    const myChat : IChat[] = await Chat.aggregate([
        {
            $match : {
                _id : myChatId,
                participantIds : req.user._id
            }
        },
        {
            $lookup : {
                from : "messages",
                localField : "_id",
                foreignField : "chatId",
                pipeline : [
                    {
                        $match : {
                            chatId : myChatId,
                            senderId : req.user._id,
                            _id : {
                                $in : messageIds
                            }
                        }
                    }
                ],
                as : "messages"
            }
        }
    ]);

    const chat = myChat[0];

    if(!chat){
        throw new ApiError(400, "Chat not found");
    }

    if(!chat.messages.length){
        throw new ApiError(400, "Message not found");
    }

    await deleteMessageAndAssets(chatId, chat.messages);

    chat.participantIds && chat.participantIds.forEach((participantId) => {
        if (participantId.toString() === req.user._id.toString()) return;
        emitSocket( req, participantId.toString(), ChatEvents.MESSAGE_DELETE_EVENT, chat.messages);
    });

    if(chat.latestMessageId && toDeleteMessageIds.includes(chat.latestMessageId.toString())){

        const latestMessage = await Message.findOne(
            {
                chatId : new mongoose.Types.ObjectId(chatId),
            },
            {},
            {
                sort : {
                    createdAt : -1
                }
            }
        );
    
        const updatedChat = await Chat.findOneAndUpdate(
            {
                _id : new mongoose.Types.ObjectId(chatId),
            },
            {
                $set : {
                    latestMessageId : latestMessage?._id
                }
            },
            {
                new : true
            }
        );

        return res.status(200).json(new ApiResponse(true, 200, "Messages Deleted Successfully", [updatedChat], []));
    }

    return res.status(201).json(new ApiResponse(true, 201, "Messages Deleted Successfully", chat, []));
});

const getMessages = asyncHandler(async (req : CustomRequest, res : Response) => {

    const { chatId } = req.params;
    
    if(!isValidObjectId(chatId)){
        throw new ApiError(400, "Invalid ChatId");
    }

    const myChat : IChat[] = await Chat.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(chatId),
                participantIds : req.user._id,
            }
        },
        ...chatCommonAggregation(),
        {
            $lookup : {
                from : "messages",
                localField : "_id",
                foreignField : "chatId",
                pipeline : [
                    {
                        $match : {
                            chatId : new mongoose.Types.ObjectId(chatId),
                        }
                    },
                    ...messageCommonAggregation(),
                    {
                        $sort : {
                            createdAt : -1
                        }
                    },
                    {
                        $limit : 10
                    }
                ],
                as : "messages"
            }
        },
    ]);

    const chat = myChat[0];

    return res.status(200).json(new ApiResponse(true, 200, "Messages Fetched Successfully", chat, []));

});

export { sendMessages, deleteMessages, getMessages };
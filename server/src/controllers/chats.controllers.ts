import { isValidObjectId } from "mongoose";
import { ChatEvents } from "../constants";
import { CustomRequest } from "../models/users.model";
import Chat, { IChat } from "../models/chats.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { emitSocket } from "../socket";
import { Response } from "express";
import { uploadFile } from "../utils/cloudinary";


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
    
    const { participantIds, isGroupChat, chatName } : IChat = req.body;

    if(!chatName?.trim()){
        throw new ApiError(400, "Group Name is required");
    }

    if(!participantIds){
        throw new ApiError(400, "Participants are required");
    }

    if(participantIds.length<2){
        throw new ApiError(400, "Participants cannot be more than 1 for single chat");
    }

    const members = [...new Set([...participantIds, req.user._id])];

    if(members.length<3){
        throw new ApiError(400, "Duplicate participants passed");
    }

    let newChat =  {chatName, isGroupChat, participantIds: members, admin : req.user._id};

    const groupPhoto = req.file?.path || "";
    let avatar = null;
    if(groupPhoto.trim()) avatar = await uploadFile(groupPhoto);

    if(!avatar) return newChat;
    return {...newChat, avatar : {publicId : avatar.public_id, url : avatar.url}};

}
    

const validateSingleChat = (req : CustomRequest) => {

    const { participantIds, isGroupChat } : IChat = req.body;

    if(!participantIds){
        throw new ApiError(400, "Participants are required");
    }

    if(participantIds.length>1){
        throw new ApiError(400, "Participants cannot be more than 1 for single chat");
    }

    let members = [...participantIds, req.user._id];
    return { isGroupChat, participantIds : members};

}   

const createChat = asyncHandler( async(req : CustomRequest, res : Response) => {
    const { participantIds, isGroupChat,  } : IChat = req.body;

    if(!participantIds || !participantIds.length){
        throw new ApiError(400, "Participants are required");
    }

    if(participantIds.includes(req.user._id)){
        throw new ApiError(400, "Participants array should not contain the group creator");
    }

    if(participantIds.some((id) => !isValidObjectId(id))){
        throw new ApiError(400, "Invalid Participant Ids");
    }

    let newChat = isGroupChat? validateGroupChat(req) : validateSingleChat(req);

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

    return res.status(201).json(new ApiResponse(true, 200, "Group Created Successfully", payload, []));
})

export {
    createChat,
}
import mongoose, { Document } from "mongoose";
import { IUser } from "./users.model";
import { IMessage } from "./messages.model";
import { Avatar } from "./users.model";

export interface IChat extends Document  {
    _id : string;
    chatName? : string;
    isGroupChat : boolean;
    participantIds? : string[];
    latestMessageId? : mongoose.Types.ObjectId;
    latestMessage? : IMessage;
    participants? : IUser[];
    messages : IMessage[];
    admin? : mongoose.Types.ObjectId;
    avatar? : Avatar;
    createdAt : Date;
    updatedAt : Date;
}


const chatSchema = new mongoose.Schema<IChat>(
    {
        chatName : {
            type : String,
            trim : true
        },
        isGroupChat : {
            type : Boolean,
            default : false
        },
        participantIds : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ],
        latestMessageId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Message'
        },
        messages : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Message'
            }
        ],
        admin : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        avatar : {
            publicId : String,
            url : String
        },
    },
    {
        timestamps : true
    }
);    

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
import mongoose, { Document } from "mongoose";
import { IUser } from "./users.model";
import { IMessage } from "./messages.model";

interface IChat extends Document {
    chatName : string;
    isGroupChat : boolean;
    participants? : IUser[];
    latestMessage? : IMessage;
    admin? : IUser;
    createdAt : Date;
    updatedAt : Date;
}


const chatSchema = new mongoose.Schema<IChat>(
    {
        chatName : {
            type : String,
            required : true,
            trim : true
        },
        isGroupChat : {
            type : Boolean,
            default : false
        },
        participants : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ],
        latestMessage : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Message'
        },
        admin : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    },
    {
        timestamps : true
    }
);    

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
import mongoose, { Document } from "mongoose";
import { IUser } from "./users.model";

export interface IChat extends Document  {
    chatName? : string;
    isGroupChat : boolean;
    participantIds? : IUser[];
    latestMessage? : mongoose.Types.ObjectId;
    participants? : mongoose.Types.ObjectId;
    messages? : mongoose.Types.ObjectId[];
    admin? : mongoose.Types.ObjectId;
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
        latestMessage : {
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
        }
    },
    {
        timestamps : true
    }
);    

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
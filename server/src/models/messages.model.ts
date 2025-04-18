import mongoose, { Document } from "mongoose";

type File = {
    publicId : string;
    url : string;
    original_filename : string;
    resource_type : string;
}

type FileMessage = {
    caption : string;
    file : File
}

type MessageContent = string | FileMessage ;

export interface IMessage {
    _id : mongoose.Types.ObjectId;
    senderId : mongoose.Types.ObjectId;
    message : MessageContent;
    chatId : mongoose.Types.ObjectId;
    createdAt : Date;
    updatedAt : Date;
    readBy? : mongoose.Types.ObjectId[];
    seenBy? : mongoose.Types.ObjectId[];
}

const messageSchema = new mongoose.Schema<IMessage>(
    {
        senderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        message : {
            type : mongoose.Schema.Types.Mixed,
            required : true,
            validate : {
                validator : function (value : MessageContent) {
                    if(typeof value === 'string') return value.trim().length > 0;
                    return ( 
                        value.file.publicId.trim().length>0 && 
                        value.file.url.trim().length>0 &&
                        value.file.original_filename.trim().length>0 && 
                        value.file.resource_type.trim().length>0 &&
                        value.caption.trim().length>=0
                    );
                },
                message : (props : any) => { // if validation fails
                    return JSON.stringify(props.value);
                }
            },
            // This is a setter function for fields, whenever inserting in the document this will run.
            set : function (value : MessageContent) {
                if(typeof value === 'string') return value.trim();
                return value;
            }
        },
        chatId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Chat'
        },
        readBy : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ],
        seenBy : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ]
    },
    {
        timestamps : true
    }
);


const Message = mongoose.model('Message', messageSchema);

export default Message;
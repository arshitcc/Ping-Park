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
    _id : string;
    senderId : string;
    message : MessageContent;
    chatId : string;
    createdAt : Date;
    updatedAt : Date;
    readBy? : string[];
    seenBy? : string[];
    sender : IUser
}

export interface IChat {
    _id : string;
    chatName? : string;
    isGroupChat : boolean;
    participantIds? : string[];
    latestMessageId? : string;
    latestMessage? : IMessage;
    participants? : IUser[];
    messages : IMessage[];
    admin? : string;
    avatar : Avatar;
    createdAt : Date;
    updatedAt : Date;
}

export interface Avatar{
    publicId: string;
    url: string;
};

export interface IUser {
    _id : string;
    name: string;
    email: string;
    avatar: Avatar;
}
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
      publicId: string;
      url: string;
    };
}

const userSchema = new mongoose.Schema<IUser> (
    {
        name: {
            type: String,
            required: true,
            trim : true,
        },
        email: {
            type: String,
            required: true,
            lowercase : true,
            unique : true
        },
        password: {
            type: String,
        },
        avatar : {
            publicId : {
                type : String,
                default : "ping-park"
            },
            url : {
                type : String,
                default : "https://res.cloudinary.com/arshitcc/image/upload/v1744284070/ping-park.png"
            }
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

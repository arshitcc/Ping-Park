import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
      publicId: string;
      url: string;
    };
    createdAt: Date;
    updatedAt: Date;
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
        },
        password: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

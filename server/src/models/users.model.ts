import mongoose, { Document } from "mongoose";
import { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../utils/env";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
      publicId: string;
      url: string;
    };
    refreshToken : string;
    validatePassword : (password : string) => boolean;
    generateAccessToken : () => string;
    generateRefreshToken : () => string;
}

export interface CustomRequest extends Request{
    user : IUser
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
        },
        refreshToken : {
            type : String
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  
userSchema.methods.validatePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
  };

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id : this._id },
        ACCESS_TOKEN_SECRET!,
        { expiresIn: parseInt(ACCESS_TOKEN_EXPIRY!) }
    );
  }

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { _id: this._id },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: parseInt(REFRESH_TOKEN_EXPIRY!) }
    );
  };

const User = mongoose.model<IUser>("User", userSchema);

export default User;

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import User, { CustomRequest, IUser } from "../models/users.model";
import { CookieOptions, Request, Response } from "express";
import { generateTokens } from "../utils/generateTokens";
import bcrypt from "bcryptjs";
import { deleteFile, uploadFile } from "../utils/cloudinary";

const signup = asyncHandler(async (req : Request, res: Response) => {
    const { name, email, password } = req.body;

    if([name, email, password].some((field) => !field.trim())){
        return res.status(400).json(new ApiResponse(false, 400, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });

    if(existingUser){
        return res.status(400).json(new ApiResponse(false, 400, "User already exists"));
    }

    const newUser = await User.create({ name, email, password });

    return res.status(201)
              .json( 
                    new ApiResponse(
                        true, 
                        201, 
                        "User created successfully", 
                        newUser, 
                        []
                    )
                );
});

const login = asyncHandler(async (req : Request, res: Response) => {
    
    const {email, password} = req.body;

    if([email, password].some((field) => !field.trim())){
        return res.status(400).json(new ApiResponse(false, 400, "All fields are required"));
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json(new ApiResponse(false, 404, "User not found"));
    }

    if(!user.validatePassword(password)){
        return res.status(400).json(new ApiResponse(false, 401, "Wrong password"));
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options : CookieOptions = {
        httpOnly : true,
        secure : true,
        sameSite : true
    }

    return res.status(200)
              .cookie('accessToken', accessToken, options)
              .cookie('refreshToken', refreshToken, options)
              .json(
                    new ApiResponse(
                        true,
                        200,
                        "User Logged In Successfully",
                        {user: loggedInUser}
                    )
                );
});

const changePassword = asyncHandler(async (req : CustomRequest, res : Response) => {

    const { oldPassword, newPassword } = req.body;

    if([oldPassword, newPassword].some((field)=>!field.trim())){
        return res.status(400).json(new ApiResponse(false, 400, "All fields are required"));
    }

    const user = await User.findById(req.user._id);

    if(!user){
        return res.status(400).json(new ApiResponse(false, 404, "User not found"));
    }

    if(!user?.validatePassword(oldPassword)){
        return res.status(400).json(new ApiResponse(false, 401, "Wrong password"));
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password : await bcrypt.hash(newPassword,10)},
        { new : true }
    ).select("-password -refreshToken");

    if(!updatedUser){
        return res.status(400).json(new ApiResponse(false, 400, "Unable to update user"));
    }

    return res.status(200)
              .json(
                    new ApiResponse(
                        true,
                        200,
                        "Password changed successfully",
                        {user : updatedUser}
                    )
                );
});

const changeAvatar = asyncHandler(async (req : CustomRequest, res : Response) => {

    const {old_profile_id, old_profile_url} = req.body;
    let new_profile_id = "";
    try {
        if(!req.file){
            return res.status(400).json(new ApiResponse(false, 400, "Profile photo is required"));
        }
    
        const profilePhotoPath = req.file?.path;
        
        if(!profilePhotoPath){
            return res.status(400).json(new ApiResponse(false, 400, "Profile photo is required"));
        }
    
        const profilePhoto = await uploadFile(profilePhotoPath);
        new_profile_id = profilePhoto.public_id;
    
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set : {
                    avatar : {
                        publicId : profilePhoto.public_id,
                        url : profilePhoto.url
                    }
                }
            },
            { new : true }
        );


        await deleteFile(old_profile_id, "image");
    
        if(!updatedUser){
            return res.status(400).json(new ApiResponse(false, 400, "Unable to update user"));
        }
    
        return res.status(200)
                  .json(
                        new ApiResponse(
                            true,
                            200,
                            "Avatar changed successfully",
                            {user : updatedUser}
                        )
                    );
    } catch (error) {
        if(new_profile_id.trim()) await deleteFile(new_profile_id, "image");
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set : {
                    avatar : {
                        publicId : old_profile_id,
                        url : old_profile_url
                    }
                }
            },
        );
    }
    
});

const getUsers = asyncHandler( async(req : CustomRequest, res : Response) => {

    const users : IUser[] = await User.aggregate([
        {
            $match: {
                _id: {
                    $ne: req.user._id,
                },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                avatar: 1,
            },
        },
    ]);

    return res.status(200).json(new ApiResponse(true, 200, "Users found successfully", users, []));
});

export { signup, login, changePassword, changeAvatar, getUsers };
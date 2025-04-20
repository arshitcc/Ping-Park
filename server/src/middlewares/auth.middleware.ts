import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ACCESS_TOKEN_SECRET } from "../utils/env";
import { NextFunction, Response } from "express";
import User, { CustomRequest } from "../models/users.model";


const authenticateUser = asyncHandler(async(req : CustomRequest, res : Response, next : NextFunction) => {

    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
    if(!token.trim()) {
        return res.status(400).json(new ApiResponse(false, 401, "Login to your account"));
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET!) as {_id : string};

    if(!decodedToken) {
        return res.status(400).json(new ApiResponse(false, 401, "Unauthorized Token"));
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if(!user) {
        return res.status(400).json(new ApiResponse(false, 404, "User not found"));
    }

    req.user = user;
    next();
});

export { authenticateUser }
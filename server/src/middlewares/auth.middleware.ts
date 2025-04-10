import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ACCESS_TOKEN_SECRET } from "../utils/env";
import { NextFunction } from "express";
import User, { CustomRequest } from "../models/users.model";


const authenticateUser = asyncHandler(async(req : CustomRequest, _ : any, next : NextFunction) => {

    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
    if(!token.trim()) {
        throw new ApiError(false, 401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET!) as {_id : string};

    if(!decodedToken) {
        throw new ApiError(false, 401, "Unauthorized Token");
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(false, 404, "User not found");
    }

    req.user = user;
    next();
});

export { authenticateUser }
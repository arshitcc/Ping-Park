import { IUser } from "../models/users.model";

export const generateTokens = async (user : IUser) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});
    return {accessToken, refreshToken};
}
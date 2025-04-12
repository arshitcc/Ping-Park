import cookie from "cookie"
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/users.model";
import { Server, Socket } from "socket.io";
import { ApiError } from "../utils/ApiError";
import { ACCESS_TOKEN_SECRET } from "../utils/env";
import { ChatEvents } from "../constants";
import { Request } from "express";

export interface CustomeSocket extends Socket {
    user? : IUser;
}

const initializeSocket = (io : Server) => {
    return io.on("connection", async (socket : CustomeSocket) => {
        try {

            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

            let token = cookies?.accessToken;

            if (!token) {
                token = socket.handshake.auth?.token;
            }

            if (!token) {
                throw new ApiError(401, "Un-authorized handshake. Token is missing");
            }

            const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET!) as {_id : string};

            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

            if (!user) {
                throw new ApiError(401, "Un-authorized handshake. Token is invalid");
            }
            socket.user = user;

            socket.join(user._id.toString());
            socket.emit(ChatEvents.CONNECTED_EVENT);
            console.log("User connected 🗼. userId: ", user._id.toString());


            socket.on(ChatEvents.JOIN_CHAT_EVENT, (chatId) => {
                console.log(`User joined the chat 🤝. chatId: `, chatId);
                socket.join(chatId);
            });

            socket.on(ChatEvents.DISCONNECT_EVENT, () => {
                console.log("user has disconnected 🚫. userId: " + socket.user?._id);
                if (socket.user?._id) {
                    socket.leave(socket.user._id);
                }
            });

        } catch (error : any) {
            socket.emit(
                ChatEvents.SOCKET_ERROR_EVENT,
                error?.message || "Something went wrong while connecting to the socket."
            );
        }
    })
}

const emitSocket = (req : Request, roomId : string, event : string, payload : object | string) => {
    req.app.get("io").in(roomId).emit(event, payload);
}


export { initializeSocket, emitSocket };
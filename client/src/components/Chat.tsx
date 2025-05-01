import { IChat } from "@/types";
import Image from "next/image";
import React from "react";

interface ChatProps {
  chat : IChat;
}

function Chat({ chat }: ChatProps) {

  if (!chat) return null;

  return (
    <div>
      <div className="flex border-3 border-pink-700 rounded-lg cursor-pointer flex-shrink-0">
        <div className="relative">
          <div className="absolute top-14 left-14 border-3 border-white h-[1.5vw] w-[1.5vw] bg-green-500 rounded-full"></div>{" "}
          <Image
            width="100"
            height="100"
            src={chat.avatar?.url}
            alt="User-Image"
          />
        </div>
        <div className="w-full p-4">
          <div className="flex justify-between">
            <div className="font-semibold">{chat?.chatName || "Guest" }</div>
            <div>{chat.updatedAt.getHours()}</div>
          </div>
          <div className="flex justify-between">
            <div className="w-full text-slate-500">{(chat?.latestMessage && typeof chat.latestMessage.message === "string" )? chat.latestMessage?.message : "Hello"}</div>
            <div className="bg-green-300 text-white h-full rounded-full text-center px-3 py-1">
              2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

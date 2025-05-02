"use client";

import { PaperclipIcon, SearchIcon, SendIcon, SmileIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Message from "./Message";
import type { IChat, IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/api/messages.api";


interface ChatSectionProps {
  chatId : string | null
}

export default function ChatSection({ chatId }: ChatSectionProps) {

  const currentUser: IUser = {
    avatar: {
      publicId: "ping-park",
      url: "https://res.cloudinary.com/arshitcc/image/upload/v1744284070/ping-park.png",
    },
    email: "forrest45@hotmail.com",
    name: "Kathryn Rutherford",
    _id: "67fbbd7bd7c7da3459a947ff",
  };

  if(!chatId) {
    return null;
  }

  const { data : response, isLoading, isError, error } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getMessages(chatId)
  });

  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");


  if(isLoading) {
    return (
      <>
        Loading...
      </>
    )
  }

  if(isError || !response) {
    return (
      <>
        Error: {error}
      </>
    )
  }

  const { isGroupChat, avatar, participants, messages, chatName } : IChat = response.data.data;

  let realChatName;
  if (isGroupChat) realChatName = chatName;
  else realChatName = participants?.find((p : IUser) => p._id !== currentUser._id)?.name;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sticky top-0 flex justify-between items-center border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={avatar.url || "/placeholder.svg"}
              alt={realChatName}
            />
            <AvatarFallback>
              {realChatName && realChatName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{realChatName}</h3>
            <p className="text-xs text-muted-foreground">
              {isGroupChat ? "Group · 3 participants" : "Online"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-12 mb-2">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }} > ● </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }} > ● </span>
                </div>
                <span>John is typing...</span>
              </div>
            )}

            {messages.map((msg) => (
              <Message
                key={msg._id}
                message={msg}
                isCurrentUserMessage={msg.sender._id === currentUser._id}
                isGroupChat={isGroupChat}
              />
            ))}
          </>
        )}
      </div>

      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <PaperclipIcon className="h-5 w-5" />
          </Button>

          <div className="relative flex-1">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="pr-10 focus-visible:ring-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <SmileIcon className="h-5 w-5" />
            </Button>
          </div>

          <Button size="icon" className="rounded-full">
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

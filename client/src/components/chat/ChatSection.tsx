"use client";

import { PaperclipIcon, SearchIcon, SendIcon, SmileIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Message from "./Message";
import type { IChat, IMessage, IUser } from "@/types";

export default function ChatSection() {

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");

  const sampleChat = {
    _id: "1",
    chatName: "John Doe",
    isGroupChat: false,
    participantIds: ["user1", "user2"],
    latestMessageId: "msg1",
    latestMessage: {
      _id: "msg1",
      senderId: "user2",
      message: "Hey, how's it going?",
      chatId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [],
      seenBy: [],
      sender: {
        _id: "user2",
        name: "John Doe",
        email: "john@example.com",
        avatar: {
          publicId: "avatar1",
          url: "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=400&d=robohash&r=x",
        },
      },
    },
    participants: [],
    messages: [],
    admin: "user1",
    avatar: {
      publicId: "avatar1",
      url: "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=400&d=robohash&r=x",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Sample messages
  const sampleMessages: IMessage[] = [
    {
      _id: "msg1",
      senderId: "user2",
      message: "Hey, how's it going?",
      chatId: "1",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      readBy: [],
      seenBy: [],
      sender: {
        _id: "user2",
        name: "John Doe",
        email: "john@example.com",
        avatar: {
          publicId: "avatar1",
          url: "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=400&d=robohash&r=x",
        },
      },
    },
    {
      _id: "msg2",
      senderId: "user1",
      message: "I'm doing well, thanks for asking! How about you?",
      chatId: "1",
      createdAt: new Date(Date.now() - 1000 * 60 * 25),
      updatedAt: new Date(Date.now() - 1000 * 60 * 25),
      readBy: [],
      seenBy: [],
      sender: {
        _id: "user1",
        name: "Current User",
        email: "me@example.com",
        avatar: {
          publicId: "avatar2",
          url: "https://gravatar.com/avatar/1c8e8a6e8d1fe52b782b280909abeb38?s=400&d=robohash&r=x",
        },
      },
    },
    {
      _id: "msg3",
      senderId: "user2",
      message:
        "I've been working on that project we discussed. Made some good progress!",
      chatId: "1",
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
      updatedAt: new Date(Date.now() - 1000 * 60 * 20),
      readBy: [],
      seenBy: [],
      sender: {
        _id: "user2",
        name: "John Doe",
        email: "john@example.com",
        avatar: {
          publicId: "avatar1",
          url: "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=400&d=robohash&r=x",
        },
      },
    },
  ];

  const currentUser: IUser = {
    _id: "user1",
    name: "Current User",
    email: "me@example.com",
    avatar: {
      publicId: "avatar2",
      url: "https://gravatar.com/avatar/1c8e8a6e8d1fe52b782b280909abeb38?s=400&d=robohash&r=x",
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sticky top-0 flex justify-between items-center border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={sampleChat.avatar.url || "/placeholder.svg"}
              alt={sampleChat.chatName}
            />
            <AvatarFallback>
              {sampleChat.chatName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{sampleChat.chatName}</h3>
            <p className="text-xs text-muted-foreground">
              {sampleChat.isGroupChat ? "Group · 3 participants" : "Online"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4">
        {loadingMessages ? (
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

            {sampleMessages.map((msg) => (
              <Message
                key={msg._id}
                message={msg}
                isCurrentUserMessage={msg.sender._id === currentUser._id}
                isGroupChat={sampleChat.isGroupChat}
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

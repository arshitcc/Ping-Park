"use client";

import type { IChat } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  chat: IChat | null;
  isActive: boolean;
  unreadCount: number;
  onChatDelete?: () => Promise<void>;
}

export default function Chat({ chat, isActive, unreadCount }: ChatItemProps) {
  if (!chat) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: false });
  };

  const mydata = {
    avatar: {
      publicId: "ping-park",
      url: "https://res.cloudinary.com/arshitcc/image/upload/v1744284070/ping-park.png",
    },
    email: "forrest45@hotmail.com",
    name: "Kathryn Rutherford",
    _id: "67fbbd7bd7c7da3459a947ff",
  };

  let chatName;
  if (chat.isGroupChat) chatName = chat.chatName;
  else chatName = chat.participants?.find((p) => p._id !== mydata._id)?.name;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
      )}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={chat?.avatar?.url || "https://gravatar.com/avatar/30db2a0a8080393d987b87e6d00ba93c?s=400&d=retro&r=x"} alt={chatName || "Ping-Park"} />
        <AvatarFallback>{getInitials(chatName || "Ping Park")}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{chatName || "Ping-Park"}</h3>
          {chat.latestMessage && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTime(chat.latestMessage?.updatedAt || new Date())}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-1">
          {chat.latestMessage && (
            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
              {typeof chat.latestMessage?.message === "string"
                ? chat.latestMessage?.message
                : "Attachment"}
            </p>
          )}

          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2 px-2 py-0.5 rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

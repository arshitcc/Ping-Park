"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Plus } from "lucide-react";
import Chat from "./Chat";
import type { IChat } from "@/types";
import { getMyChats } from "@/api/chats.api";
import { useQuery } from "@tanstack/react-query";
import NewChatDialog from "./NewChatDialog";

interface ChatListProps {
  setChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChatsList({ setChatId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getMyChats,
  });

  // Sample unread messages
  const unreadMessages: { [key: string]: number } = {
    "1": 2,
    "2": 0,
    "3": 5,
  };

  if (isLoading) return <>Loading...</>;

  if (isError) return <>Error: {error}</>;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sticky top-0 bg-background z-10 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold">Chats</h2>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 focus-visible:ring-1"
              placeholder="Search users or chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <NewChatDialog/>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {
          response?.data.data.length > 0 &&
          response?.data.data.map((chat: IChat) => (
            <div key={chat._id} onClick={() => setChatId(chat._id)}>
              <Chat
                chat={chat}
                isActive={chat?._id === "1"}
                unreadCount={chat ? unreadMessages[chat._id] : 0}
              />
            </div>
          )) 
        }
      </div>
    </div>
  );
}

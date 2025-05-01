"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus, Search, Plus } from "lucide-react"
import Chat from "./Chat"
import type { IChat } from "@/types"

export default function ChatsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openNewChatModal, setOpenNewChatModal] = useState(false)
  const [loadingChats, setLoadingChats] = useState(false)

  // Sample data for demonstration
  const sampleChats: (IChat | null)[] = [
    {
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
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
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
    },
    {
      _id: "2",
      chatName: "Team Project",
      isGroupChat: true,
      participantIds: ["user1", "user2", "user3"],
      latestMessageId: "msg2",
      latestMessage: {
        _id: "msg2",
        senderId: "user3",
        message: "Let's meet tomorrow at 10 AM",
        chatId: "2",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        readBy: [],
        seenBy: [],
        sender: {
          _id: "user3",
          name: "Sarah Smith",
          email: "sarah@example.com",
          avatar: {
            publicId: "avatar3",
            url: "https://gravatar.com/avatar/a8b9c5d6e7f8g9h0i1j2k3l4m5n6o7p?s=400&d=robohash&r=x",
          },
        },
      },
      participants: [],
      messages: [],
      admin: "user1",
      avatar: {
        publicId: "group1",
        url: "https://gravatar.com/avatar/9e7d98b7d6a5c4b3f2a8c1b7d6a5c4b3?s=400&d=identicon&r=x",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "3",
      chatName: "Alice Johnson",
      isGroupChat: false,
      participantIds: ["user1", "user4"],
      latestMessageId: "msg3",
      latestMessage: {
        _id: "msg3",
        senderId: "user4",
        message: "Did you see the latest update?",
        chatId: "3",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        readBy: [],
        seenBy: [],
        sender: {
          _id: "user4",
          name: "Alice Johnson",
          email: "alice@example.com",
          avatar: {
            publicId: "avatar4",
            url: "https://gravatar.com/avatar/9bc3b2a3c4d5e6f7g8h9i0j1k2l3m4n?s=400&d=robohash&r=x",
          },
        },
      },
      participants: [],
      messages: [],
      admin: "user1",
      avatar: {
        publicId: "avatar4",
        url: "https://gravatar.com/avatar/9bc3b2a3c4d5e6f7g8h9i0j1k2l3m4n?s=400&d=robohash&r=x",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Sample unread messages
  const unreadMessages: { [key: string]: number } = {
    "1": 2,
    "2": 0,
    "3": 5,
  }

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
          <Button onClick={() => setOpenNewChatModal(true)} size="icon">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loadingChats ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          sampleChats.map((chat) => (
            <Chat
              key={chat?._id}
              chat={chat}
              isActive={chat?._id === "1"}
              unreadCount={chat ? unreadMessages[chat._id] : 0}
            />
          ))
        )}
      </div>

      <div className="p-3 border-t border-border">
        <Button variant="outline" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Start new chat
        </Button>
      </div>
    </div>
  )
}

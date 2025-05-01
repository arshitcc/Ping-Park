"use client"

import type { IChat } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChatItemProps {
  chat: IChat | null
  isActive: boolean
  unreadCount: number
  onClick?: () => Promise<void>
  onChatDelete?: () => Promise<void>
}

export default function Chat({ chat, isActive, unreadCount }: ChatItemProps) {

  if (!chat) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: false })
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted/50",
      )}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={chat.avatar.url || "/placeholder.svg"} alt={chat.chatName} />
        <AvatarFallback>{getInitials(chat.chatName || "Ping Park")}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{chat.chatName}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTime(chat.latestMessage?.createdAt || new Date())}
          </span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
            {typeof chat.latestMessage?.message === "string" ? chat.latestMessage?.message : "Attachment"}
          </p>

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

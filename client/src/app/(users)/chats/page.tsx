"use client";

import ChatSection from "@/components/chat/ChatSection";
import ChatsList from "@/components/chats/ChatsList";
import SettingsPanel from "@/components/settings/Settings";
import { IChat } from "@/types";
import { useState } from "react";

function page() {

  const [chatId, setChatId] = useState<string | null>(null);
  return (
    <div className="h-screen flex bg-background">
      <SettingsPanel />
      <div className="w-1/3 border-r border-border">
        <ChatsList setChatId={setChatId} />
      </div>
      <div className="w-2/3">
        <ChatSection chatId={chatId}  />
      </div>
    </div>
  );
}

export default page;

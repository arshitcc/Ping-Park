"use client";

import ChatSection from "@/components/chat/ChatSection";
import ChatsList from "@/components/chats/ChatsList";
import SettingsPanel from "@/components/settings/Settings";

function page() {
  return (
    <div className="h-screen flex bg-background">
      <SettingsPanel />
      <div className="w-1/3 border-r border-border">
        <ChatsList />
      </div>
      <div className="w-2/3">
        <ChatSection />
      </div>
    </div>
  );
}

export default page;

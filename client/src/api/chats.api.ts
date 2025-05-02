import { apiClient } from "@/lib/axios";

const getMyChats = async () => {
  return apiClient.get("/chats");
};

export { 
    getMyChats,
};

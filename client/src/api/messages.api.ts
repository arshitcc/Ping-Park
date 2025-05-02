import { apiClient } from "@/lib/axios";

const getMessages = async (chatId: string) => {
  return apiClient.get(`/messages/${chatId}`);
};

export { 
    getMessages,
};

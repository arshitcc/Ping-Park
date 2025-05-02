import { apiClient } from "@/lib/axios";

const getMessages = async (chatId: string) => {
  return apiClient.get(`/messages/${chatId}`);
};

const deleteMessages = async (chatId: string, messageIds: string[]) => {
  return apiClient.delete(`/messages/${chatId}`, {
    data: { toDeleteMessageIds: messageIds },
  });
};

export {
  deleteMessages,
  getMessages
};

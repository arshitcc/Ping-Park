import { apiClient } from "@/lib/axios";

const getMessages = async (chatId: string) => {
  return apiClient.get(`/messages/${chatId}`);
};

const deleteMessages = async (chatId: string, messageIds: string[]) => {
  return apiClient.delete(`/messages/${chatId}`, {
    data: { toDeleteMessageIds: messageIds },
  });
};

const sendMessages = async (chatId : string, message : string|null, captions : string[], files : File[]) => {
  const data = new FormData();
  if(message?.trim()) data.append('message',message);  
  const captionText = captions.map((caption) => caption.trim()).join(',');
  if(captionText?.trim()) data.append('captionText',captionText);
  for(const file of files) data.append('attachments',file);

  return apiClient.post(`/messages/${chatId}`, data);
}

export {
  sendMessages,
  deleteMessages,
  getMessages
};

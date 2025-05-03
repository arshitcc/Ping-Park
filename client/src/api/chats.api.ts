import { apiClient } from "@/lib/axios";

const getMyChats = async () => {
  return apiClient.get("/chats");
};

const createChat = async (isGroupChat : boolean, participantIds : string[], chatName? : string, groupPhoto? : File) => {
  const data = new FormData();
  data.append('chatData', JSON.stringify({ isGroupChat, participantIds, chatName }));
  if(groupPhoto) data.append('groupPhoto', groupPhoto);
  return apiClient.post("/chats/new-chat", data);
};

const addNewParticipantsToGroupChat = async (chatId : string, newParticipantIds : string[]) => {
  return apiClient.post(`/chats/${chatId}`, { newParticipantIds });
}

const removeParticipantsFromGroupChat = async (chatId : string, participantIds : string[]) => {
  return apiClient.patch(`/chats/${chatId}`, { participantIds });
}

const leaveFromGroupChat = async (chatId : string) => {
  return apiClient.patch(`/chats/${chatId}/leave-group`);
}

const updateGroupChatName = async (chatId : string, chatName : string) => {
  return apiClient.patch(`/chats/${chatId}/rename-group`, { chatName });
}

const updateGroupChatAvatar = async (chatId : string, groupPhoto : File) => {
  const data = new FormData();
  data.append('groupPhoto', groupPhoto);
  return apiClient.patch(`/chats/${chatId}`, data);
}

export { 
  getMyChats,
  createChat,
  addNewParticipantsToGroupChat,
  removeParticipantsFromGroupChat,
  leaveFromGroupChat,
  updateGroupChatName,
  updateGroupChatAvatar
};

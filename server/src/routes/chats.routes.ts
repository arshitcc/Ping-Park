import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import {
  createChat,
  getMyChats,
  deleteChat,
  addNewParticipantsToGroupChat,
  removeParticipantsFromGroupChat,
  leaveFromGroupChat,
  updateGroupChatName,
  updateGroupChatAvatar,
  getGroupChat,
} from "../controllers/chats.controllers";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router
  .route("/new-chat")
  .post(upload.single("groupPhoto"), authenticateUser, createChat);

router.route("/get-my-chats").get(authenticateUser, getMyChats);

router
  .route("/:chatId")
  .get(authenticateUser, getGroupChat)
  .post(authenticateUser, addNewParticipantsToGroupChat)
  .patch(authenticateUser, removeParticipantsFromGroupChat)
  .put(authenticateUser, upload.single("groupPhoto"), updateGroupChatAvatar)
  .delete(authenticateUser, deleteChat);

router
  .route("/:chatId/leave-group")
  .patch(authenticateUser, leaveFromGroupChat);
router
  .route("/:chatId/rename-group")
  .patch(authenticateUser, updateGroupChatName);

export default router;

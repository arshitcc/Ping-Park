import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createChat, getMyChats, deleteChat } from "../controllers/chats.controllers";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/new-chat").post(upload.single('groupPhoto'),authenticateUser, createChat);
router.route("/get-my-chats").get(authenticateUser, getMyChats);
router.route("/delete-chat/:chatId").delete(authenticateUser, deleteChat);

export default router;

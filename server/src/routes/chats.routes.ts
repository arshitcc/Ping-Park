import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createChat } from "../controllers/chats.controllers";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/new-chat").post(upload.single('groupPhoto'),authenticateUser, createChat);

export default router;

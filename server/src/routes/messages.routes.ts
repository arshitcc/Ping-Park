import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import {
  sendMessages,
  deleteMessages,
  getMessages,
} from "../controllers/messages.controllers";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router
  .route("/:chatId")
  .post(authenticateUser, upload.array("attachments", 4) ,sendMessages)
  .delete(authenticateUser, deleteMessages)
  .get(authenticateUser, getMessages);


export default router;

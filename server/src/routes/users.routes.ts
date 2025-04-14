import { Router } from "express";
import { changeAvatar, changePassword, getUsers, login, signup } from "../controllers/users.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();


router.route('/').get(authenticateUser, getUsers);
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/change-password').post(authenticateUser, changePassword);
router.route('/change-profile').post(authenticateUser, upload.single('profile'), changeAvatar);


export default router;
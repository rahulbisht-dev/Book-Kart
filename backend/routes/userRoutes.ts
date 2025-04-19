import { Router } from "express";
import { checkUserAuth, forgotPassword, login, Logout, register, resetPassword, verifyEmail } from "../controllers/authControllers";
import authenticateUser from "../middlewares/authMiddleware";
import { updateUserProfile } from "../controllers/userController";


const router = Router();


router.route("/profile/update/:userId").put(authenticateUser , updateUserProfile);



export default router;
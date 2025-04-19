import { NextFunction, Request, Response, Router } from "express";
import { checkUserAuth, forgotPassword, login, Logout, register, resetPassword, verifyEmail } from "../controllers/authControllers";
import authenticateUser from "../middlewares/authMiddleware";
import passport from "passport";
import { IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";


const router = Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/logout").get(Logout)
router.route("/verify-auth").get(authenticateUser , checkUserAuth);

router.route("/google").get(passport.authenticate("google" , {
    scope:["profile" , "email"]
}))

// google callback

router.route("/google/callback").get(passport.authenticate("google" , {failureRedirect:`${process.env.FRONTEND_URL}` , session:false})
,
      async(req:Request , res:Response , next:NextFunction) : Promise<void> =>{
        try {
            const user = req.user as IUser;
            const accessToken =  generateToken(user);

            res.cookie("access_token" , accessToken , {
                httpOnly:true,
                sameSite:"none",
                secure:true,
                maxAge:24*60*1000
            })

            res.redirect(`${process.env.FRONTEND_URL}`);

        } catch (error) {
            next(error);
        }
      } 
      )


export default router;
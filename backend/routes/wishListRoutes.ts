import { Router } from "express";
import authenticateUser from "../middlewares/authMiddleware";
import { addToWishlist, getWishlistByUser, removeWishlist } from "../controllers/wishListControllers";


const router = Router();


router.route("/add").post(authenticateUser , addToWishlist);
router.route("/remove/:productId").delete(authenticateUser , removeWishlist);
router.route("/:userId").get(authenticateUser , getWishlistByUser);


export default router;
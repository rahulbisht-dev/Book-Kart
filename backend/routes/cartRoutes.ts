import { Router } from "express";
import authenticateUser from "../middlewares/authMiddleware";
import { addtoCart, clearCart, getCartByuser, removeFromCart } from "../controllers/cartController";


const router = Router();


router.route("/add").post(authenticateUser , addtoCart);
router.route("/remove/:productId").delete(authenticateUser , removeFromCart);
router.route("/:userId").get(authenticateUser , getCartByuser);
router.route("/clear-cart").post(authenticateUser , clearCart);


export default router;
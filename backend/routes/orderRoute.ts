import { Router } from "express";
import authenticateUser from "../middlewares/authMiddleware";
import { createOrUpdateOrder, getOrderById, getOrderByUser } from "../controllers/orderController";


const router = Router();


router.route("/").post(authenticateUser , createOrUpdateOrder);
router.route("/").get(authenticateUser , getOrderByUser);
router.route("/:id").get(authenticateUser , getOrderById);


export default router;
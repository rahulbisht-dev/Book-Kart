import { Router } from "express";
import authenticateUser from "../middlewares/authMiddleware";
import { createOrUpdateAdressByUserId, deleteAddress, getAddressByUserId } from "../controllers/addressController";


const router = Router();


router.route("/create-or-update").post(authenticateUser , createOrUpdateAdressByUserId);
router.route("/").get(authenticateUser , getAddressByUserId);
router.route("/delete-address").post(authenticateUser , deleteAddress);


export default router;
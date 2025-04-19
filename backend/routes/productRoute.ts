import express, { Router } from "express";
import authenticateUser from "../middlewares/authMiddleware";
import { multerMiddleware } from "../config/cloudinaryConfig";
import { createProduct, deleteProduct, getAllProducts, getProductBySellerId, getProductsById } from "../controllers/productController";

const router = Router();

router.route("/").post(authenticateUser , multerMiddleware , createProduct);
router.route("/").get(getAllProducts);
router.route("/:productId").delete(authenticateUser , deleteProduct);
router.route("/seller/:sellerId").get(authenticateUser , getProductBySellerId);
router.route("/:productId").get( getProductsById);


export default router;
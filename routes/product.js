import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Multer config

router.post("/products", upload.array("images"), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;

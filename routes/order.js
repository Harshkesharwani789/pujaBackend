import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
  getAllOrders,
  getOrderStats,
} from "../controllers/orderController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Create a new order (authenticated users)
router.post("/", authenticate, createOrder);

// Get order by ID (authenticated users - own orders, admin - all orders)
router.get("/:id", authenticate, getOrderById);

// Update order status (admin only)
router.put("/:id/status", authenticate, isAdmin, updateOrderStatus);

// Get user orders (authenticated users)
router.get("/user/myorders", authenticate, getUserOrders);

// Get all orders (admin only)
router.get("/", authenticate, isAdmin, getAllOrders);

// Get order statistics (admin only)
router.get("/stats/overview", authenticate, isAdmin, getOrderStats);

export default router;

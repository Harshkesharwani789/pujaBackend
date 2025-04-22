import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", authenticate, getAllUsers);

// Get user by ID (admin only)
router.get("/:id", authenticate, isAdmin, getUserById);

// Update user profile (logged in user)
router.put("/profile", authenticate, updateUserProfile);

// Change password (logged in user)
router.put("/change-password", authenticate, changePassword);

// Update user (admin only)
router.put("/:id", authenticate, isAdmin, updateUser);

// Delete user (admin only)
router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;

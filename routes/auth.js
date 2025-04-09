import express from "express";
import {
  register,
  loginUser,
  loginAdmin,
  registerAdmin,
  getUserProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user
// For regular users
router.post("/login", loginUser);

// For admins
router.post("/admin/login", loginAdmin);

// Register admin (for initial setup)
router.post("/register-admin", registerAdmin);

// Get user profile
router.get("/profile", authenticate, getUserProfile);

export default router;

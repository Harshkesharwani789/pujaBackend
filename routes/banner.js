import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllBanners,
  getActiveBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `banner-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Get all banners (admin)
router.get("/admin", authenticate, isAdmin, getAllBanners);

// Get active banners (public)
router.get("/", getActiveBanners);

// Get banner by ID
router.get("/:id", getBannerById);

// Create a new banner (admin only)
router.post("/", authenticate, isAdmin, upload.single("image"), createBanner);

// Update a banner (admin only)
router.put("/:id", authenticate, isAdmin, upload.single("image"), updateBanner);

// Delete a banner (admin only)
router.delete("/:id", authenticate, isAdmin, deleteBanner);

export default router;

import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  verifyEmail,
  resendVerification,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/verify-email/:token", verifyEmail);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.post("/resend-verification", protect, resendVerification);

export default router;

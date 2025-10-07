import express from "express";
import {
  registerUser,
  loginUser,
  loginWithFacebook,
  verifyEmail,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/facebook", loginWithFacebook);
router.get("/verify/:token", verifyEmail);
router.get("/me", protect, getUserProfile);

export default router;

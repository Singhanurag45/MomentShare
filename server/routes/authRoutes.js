// server/routes/authRoutes.js

import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // You need this middleware

const router = express.Router();

// These routes are public, anyone can access them
router.post("/register", register);
router.post("/login", login);

// These routes are protected. Only logged-in users can access them.
// We add `authMiddleware` to protect them.
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

export default router;

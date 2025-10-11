import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  followUser,
  unfollowUser,
  getSuggestions,
  updateProfilePicture,
  updateProfileDetails,
  searchUsers,
} from "../controllers/userController.js";

const router = express.Router();

// static routes
router.get("/search", authMiddleware, searchUsers);
router.put("/details", authMiddleware, updateProfileDetails);
router.put("/picture", authMiddleware, updateProfilePicture);

// --- dynamic routes ---
router.get("/suggestions", authMiddleware, getSuggestions);
router.get("/:username", authMiddleware, getUserProfile);
router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, unfollowUser);

export default router;

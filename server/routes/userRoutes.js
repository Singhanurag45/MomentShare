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
  getUserFollowers,
  getUserFollowing,
} from "../controllers/userController.js";

const router = express.Router();

// 1. Static Routes (Must be at the top)
router.get("/search", authMiddleware, searchUsers);
router.get("/suggestions", authMiddleware, getSuggestions);

// 2. Update Routes
router.put("/details", authMiddleware, updateProfileDetails);
router.put("/picture", authMiddleware, updateProfilePicture);

// 3. Specific User Sub-Routes
router.get("/:userId/followers", authMiddleware, getUserFollowers);
router.get("/:userId/following", authMiddleware, getUserFollowing);

// 4. Dynamic/Generic Routes (Must be at the bottom)
router.get("/:username", authMiddleware, getUserProfile);
router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, unfollowUser);

export default router;

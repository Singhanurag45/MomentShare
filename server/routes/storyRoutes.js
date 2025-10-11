import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createStory, getStories } from "../controllers/storyController.js";

const router = express.Router();

// @route   POST /api/stories
// @desc    Create a new story
router.post("/", authMiddleware, createStory);

// @route   GET /api/stories
// @desc    Get stories for the feed
router.get("/", authMiddleware, getStories);

export default router;

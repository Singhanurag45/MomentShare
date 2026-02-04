import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createPost,
  getFeedPosts,
  likePost,
  commentOnPost,
  getPostById,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/feed", authMiddleware, getFeedPosts);
router.get("/:postId", authMiddleware, getPostById);
router.put("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, commentOnPost);
router.delete("/:id", authMiddleware, deletePost);

export default router;

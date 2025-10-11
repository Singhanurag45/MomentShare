import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js"; // ✨ Import the Notification model
import { v2 as cloudinary } from "cloudinary";

// This configuration should be at the top
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- This function is correct and needs no changes ---
export const createPost = async (req, res) => {
  const { caption, mediaFile, mediaType } = req.body;
  try {
    let mediaUrl = "";
    if (mediaFile) {
      const uploadedResponse = await cloudinary.uploader.upload(mediaFile, {
        resource_type: mediaType === "video" ? "video" : "image",
      });
      mediaUrl = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      user: req.user.id,
      caption,
      mediaUrl,
      mediaType,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// --- This function is correct and needs no changes ---
export const getFeedPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userPosts = await Post.find({ user: req.user.id });
    const friendPosts = await Post.find({
      user: { $in: currentUser.following },
    });
    const feedPosts = userPosts
      .concat(friendPosts)
      .sort((a, b) => b.createdAt - a.createdAt);
    await Post.populate(feedPosts, {
      path: "user",
      select: "username profilePicture",
    });
    res.json(feedPosts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// --- ✨ UPDATED with Notification Logic ---
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      // Unlike logic
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like logic
      post.likes.push(userId);

      // ✨ Create a notification if the user is not liking their own post
      if (post.user.toString() !== userId.toString()) {
        const notification = new Notification({
          recipient: post.user,
          sender: userId,
          type: "like",
          post: post._id,
        });
        await notification.save();
      }
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// --- ✨ UPDATED with Notification Logic ---
export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userId = req.user.id;
    const newComment = {
      user: userId,
      text: req.body.text,
    };

    post.comments.unshift(newComment);
    await post.save();

    // ✨ Create a notification if the user is not commenting on their own post
    if (post.user.toString() !== userId.toString()) {
      const notification = new Notification({
        recipient: post.user,
        sender: userId,
        type: "comment",
        post: post._id,
      });
      await notification.save();
    }

    // Populate user details for the response
    await Post.populate(post, {
      path: "comments.user",
      select: "username profilePicture",
    });

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


// ✨ NEW: Function to get a single post by its ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
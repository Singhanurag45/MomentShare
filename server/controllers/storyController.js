import Story from "../models/Story.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// --- Create a new story ---
export const createStory = async (req, res) => {
  const { mediaFile, mediaType } = req.body;
  if (!mediaFile || !mediaType) {
    return res.status(400).json({ msg: "Media file and type are required." });
  }

  try {
    const uploadedResponse = await cloudinary.uploader.upload(mediaFile, {
      resource_type: mediaType === "video" ? "video" : "image",
      folder: "stories",
    });

    const newStory = new Story({
      user: req.user.id,
      mediaUrl: uploadedResponse.secure_url,
      mediaType,
    });

    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// --- Get stories (Self + Following, Last 24h) ---
export const getStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // 1. Get IDs of people I follow AND my own ID
    const followingIds = currentUser.following;
    const userIds = [req.user.id, ...followingIds];

    // 2. Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 3. Find stories created in the last 24h by these users
    const stories = await Story.find({
      user: { $in: userIds },
      createdAt: { $gt: twentyFourHoursAgo }, // Only newer than 24h
    })
      .populate("user", "username profilePicture")
      .sort({ createdAt: 1 }); // Oldest first so they play in order

    // 4. Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          userId: story.user._id,
          username: story.user.username,
          profilePicture: story.user.profilePicture,
          stories: [],
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    // Return as an array
    res.json(Object.values(groupedStories));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

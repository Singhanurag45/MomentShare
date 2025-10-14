import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser)
      return res.status(404).json({ msg: "User not found" });

    if (!currentUser.following.includes(req.params.id)) {
      await currentUser.updateOne({ $push: { following: req.params.id } });
      await userToFollow.updateOne({ $push: { followers: req.user.id } });

      const notification = new Notification({
        recipient: req.params.id,
        sender: req.user.id,
        type: "follow",
      });
      await notification.save();

      res.json({ msg: "User followed" });
    } else {
      res.status(400).json({ msg: "You are already following this user" });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser)
      return res.status(404).json({ msg: "User not found" });

    if (currentUser.following.includes(req.params.id)) {
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
      res.json({ msg: "User unfollowed" });
    } else {
      res.status(400).json({ msg: "You are not following this user" });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const getSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const users = await User.find({ 
            _id: { $ne: req.user.id }, // Not the current user
            followers: { $ne: req.user.id } // Not already being followed
        }).limit(5); // Get 5 suggestions

        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};


// ✨ This function remains unchanged
export const updateProfilePicture = async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ msg: "No image provided" });
  }
  try {
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: "profile_pictures",
      resource_type: "image",
    });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: uploadedResponse.secure_url },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// ✨ UPDATED: This function now handles fullName and country
export const updateProfileDetails = async (req, res) => {
  const { bio, fullName, country } = req.body;

  const fieldsToUpdate = {};
  if (bio !== undefined) fieldsToUpdate.bio = bio;
  if (fullName !== undefined) fieldsToUpdate.fullName = fullName;
  if (country !== undefined) fieldsToUpdate.country = country;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const searchUsers = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ msg: "Search query is required" });
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // Case-insensitive search
    })
      .select("username profilePicture")
      .limit(10); // Limit to 10 results

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// ... (keep all existing imports and functions)

// ✨ NEW: Function to get a user's followers
export const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "followers",
      "username profilePicture fullName" // Select the fields you want to show
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.followers);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// ✨ NEW: Function to get the list of users someone is following
export const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "following",
      "username profilePicture fullName" // Select the fields you want to show
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.following);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
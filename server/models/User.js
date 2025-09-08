import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Changed: Username is no longer strictly required at first 
    // to allow Google users to create accounts smoothly.
    username: { 
      type: String, 
      unique: true, 
      trim: true,
      sparse: true // Allows multiple users to have 'null' username until they set one
    },
    email: { type: String, required: true, unique: true },
    
    // Changed: Password is false (already correct in your snippet)
    password: { type: String, required: false },

    // Added: googleId to identify the user when they return
    googleId: { type: String, unique: true, sparse: true },

    profilePicture: {
      type: String,
      default: null,
    },

    bio: { type: String, default: "", maxLength: 150 },
    country: { type: String },
    fullName: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
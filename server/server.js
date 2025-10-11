import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"; 

const app = express();

// --- MIDDLEWARE ---
// ✨ These lines MUST come BEFORE your routes
const corsOptions = {
  origin:
    "https://moment-share-3u3tc8fq8-anurag-singhs-projects-5f7d2f41.vercel.app",
};

// Use the specific CORS options
app.use(cors(corsOptions));


app.use(express.json({ limit: "50mb" })); // This line parses incoming JSON requests
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully! 🚀");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// ✨ CALL THE FUNCTION TO CONNECT TO THE DATABASE
connectDB();

// --- ROUTES ---
// ✨ Your routes are defined AFTER the middleware
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/notifications", notificationRoutes);


// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

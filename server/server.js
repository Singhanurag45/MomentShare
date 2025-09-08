import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"; 
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((s) => s.trim()).filter(Boolean)
  : [];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const o = String(origin).trim();
  if (allowedOrigins.includes(o)) return true;

  // Optional: allow Vercel preview + prod domains for this app
  // e.g. https://moment-share-beta.vercel.app and preview URLs on *.vercel.app
  try {
    const { hostname } = new URL(o);
    if (hostname === "moment-share-beta.vercel.app") return true;
    if (hostname.endsWith(".vercel.app")) return true;
  } catch {
    // ignore invalid origin formats
  }

  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming origin is in our allowed list
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/ai", aiRoutes);


// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} and bound to 0.0.0.0`);
});

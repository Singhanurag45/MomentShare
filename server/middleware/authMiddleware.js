// server/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- DEBUG LOGS START ---
      console.log("--- Auth Middleware Debug ---");
      console.log("Decoded Token Payload:", decoded);

      // Let's get the user ID from the payload
      const userId = decoded.user.id;
      console.log("Searching for user with ID:", userId);

      const userFromDb = await User.findById(userId).select("-password");
      console.log("User found in DB:", userFromDb);
      console.log("---------------------------");
      // --- DEBUG LOGS END ---

      if (!userFromDb) {
        // If user is not found, even with a valid token, deny access.
        return res.status(401).json({ msg: "Not authorized, user not found" });
      }

      req.user = userFromDb;

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ msg: "Not authorized, no token" });
  }
};

export default authMiddleware;

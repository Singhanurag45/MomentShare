import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.password) {
      return res.status(400).json({ msg: "This account uses Google sign-in. Please use Continue with Google." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const logout = (req, res) => {
    // In a stateless JWT system, the client is responsible for destroying the token.
    // This backend endpoint is simply for good practice to acknowledge the logout request.
    res.status(200).json({ msg: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    // The user object is attached to req by authMiddleware
    // We already selected '-password' in the middleware
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ msg: "Google credential is required" });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] }).select("-password");
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture) user.profilePicture = picture;
        if (name) user.fullName = name;
        await user.save();
      }
    } else {
      const baseUsername = (name || email).replace(/\s+/g, "").toLowerCase().slice(0, 20) || "user";
      let username = baseUsername;
      let suffix = 0;
      while (await User.findOne({ username })) {
        suffix += 1;
        username = `${baseUsername}${suffix}`;
      }
      user = new User({
        username,
        email,
        googleId,
        fullName: name || "",
        profilePicture: picture || null,
      });
      await user.save();
      user = user.toObject();
      delete user.password;
    }

    const tokenPayload = { user: { id: user._id || user.id } };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "5h" });
    res.json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ msg: "Invalid Google credential" });
  }
};
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    res.json({ token, user });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    res.json({ token, user });
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
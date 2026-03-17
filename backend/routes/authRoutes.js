import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password, role });
  res.status(201).json({ 
    _id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role, 
    token: generateToken(user._id) 
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

 const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
});

// Get current user profile
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

export default router;


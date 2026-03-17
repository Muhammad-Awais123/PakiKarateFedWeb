import jwt from "jsonwebtoken";
import User from "../models/User.js";

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export const adminLogin = async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || "").toLowerCase().trim(), role: "admin" });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  });
};


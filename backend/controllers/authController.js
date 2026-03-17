import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authAdmin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "admin" });

  if (user && await user.matchPassword(password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, name: user.name });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
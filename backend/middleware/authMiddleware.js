import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }
      req.user = user;
      return next();
    } catch (error) {
      console.error(error);
      const isExpired = error?.name === "TokenExpiredError";
      return res.status(401).json({
        message: isExpired ? "Token expired" : "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin only" });
};
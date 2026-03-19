import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

// Routes
import authRoutes from "./routes/authRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import rankingsRoutes from "./routes/rankingsRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import adminRegistrationRoutes from "./routes/adminRegistrationRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminEventsRoutes from "./routes/adminEventsRoutes.js";
import registrationsRoutes from "./routes/registrationsRoutes.js";
import adminEventRegistrationsRoutes from "./routes/adminEventRegistrationsRoutes.js";
import adminRankingsRoutes from "./routes/adminRankingsRoutes.js";
import playersRoutes from "./routes/playersRoutes.js";
import coachesRoutes from "./routes/coachesRoutes.js";
import legendsRoutes from "./routes/legendsRoutes.js";
import adminPlayersRoutes from "./routes/adminPlayersRoutes.js";
import adminCoachesRoutes from "./routes/adminCoachesRoutes.js";
import adminLegendsRoutes from "./routes/adminLegendsRoutes.js";

// Middleware
import { protect, admin } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header).
      if (!origin) return callback(null, true);

      const allowed = process.env.CORS_ORIGIN;
      if (!allowed || allowed === "*") return callback(null, true);

      // Always allow local dev ports.
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      // Support comma-separated origin allowlist in env.
      const allowedList = allowed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (allowedList.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());

// Static uploads (optional for viewing uploaded photos)
app.use("/uploads", express.static("uploads"));

// Base health check
app.get("/", (req, res) => res.send("API is running 🚀"));

const adminMiddleware = [protect, admin];

// Rate-limit admin login to reduce brute-force attempts.
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

app.use("/api/admin/login", (req, res, next) => {
  if (req.method !== "POST") return next();
  return adminLoginLimiter(req, res, next);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/rankings", rankingsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/registrations", registrationsRoutes);
app.use("/api/players", playersRoutes);
app.use("/api/coaches", coachesRoutes);
app.use("/api/legends", legendsRoutes);
app.use("/api/admin", adminEventRegistrationsRoutes);
app.use("/api/admin", adminRegistrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminEventsRoutes);
app.use("/api/admin", adminRankingsRoutes);
app.use("/api/admin/players", ...adminMiddleware, adminPlayersRoutes);
app.use("/api/admin/coaches", ...adminMiddleware, adminCoachesRoutes);
app.use("/api/admin/legends", ...adminMiddleware, adminLegendsRoutes);

// MongoDB connection
mongoose.set("strictQuery", false);

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
};

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
});

// Start server only after DB is connected
startServer();
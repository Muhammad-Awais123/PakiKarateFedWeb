import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

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

// Middleware
import { protect, admin } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads (optional for viewing uploaded photos)
app.use("/uploads", express.static("uploads"));

// Base health check
app.get("/", (req, res) => res.send("API is running 🚀"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/rankings", rankingsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/registrations", registrationsRoutes);
app.use("/api/admin", adminRegistrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminEventsRoutes);
app.use("/api/admin", adminEventRegistrationsRoutes);
app.use("/api/admin", adminRankingsRoutes);

// MongoDB connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.error("MongoDB connection error:", err));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
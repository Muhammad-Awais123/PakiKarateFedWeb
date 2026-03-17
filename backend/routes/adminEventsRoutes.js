import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { uploadEventImage } from "../middleware/uploadMiddleware.js";
import {
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
} from "../controllers/adminEventsController.js";

const router = express.Router();

router.post("/events", protect, admin, uploadEventImage.single("image"), adminCreateEvent);
router.put("/events/:id", protect, admin, uploadEventImage.single("image"), adminUpdateEvent);
router.delete("/events/:id", protect, admin, adminDeleteEvent);

export default router;


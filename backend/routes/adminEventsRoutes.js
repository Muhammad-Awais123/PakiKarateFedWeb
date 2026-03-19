import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { uploadEventFiles } from "../middleware/uploadMiddleware.js";
import {
  adminListEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  adminTogglePublish,
  adminToggleFeature,
} from "../controllers/adminEventsController.js";

const router = express.Router();

// Admin list (supports all public filters + isPublished/status toggles)
router.get("/events", protect, admin, adminListEvents);

router.post("/events", protect, admin, uploadEventFiles, adminCreateEvent);
router.put("/events/:id", protect, admin, uploadEventFiles, adminUpdateEvent);

// Toggle publish/feature flags.
router.put("/events/:id/publish", protect, admin, adminTogglePublish);
router.put("/events/:id/feature", protect, admin, adminToggleFeature);

router.delete("/events/:id", protect, admin, adminDeleteEvent);

export default router;


import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  adminCreateEvent,
  adminDeleteEvent,
  adminGetEvents,
  adminGetSchema,
  adminUpdateEvent,
  adminUpsertSchema,
} from "../controllers/adminRegistrationController.js";
import {
  adminListRegistrations,
  adminUpdateRegistrationStatus,
} from "../controllers/adminRegistrationsController.js";

const router = express.Router();

// Admin: manage registration events used by schema-driven registration config
// Note: kept separate from main site events (/api/admin/events).
router.get("/registration-events", protect, admin, adminGetEvents);
router.post("/registration-events", protect, admin, adminCreateEvent);
router.put("/registration-events/:id", protect, admin, adminUpdateEvent);
router.delete("/registration-events/:id", protect, admin, adminDeleteEvent);

// Admin: manage registration schema/config
router.get("/schema", protect, admin, adminGetSchema);
router.post("/schema", protect, admin, adminUpsertSchema);

// Admin: manage registrations (approve/reject)
router.get("/registrations", protect, admin, adminListRegistrations);
router.put("/registrations/:id/status", protect, admin, adminUpdateRegistrationStatus);

export default router;


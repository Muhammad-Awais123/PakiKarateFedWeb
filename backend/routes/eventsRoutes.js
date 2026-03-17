import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventsApiController.js";

const router = express.Router();

router.get("/", listEvents);
router.get("/:id", getEventById);
// Admin CRUD is served under /api/admin/events (see adminEventsRoutes.js)

export default router;
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  adminListEventRegistrations,
  adminUpdateEventRegistrationStatus,
} from "../controllers/eventRegistrationsController.js";

const router = express.Router();

router.get("/registrations", protect, admin, adminListEventRegistrations);
router.put("/registrations/:id/status", protect, admin, adminUpdateEventRegistrationStatus);

export default router;


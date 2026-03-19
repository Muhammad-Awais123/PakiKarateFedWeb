import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  adminListEventRegistrations,
  adminGetEventRegistration,
  adminUpdateEventRegistrationStatus,
} from "../controllers/eventRegistrationsController.js";

const router = express.Router();

router.get("/registrations", protect, admin, adminListEventRegistrations);
router.get("/registrations/:id", protect, admin, adminGetEventRegistration);
router.put("/registrations/:id/status", protect, admin, adminUpdateEventRegistrationStatus);

export default router;


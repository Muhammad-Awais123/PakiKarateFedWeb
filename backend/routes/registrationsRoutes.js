import express from "express";
import { uploadPaymentScreenshot } from "../middleware/uploadMiddleware.js";
import {
  createEventRegistration,
  listPublicRegistrations,
} from "../controllers/eventRegistrationsController.js";

const router = express.Router();

router.get("/", listPublicRegistrations);
router.post("/", uploadPaymentScreenshot.single("paymentScreenshot"), createEventRegistration);

export default router;


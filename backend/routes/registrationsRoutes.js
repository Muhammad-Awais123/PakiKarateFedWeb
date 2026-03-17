import express from "express";
import { uploadPaymentScreenshot } from "../middleware/uploadMiddleware.js";
import {
  createEventRegistration,
} from "../controllers/eventRegistrationsController.js";

const router = express.Router();

router.post("/", uploadPaymentScreenshot.single("paymentScreenshot"), createEventRegistration);

export default router;


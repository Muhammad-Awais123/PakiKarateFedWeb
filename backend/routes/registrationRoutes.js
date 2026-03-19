import express from "express";
import { getRegistrationConfig, submitRegistration } from "../controllers/registrationController.js";
import { uploadRegistrationPhoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public: load dynamic schema + options + events
router.get("/config", getRegistrationConfig);

// Public: submit registration (JSON or multipart/form-data)
router.post("/submit", uploadRegistrationPhoto.single("photo"), submitRegistration);

export default router;


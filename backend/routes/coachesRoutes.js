import express from "express";
import { listCoaches, getCoachById } from "../controllers/coachesController.js";

const router = express.Router();

router.get("/", listCoaches);
router.get("/:id", getCoachById);

export default router;


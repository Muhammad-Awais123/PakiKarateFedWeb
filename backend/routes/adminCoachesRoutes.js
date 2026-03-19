import express from "express";
import {
  adminListCoaches,
  adminCreateCoach,
  adminUpdateCoach,
  adminDeleteCoach,
} from "../controllers/coachesController.js";
import { uploadPersonPhoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", adminListCoaches);
router.post("/", uploadPersonPhoto.single("photo"), adminCreateCoach);
router.put("/:id", uploadPersonPhoto.single("photo"), adminUpdateCoach);
router.delete("/:id", adminDeleteCoach);

export default router;


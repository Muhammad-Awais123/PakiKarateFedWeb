import express from "express";
import {
  adminListPlayers,
  adminCreatePlayer,
  adminUpdatePlayer,
  adminDeletePlayer,
} from "../controllers/playersController.js";
import { uploadPersonPhoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", adminListPlayers);
router.post("/", uploadPersonPhoto.single("photo"), adminCreatePlayer);
router.put("/:id", uploadPersonPhoto.single("photo"), adminUpdatePlayer);
router.delete("/:id", adminDeletePlayer);

export default router;


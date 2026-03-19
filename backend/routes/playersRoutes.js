import express from "express";
import { listPlayers, getPlayerById } from "../controllers/playersController.js";

const router = express.Router();

router.get("/", listPlayers);
router.get("/:id", getPlayerById);

export default router;


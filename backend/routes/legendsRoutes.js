import express from "express";
import { listLegends, getLegendById } from "../controllers/legendsController.js";

const router = express.Router();

router.get("/", listLegends);
router.get("/:id", getLegendById);

export default router;


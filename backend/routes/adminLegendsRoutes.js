import express from "express";
import {
  adminListLegends,
  adminCreateLegend,
  adminUpdateLegend,
  adminDeleteLegend,
} from "../controllers/legendsController.js";
import { uploadPersonPhoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", adminListLegends);
router.post("/", uploadPersonPhoto.single("photo"), adminCreateLegend);
router.put("/:id", uploadPersonPhoto.single("photo"), adminUpdateLegend);
router.delete("/:id", adminDeleteLegend);

export default router;


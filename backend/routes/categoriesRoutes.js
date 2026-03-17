import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", listCategories);
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;


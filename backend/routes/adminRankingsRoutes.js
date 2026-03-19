import express from "express";
import Ranking from "../models/Ranking.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/rankings", protect, admin, async (req, res) => {
  try {
    const created = await Ranking.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.put("/rankings/:id", protect, admin, async (req, res) => {
  try {
    const updated = await Ranking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Ranking not found" });
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.delete("/rankings/:id", protect, admin, async (req, res) => {
  try {
    const deleted = await Ranking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ranking not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

export default router;


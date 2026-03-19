import express from "express";
import Ranking from "../models/Ranking.js";

const router = express.Router();

// =====================
// GET all rankings
// =====================
router.get("/", async (req, res) => {
  try {
    const rankings = await Ranking.find({}).sort({ rank: 1 });
    res.status(200).json({
      success: true,
      data: rankings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
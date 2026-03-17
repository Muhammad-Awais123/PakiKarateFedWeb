import Ranking from "../models/Ranking.js";

// GET all rankings
export const getRankings = async (req, res) => {
  const rankings = await Ranking.find().sort({ rank: 1 });
  res.json(rankings);
};

// CREATE
export const createRanking = async (req, res) => {
  const ranking = new Ranking(req.body);
  const saved = await ranking.save();
  res.status(201).json(saved);
};

// UPDATE
export const updateRanking = async (req, res) => {
  const ranking = await Ranking.findById(req.params.id);
  if (!ranking) return res.status(404).json({ message: "Ranking not found" });
  Object.assign(ranking, req.body);
  const updated = await ranking.save();
  res.json(updated);
};

// DELETE
export const deleteRanking = async (req, res) => {
  const ranking = await Ranking.findById(req.params.id);
  if (!ranking) return res.status(404).json({ message: "Ranking not found" });
  await ranking.deleteOne();
  res.json({ message: "Ranking deleted" });
};
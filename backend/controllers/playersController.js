import Player from "../models/Player.js";

function parseAchievements(v) {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string") {
    try {
      const a = JSON.parse(v);
      return Array.isArray(a) ? a.map(String).filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseBool(v) {
  if (v === true || v === false) return v;
  if (typeof v === "string") return v === "true";
  return false;
}

function normalizePlayerPayload(body) {
  const o = { ...body };
  o.achievements = parseAchievements(o.achievements);
  o.isActive = parseBool(o.isActive);
  if (!o.dob || o.dob === "") delete o.dob;
  delete o._id;
  return o;
}

// Public
export const listPlayers = async (req, res) => {
  try {
    const players = await Player.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: players });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player || !player.isActive) {
      return res.status(404).json({ success: false, message: "Player not found" });
    }
    res.json({ success: true, data: player });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin
export const adminListPlayers = async (req, res) => {
  try {
    const players = await Player.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: players });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const adminCreatePlayer = async (req, res) => {
  try {
    const payload = normalizePlayerPayload(req.body);
    if (req.file) {
      payload.photo = `/uploads/persons/${req.file.filename}`;
    }
    const created = await Player.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminUpdatePlayer = async (req, res) => {
  try {
    const updates = normalizePlayerPayload(req.body);
    if (req.file) {
      updates.photo = `/uploads/persons/${req.file.filename}`;
    }
    const updated = await Player.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Player not found" });
    }
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminDeletePlayer = async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Player not found" });
    }
    res.json({ success: true, message: "Player deleted successfully" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};


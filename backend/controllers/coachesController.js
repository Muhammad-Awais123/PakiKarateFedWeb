import Coach from "../models/Coach.js";

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

function normalizeCoachPayload(body) {
  const o = { ...body };
  o.achievements = parseAchievements(o.achievements);
  o.isActive = parseBool(o.isActive);
  if (o.yearsOfExperience != null && o.yearsOfExperience !== "")
    o.yearsOfExperience = Number(o.yearsOfExperience);
  delete o._id;
  return o;
}

// Public
export const listCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: coaches });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach || !coach.isActive) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    res.json({ success: true, data: coach });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin
export const adminListCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: coaches });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const adminCreateCoach = async (req, res) => {
  try {
    const payload = normalizeCoachPayload(req.body);
    if (req.file) {
      payload.photo = `/uploads/persons/${req.file.filename}`;
    }
    const created = await Coach.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminUpdateCoach = async (req, res) => {
  try {
    const updates = normalizeCoachPayload(req.body);
    if (req.file) {
      updates.photo = `/uploads/persons/${req.file.filename}`;
    }
    const updated = await Coach.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminDeleteCoach = async (req, res) => {
  try {
    const deleted = await Coach.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    res.json({ success: true, message: "Coach deleted successfully" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};


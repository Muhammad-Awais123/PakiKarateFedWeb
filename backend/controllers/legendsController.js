import Legend from "../models/Legend.js";

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

function normalizeLegendPayload(body) {
  const o = { ...body };
  o.achievements = parseAchievements(o.achievements);
  o.isFeatured = parseBool(o.isFeatured);
  delete o._id;
  return o;
}

// Public
export const listLegends = async (req, res) => {
  try {
    const legends = await Legend.find({}).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, data: legends });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getLegendById = async (req, res) => {
  try {
    const legend = await Legend.findById(req.params.id);
    if (!legend) {
      return res.status(404).json({ success: false, message: "Legend not found" });
    }
    res.json({ success: true, data: legend });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin
export const adminListLegends = async (req, res) => {
  try {
    const legends = await Legend.find({}).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, data: legends });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const adminCreateLegend = async (req, res) => {
  try {
    const payload = normalizeLegendPayload(req.body);
    if (req.file) {
      payload.photo = `/uploads/persons/${req.file.filename}`;
    }
    const created = await Legend.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminUpdateLegend = async (req, res) => {
  try {
    const updates = normalizeLegendPayload(req.body);
    if (req.file) {
      updates.photo = `/uploads/persons/${req.file.filename}`;
    }
    const updated = await Legend.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Legend not found" });
    }
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminDeleteLegend = async (req, res) => {
  try {
    const deleted = await Legend.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Legend not found" });
    }
    res.json({ success: true, message: "Legend deleted successfully" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};


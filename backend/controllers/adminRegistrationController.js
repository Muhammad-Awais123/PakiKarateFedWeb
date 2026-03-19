import RegistrationConfig from "../models/RegistrationConfig.js";
import RegistrationEvent from "../models/RegistrationEvent.js";

export const adminGetEvents = async (req, res) => {
  try {
    const events = await RegistrationEvent.find({}).sort({ startDate: 1 });
    res.json({ success: true, data: events });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const adminCreateEvent = async (req, res) => {
  try {
    const { name, category, startDate } = req.body || {};
    const created = await RegistrationEvent.create({ name, category, startDate });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminUpdateEvent = async (req, res) => {
  try {
    const updated = await RegistrationEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminDeleteEvent = async (req, res) => {
  try {
    const deleted = await RegistrationEvent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, message: "Event deleted" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminGetSchema = async (req, res) => {
  const config = await RegistrationConfig.findOne({ key: "active" }).lean();
  if (!config) return res.status(404).json({ message: "Registration config not found" });
  res.json({
    success: true,
    schema: config.schema,
    options: config.options,
    meta: config.meta,
  });
};

export const adminUpsertSchema = async (req, res) => {
  const { schema, options, meta } = req.body || {};
  if (!schema?.sections || !meta) {
    return res.status(400).json({
      message: "Invalid payload. Provide { schema, options, meta } with schema.sections.",
    });
  }

  const next = await RegistrationConfig.findOneAndUpdate(
    { key: "active" },
    {
      key: "active",
      schema,
      options: options || {},
      meta,
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: "Registration schema updated",
    id: next._id,
  });
};


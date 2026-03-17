import Event from "../models/Event.js";

function getUploadedPath(req, fieldName) {
  const f = req.file;
  if (!f) return "";
  if (f.fieldname !== fieldName) return "";
  // served by server.js at /uploads
  return `/uploads/events/${f.filename}`;
}

export const adminCreateEvent = async (req, res) => {
  const imagePath = getUploadedPath(req, "image");
  const payload = { ...(req.body || {}) };
  if (imagePath) payload.image = imagePath;

  // Support `title` input while keeping `name` required.
  if (!payload.name && payload.title) payload.name = payload.title;
  if (!payload.title && payload.name) payload.title = payload.name;

  const created = await Event.create(payload);
  const populated = await Event.findById(created._id).populate("categoryId", "name slug");
  res.status(201).json({ success: true, data: populated });
};

export const adminUpdateEvent = async (req, res) => {
  const imagePath = getUploadedPath(req, "image");
  const updates = { ...(req.body || {}) };
  if (imagePath) updates.image = imagePath;

  if (updates.title && !updates.name) updates.name = updates.title;
  if (updates.name && !("title" in updates)) updates.title = updates.name;

  const updated = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("categoryId", "name slug");

  if (!updated) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true, data: updated });
};

export const adminDeleteEvent = async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true, message: "Event deleted" });
};


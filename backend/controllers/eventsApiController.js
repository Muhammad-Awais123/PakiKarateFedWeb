import Event from "../models/Event.js";
import EventCategory from "../models/EventCategory.js";

export const listEvents = async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) {
    // Accept categoryId or category slug
    const byId = await EventCategory.findById(category).select("_id").lean().catch(() => null);
    if (byId?._id) filter.categoryId = byId._id;
    else {
      const bySlug = await EventCategory.findOne({ slug: String(category).toLowerCase() })
        .select("_id")
        .lean();
      if (bySlug?._id) filter.categoryId = bySlug._id;
      else return res.status(400).json({ message: "Invalid category filter" });
    }
  }

  const events = await Event.find(filter)
    .populate("categoryId", "name slug")
    .sort({ startDate: 1 });

  res.json({ success: true, data: events });
};

export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate("categoryId", "name slug");
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true, data: event });
};

export const createEvent = async (req, res) => {
  const { name, categoryId, startDate, endDate, type, location, description } = req.body || {};
  const created = await Event.create({
    name,
    categoryId,
    startDate,
    endDate,
    type: type || "",
    location: location || "",
    description: description || "",
  });
  const populated = await Event.findById(created._id).populate("categoryId", "name slug");
  res.status(201).json({ success: true, data: populated });
};

export const updateEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("categoryId", "name slug");
  if (!updated) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true, data: updated });
};

export const deleteEvent = async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true, message: "Event deleted" });
};


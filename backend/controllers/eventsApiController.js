import Event from "../models/Event.js";
import { derivePublicStatus, serializeEvent } from "../utils/eventSerializer.js";

function escapeRegex(input) {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSort(sort) {
  if (sort === "date_desc") return { startDate: -1 };
  return { startDate: 1 };
}

function buildPublicQuery(queryParams = {}) {
  const { level, type, category, status, search, featured } = queryParams;
  const query = {
    $or: [{ isPublished: true }, { isPublished: { $exists: false } }],
  };

  if (level) query.level = String(level);
  if (type) query.type = String(type);
  if (category) query.category = String(category);
  if (String(featured).toLowerCase() === "true") query.isFeatured = true;

  if (status) {
    const now = new Date();
    if (String(status).toLowerCase() === "upcoming") {
      query.endDate = { $gte: now };
    } else if (String(status).toLowerCase() === "completed") {
      query.endDate = { $lt: now };
    } else {
      throw new Error("Invalid status filter");
    }
  }

  if (search) {
    const re = new RegExp(escapeRegex(search), "i");
    query.$and = [
      {
        $or: [{ event_name: re }, { title: re }, { name: re }, { location: re }],
      },
    ];
  }

  return query;
}

export const listEvents = async (req, res) => {
  try {
    const { limit, sort } = req.query;
    const query = buildPublicQuery(req.query);
    const sortQuery = buildSort(sort);
    const limitNum = limit ? Math.max(1, Math.min(100, Number(limit) || 0)) : 0;

    let dbQuery = Event.find(query).sort(sortQuery);
    if (limitNum) dbQuery = dbQuery.limit(limitNum);

    const events = await dbQuery.exec();
    const data = events.map(serializeEvent);
    return res.json({ success: true, data });
  } catch (error) {
    if (error?.message === "Invalid status filter") {
      return res.status(400).json({ message: "Invalid status filter" });
    }
    return res.status(500).json({ message: error.message || "Failed to fetch events" });
  }
};

export const getEventById = async (req, res) => {
  const rawId = req.params.id;
  const event =
    (await Event.findById(rawId).exec()) ||
    (await Event.findOne({ slug: String(rawId) }).exec());

  if (!event) return res.status(404).json({ message: "Event not found" });
  return res.json({ success: true, data: serializeEvent(event) });
};

export const createEvent = async (req, res) => {
  const payload = req.body || {};
  const event_name = payload.event_name || payload.title || payload.name;
  const startDate = payload.startDate || payload.date;
  const endDate = payload.endDate || payload.date;

  const created = await Event.create({
    event_name,
    name: event_name,
    title: event_name,
    level: payload.level || "National",
    type: payload.type || "Games",
    category: payload.category || "Senior",
    startDate,
    endDate,
    location: payload.location || "",
    description: payload.description || "",
    image: payload.image || "",
    bannerImage: payload.image || payload.bannerImage || "",
    status: payload.status || undefined,
    isPublished: payload.isPublished ?? true,
  });

  return res.status(201).json({ success: true, data: serializeEvent(created) });
};

export const updateEvent = async (req, res) => {
  const payload = req.body || {};
  const updates = { ...payload };
  if (payload.event_name) {
    updates.event_name = payload.event_name;
    updates.name = payload.event_name;
    updates.title = payload.event_name;
  }
  if (payload.date && !payload.startDate) updates.startDate = payload.date;
  if (payload.date && !payload.endDate) updates.endDate = payload.date;
  if (payload.image && !payload.bannerImage) updates.bannerImage = payload.image;

  const updated = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).exec();
  if (!updated) return res.status(404).json({ message: "Event not found" });
  return res.json({ success: true, data: serializeEvent(updated) });
};

export const deleteEvent = async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Event not found" });
  return res.json({ success: true, message: "Event deleted" });
};

export const getNextEvent = async (req, res) => {
  const now = new Date();
  const next = await Event.find({
    $or: [{ isPublished: true }, { isPublished: { $exists: false } }],
    endDate: { $gte: now },
  })
    .sort({ startDate: 1 })
    .limit(1)
    .exec();

  const item = next?.[0] || null;
  if (!item) return res.status(404).json({ message: "No upcoming event found" });
  return res.json({ success: true, data: { ...serializeEvent(item), status: derivePublicStatus(item) } });
};

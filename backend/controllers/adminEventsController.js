import Event from "../models/Event.js";

function parseBool(value) {
  if (typeof value === "boolean") return value;
  if (value === undefined || value === null) return undefined;
  return String(value).toLowerCase() === "true";
}

function parseJsonArray(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return undefined;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function parseCompetitionCategories(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return undefined;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function getUploadedPath(req, fieldName) {
  const arr = req.files?.[fieldName];
  const f = Array.isArray(arr) ? arr[0] : null;
  if (!f) return "";
  return `/uploads/events/${f.filename}`;
}

function coalesceLegacyImages(updates) {
  // If only legacy `image` exists, map it to new `bannerImage`.
  if (!updates.bannerImage && updates.image) {
    updates.bannerImage = updates.image;
  }
  // If new bannerImage exists, also populate legacy `image` for frontend compatibility.
  if (updates.bannerImage && !updates.image) {
    updates.image = updates.bannerImage;
  }
  return updates;
}

function getStatusDateFilter(statusValue) {
  if (!statusValue) return undefined;
  const now = new Date();
  const s = String(statusValue).toLowerCase();

  if (s === "upcoming") return { startDate: { $gt: now } };
  if (s === "ongoing") return { startDate: { $lte: now }, endDate: { $gte: now } };
  if (s === "completed") return { endDate: { $lt: now } };
  if (s === "cancelled") return { status: "cancelled" };
  return undefined;
}

export const adminListEvents = async (req, res) => {
  const {
    level,
    majorCategory,
    seriesName,
    type,
    category,
    ageGroup,
    discipline,
    status,
    featured,
    search,
    limit,
    sort,
    isPublished,
  } = req.query;

  const query = {};

  if (level) query.level = String(level);
  if (type) query.type = String(type);
  if (category) query.category = String(category);
  if (majorCategory) query.majorCategory = String(majorCategory);
  if (seriesName) query.seriesName = String(seriesName);
  if (ageGroup) query.ageGroups = { $in: [String(ageGroup)] };
  if (discipline) query.disciplines = { $in: [String(discipline)] };
  if (String(featured).toLowerCase() === "true") query.isFeatured = true;

  if (isPublished === "true" || isPublished === "false") {
    query.isPublished = parseBool(isPublished);
  }

  const dateStatusFilter = getStatusDateFilter(status);
  if (dateStatusFilter) Object.assign(query, dateStatusFilter);

  if (search) {
    const q = String(search).trim();
    if (q) {
      const re = new RegExp(
        q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      query.$or = [{ event_name: re }, { title: re }, { name: re }, { city: re }, { location: re }];
    }
  }

  const sortOrder = sort === "date_desc" ? -1 : sort === "date_asc" ? 1 : 1;
  const limitNum = limit ? Math.max(1, Math.min(50, Number(limit) || 0)) : null;

  let mongoQuery = Event.find(query)
    .populate("categoryId", "name slug")
    .sort({ startDate: sortOrder });
  if (limitNum) mongoQuery = mongoQuery.limit(limitNum);

  const events = await mongoQuery.exec();
  res.json({ success: true, data: events });
};

export const adminCreateEvent = async (req, res) => {
  const payload = { ...(req.body || {}) };

  // Files (bannerImage + pdfs)
  const bannerImagePath = getUploadedPath(req, "bannerImage") || getUploadedPath(req, "image");
  const bulletinPdfPath = getUploadedPath(req, "bulletinPdf");
  const programmePdfPath = getUploadedPath(req, "programmePdf");

  if (bannerImagePath) payload.bannerImage = bannerImagePath;
  if (bulletinPdfPath) payload.bulletinPdf = bulletinPdfPath;
  if (programmePdfPath) payload.programmePdf = programmePdfPath;

  if (payload.event_name && !payload.name) payload.name = payload.event_name;
  if (payload.event_name && !payload.title) payload.title = payload.event_name;
  if (!payload.event_name && (payload.title || payload.name)) {
    payload.event_name = payload.title || payload.name;
  }

  // Support `title` input while keeping `name` required.
  if (!payload.name && payload.title) payload.name = payload.title;
  if (!payload.title && payload.name) payload.title = payload.name;

  if (payload.date && !payload.startDate) payload.startDate = payload.date;
  if (payload.date && !payload.endDate) payload.endDate = payload.date;
  if (!payload.endDate && payload.startDate) payload.endDate = payload.startDate;

  if (!payload.level) payload.level = "National";
  if (!payload.type) payload.type = "Games";
  if (!payload.category) payload.category = "Senior";

  // Parse WKF hierarchy fields (FormData sends JSON strings)
  if ("competitionCategories" in payload) {
    const parsedCompetitionCategories = parseCompetitionCategories(payload.competitionCategories);
    if (parsedCompetitionCategories !== undefined)
      payload.competitionCategories = parsedCompetitionCategories;
    else delete payload.competitionCategories;
  }

  if ("ageGroups" in payload) {
    const parsedAgeGroups = parseJsonArray(payload.ageGroups);
    if (parsedAgeGroups !== undefined) payload.ageGroups = parsedAgeGroups;
    else delete payload.ageGroups;
  }

  if ("disciplines" in payload) {
    const parsedDisciplines = parseJsonArray(payload.disciplines);
    if (parsedDisciplines !== undefined) payload.disciplines = parsedDisciplines;
    else delete payload.disciplines;
  }

  // Coerce booleans if present
  const boolFields = ["registrationOpen", "statusOverride", "isFeatured", "showCountdown", "isPublished"];
  for (const bf of boolFields) {
    if (bf in payload) payload[bf] = parseBool(payload[bf]);
  }

  // Legacy compatibility: map bannerImage <-> image so current frontend keeps working.
  coalesceLegacyImages(payload);

  // Convenience mapping: if UI only sends `type`, also populate `eventType`.
  if (!payload.eventType && payload.type) payload.eventType = payload.type;

  const created = await Event.create(payload);
  const populated = await Event.findById(created._id).populate("categoryId", "name slug");
  res.status(201).json({ success: true, data: populated });
};

export const adminUpdateEvent = async (req, res) => {
  const updates = { ...(req.body || {}) };

  // Files (bannerImage + pdfs)
  const bannerImagePath = getUploadedPath(req, "bannerImage") || getUploadedPath(req, "image");
  const bulletinPdfPath = getUploadedPath(req, "bulletinPdf");
  const programmePdfPath = getUploadedPath(req, "programmePdf");

  if (bannerImagePath) updates.bannerImage = bannerImagePath;
  if (bulletinPdfPath) updates.bulletinPdf = bulletinPdfPath;
  if (programmePdfPath) updates.programmePdf = programmePdfPath;

  if (updates.event_name && !updates.name) updates.name = updates.event_name;
  if (updates.event_name && !updates.title) updates.title = updates.event_name;
  if (!updates.event_name && (updates.title || updates.name)) {
    updates.event_name = updates.title || updates.name;
  }

  // Support `title` input while keeping `name` required.
  if (updates.title && !updates.name) updates.name = updates.title;
  if (updates.name && !("title" in updates)) updates.title = updates.name;

  if (updates.date && !updates.startDate) updates.startDate = updates.date;
  if (updates.date && !updates.endDate) updates.endDate = updates.date;
  if (!updates.endDate && updates.startDate) updates.endDate = updates.startDate;

  // Parse WKF hierarchy fields
  if ("competitionCategories" in updates) {
    const parsed = parseCompetitionCategories(updates.competitionCategories);
    if (parsed !== undefined) updates.competitionCategories = parsed;
    else delete updates.competitionCategories;
  }

  if ("ageGroups" in updates) {
    const parsed = parseJsonArray(updates.ageGroups);
    if (parsed !== undefined) updates.ageGroups = parsed;
    else delete updates.ageGroups;
  }

  if ("disciplines" in updates) {
    const parsed = parseJsonArray(updates.disciplines);
    if (parsed !== undefined) updates.disciplines = parsed;
    else delete updates.disciplines;
  }

  // Coerce booleans if present
  const boolFields = ["registrationOpen", "statusOverride", "isFeatured", "showCountdown", "isPublished"];
  for (const bf of boolFields) {
    if (bf in updates) updates[bf] = parseBool(updates[bf]);
  }

  coalesceLegacyImages(updates);

  // Convenience mapping: if UI only sends `type`, also populate `eventType`.
  if (!updates.eventType && updates.type) updates.eventType = updates.type;

  const updated = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("categoryId", "name slug");

  if (!updated) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true, data: updated });
};

export const adminTogglePublish = async (req, res) => {
  const { id } = req.params;
  const desired = req.body?.isPublished;
  const event = await Event.findById(id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const nextValue =
    desired === undefined ? !event.isPublished : parseBool(desired);

  const updated = await Event.findByIdAndUpdate(
    id,
    { isPublished: nextValue },
    { new: true, runValidators: true }
  ).populate("categoryId", "name slug");

  res.json({ success: true, data: updated });
};

export const adminToggleFeature = async (req, res) => {
  const { id } = req.params;
  const desired = req.body?.isFeatured;
  const event = await Event.findById(id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const nextValue =
    desired === undefined ? !event.isFeatured : parseBool(desired);

  const updated = await Event.findByIdAndUpdate(
    id,
    { isFeatured: nextValue },
    { new: true, runValidators: true }
  ).populate("categoryId", "name slug");

  res.json({ success: true, data: updated });
};

export const adminDeleteEvent = async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true, message: "Event deleted" });
};


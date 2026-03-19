import { EVENT_CATEGORY_OPTIONS } from "../constants/eventEnums.js";

const EVENT_LEVELS = ["National", "International"];
const EVENT_TYPES = ["Games", "Championship"];

const toIso = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : "";
};

const toLevel = (raw) => {
  if (EVENT_LEVELS.includes(raw?.level)) return raw.level;
  return "National";
};

const toType = (raw) => {
  if (EVENT_TYPES.includes(raw?.type)) return raw.type;
  return "Games";
};

const toCategory = (raw) => {
  if (EVENT_CATEGORY_OPTIONS.includes(raw?.category)) return raw.category;
  return "Senior";
};

const toStatus = (raw, eventDateIso) => {
  if (raw?.status === "upcoming" || raw?.status === "completed") return raw.status;
  if (raw?.computedStatus === "upcoming") return "upcoming";
  if (raw?.computedStatus === "completed") return "completed";

  const eventDate = new Date(eventDateIso).getTime();
  if (!Number.isFinite(eventDate)) return "completed";
  return eventDate > Date.now() ? "upcoming" : "completed";
};

export default function normalizeEvent(raw = {}) {
  const startDate = toIso(raw.startDate || raw.date || raw.createdAt);
  const endDate = toIso(raw.endDate || raw.date || raw.createdAt);
  const date = startDate;
  const status = toStatus(raw, date);
  const location =
    raw.location ||
    [raw.venue, raw.city, raw.country]
      .filter(Boolean)
      .join(", ");

  return {
    _id: raw._id || "",
    event_name: raw.event_name || raw.title || raw.name || "Untitled Event",
    level: toLevel(raw),
    type: toType(raw),
    category: toCategory(raw),
    date,
    startDate,
    endDate,
    location: location || "",
    description: raw.description || "",
    image: raw.image || raw.bannerImage || "",
    status,
    // Pass-through for registration UI + admin display (must match API)
    registrationOpen: Boolean(raw.registrationOpen),
    registrationFee: raw.registrationFee || "",
    registrationDeadline: raw.registrationDeadline
      ? toIso(raw.registrationDeadline)
      : "",
    paymentDetails: raw.paymentDetails || {},
    slug: raw.slug || "",
  };
}

export function derivePublicStatus(event) {
  const now = new Date();
  const end = event?.endDate ? new Date(event.endDate) : null;
  if (end && end < now) return "completed";
  return "upcoming";
}

export function serializeEvent(eventDoc) {
  const event = eventDoc?.toObject ? eventDoc.toObject({ virtuals: true }) : eventDoc;
  if (!event) return null;

  const eventName = event.event_name || event.title || event.name || "Untitled Event";
  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return {
    ...event,
    event_name: eventName,
    level: event.level || "National",
    type: event.type || "Games",
    category: event.category || "Senior",
    date: startDate ? startDate.toISOString() : "",
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate ? endDate.toISOString() : null,
    status: derivePublicStatus(event),
  };
}

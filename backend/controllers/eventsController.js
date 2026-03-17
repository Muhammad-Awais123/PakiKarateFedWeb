import Event from "../models/Event.js";

// GET all events
export const getEvents = async (req, res) => {
  const events = await Event.find().sort({ startDate: 1 });
  res.status(200).json({
  success: true,
  data: events
});
};

// CREATE Event
export const createEvent = async (req, res) => {
  const event = new Event(req.body);
  const saved = await event.save();
  res.status(201).json(saved);
};

// UPDATE Event
export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  Object.assign(event, req.body);
  const updated = await event.save();
  res.json(updated);
};

// DELETE Event
export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  await event.deleteOne();
  res.json({ message: "Event deleted" });
};
import EventRegistration from "../models/EventRegistration.js";
import Event from "../models/Event.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function getUploadedPayment(req) {
  if (!req.file) return null;
  return {
    filename: req.file.filename,
    path: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url: `/uploads/payments/${req.file.filename}`,
  };
}

export const createEventRegistration = async (req, res) => {
  const { eventId, fullName, email, phone, category, club } = req.body || {};

  const errors = {};
  if (!eventId) errors.eventId = "eventId is required.";
  if (!fullName || String(fullName).trim() === "") errors.fullName = "Full name is required.";
  if (!email || !isValidEmail(email)) errors.email = "Valid email is required.";
  if (!phone || String(phone).trim() === "") errors.phone = "Phone is required.";
  if (!category || String(category).trim() === "") errors.category = "Category is required.";
  if (!club || String(club).trim() === "") errors.club = "Club is required.";
  if (!req.file) errors.paymentScreenshot = "Payment screenshot is required.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const eventExists = await Event.findById(eventId).select("_id").lean();
  if (!eventExists) {
    return res.status(404).json({ message: "Event not found" });
  }

  const doc = await EventRegistration.create({
    eventId,
    fullName: String(fullName).trim(),
    email: String(email).toLowerCase().trim(),
    phone: String(phone).trim(),
    category: String(category).trim(),
    club: String(club).trim(),
    paymentScreenshot: getUploadedPayment(req),
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Registration submitted successfully",
    id: doc._id,
  });
};

export const adminListEventRegistrations = async (req, res) => {
  const items = await EventRegistration.find({})
    .populate({ path: "eventId", select: "name startDate endDate location" })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

export const adminUpdateEventRegistrationStatus = async (req, res) => {
  const { status } = req.body || {};
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const updated = await EventRegistration.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: "Registration not found" });
  res.json({ success: true, data: updated });
};


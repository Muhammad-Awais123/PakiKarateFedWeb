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

/** Public: list approved registrations for an event (for Entries tab). */
export const listPublicRegistrations = async (req, res) => {
  try {
    const { eventId, status } = req.query;
    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }
    const q = { eventId, status: status || "approved" };
    const items = await EventRegistration.find(q)
      .select("firstName lastName city province category createdAt")
      .sort({ createdAt: 1 })
      .lean();
    res.json({ success: true, data: items });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const createEventRegistration = async (req, res) => {
  const b = req.body || {};
  const {
    eventId,
    firstName,
    lastName,
    fullName: fullNameBody,
    email,
    phone,
    weightCategory,
    category: catBody,
    beltGrade,
    clubName,
    club: clubBody,
    dob,
    gender,
    city,
    province,
    cnic,
  } = b;

  const category = String(weightCategory || catBody || "").trim();
  const club = String(clubName || clubBody || "").trim();
  const fn = String(firstName || "").trim();
  const ln = String(lastName || "").trim();
  const fullName =
    [fn, ln].filter(Boolean).join(" ").trim() || String(fullNameBody || "").trim();

  const errors = {};
  if (!eventId) errors.eventId = "eventId is required.";
  if (!fullName) errors.name = "Full name is required.";
  if (!email || !isValidEmail(email)) errors.email = "Valid email is required.";
  if (!phone || String(phone).trim() === "") errors.phone = "Phone is required.";
  if (!category) errors.category = "Category is required.";
  if (!club) errors.club = "Club is required.";
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
    firstName: fn,
    lastName: ln,
    fullName,
    email: String(email).toLowerCase().trim(),
    phone: String(phone).trim(),
    dob: dob ? new Date(dob) : undefined,
    gender: String(gender || "").trim(),
    category,
    beltGrade: String(beltGrade || "").trim(),
    club,
    city: String(city || "").trim(),
    province: String(province || "").trim(),
    cnic: String(cnic || "").trim(),
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
  try {
    const q = {};
    if (req.query.eventId) q.eventId = req.query.eventId;
    const items = await EventRegistration.find(q)
      .populate({ path: "eventId", select: "name title startDate endDate location" })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const adminGetEventRegistration = async (req, res) => {
  try {
    const doc = await EventRegistration.findById(req.params.id).populate({
      path: "eventId",
      select: "name title startDate endDate location",
    });
    if (!doc) return res.status(404).json({ message: "Registration not found" });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const adminUpdateEventRegistrationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body || {};
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (status === "rejected" && (!rejectionReason || !String(rejectionReason).trim())) {
      return res.status(400).json({ message: "rejectionReason is required when rejecting" });
    }
    const updates = {
      status,
      reviewedAt: new Date(),
      rejectionReason:
        status === "rejected" ? String(rejectionReason).trim() : "",
    };
    const updated = await EventRegistration.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate({ path: "eventId", select: "name title startDate endDate location" });
    if (!updated) return res.status(404).json({ message: "Registration not found" });
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

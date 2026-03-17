import RegistrationConfig from "../models/RegistrationConfig.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import EventCategory from "../models/EventCategory.js";

function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];
  return options
    .map((opt) => {
      if (opt == null) return null;
      if (typeof opt === "string" || typeof opt === "number") {
        return { value: String(opt), label: String(opt) };
      }
      const value = opt.value ?? opt.id ?? opt._id ?? opt.key;
      const label = opt.label ?? opt.name ?? opt.title ?? String(value ?? "");
      if (value == null) return null;
      return { value: String(value), label: String(label) };
    })
    .filter(Boolean);
}

function buildRequiredMapFromSchema(schema) {
  const required = new Map(); // name -> { type, requiredMessage }
  const sections = Array.isArray(schema?.sections) ? schema.sections : [];
  for (const section of sections) {
    const fields = Array.isArray(section?.fields) ? section.fields : [];
    for (const f of fields) {
      if (!f?.name) continue;
      if (!f.required) continue;
      required.set(f.name, {
        type: f.type || "text",
        requiredMessage: f.requiredMessage || "This field is required.",
      });
    }
  }
  return required;
}

function coerceBodyUsingSchema(schema, body) {
  const next = { ...(body || {}) };
  const sections = Array.isArray(schema?.sections) ? schema.sections : [];
  for (const section of sections) {
    const fields = Array.isArray(section?.fields) ? section.fields : [];
    for (const f of fields) {
      if (!f?.name) continue;
      const type = f.type || "text";
      const raw = next[f.name];

      if (raw == null) continue;

      if (type === "checkbox") {
        next[f.name] =
          raw === true || raw === "true" || raw === "on" || raw === 1 || raw === "1";
      } else if (type === "checkboxGroup") {
        if (Array.isArray(raw)) next[f.name] = raw;
        else if (typeof raw === "string") {
          // Event.jsx submits checkboxGroup as JSON string in FormData
          try {
            const parsed = JSON.parse(raw);
            next[f.name] = Array.isArray(parsed) ? parsed : [raw];
          } catch {
            next[f.name] = raw ? [raw] : [];
          }
        }
      } else if (type === "number") {
        const n = Number(raw);
        next[f.name] = Number.isFinite(n) ? n : raw;
      }
    }
  }
  return next;
}

function validateRequired(schema, body, fileByFieldName = {}) {
  const required = buildRequiredMapFromSchema(schema);
  const errors = {};

  for (const [name, rule] of required.entries()) {
    if (rule.type === "file") {
      const missing = !fileByFieldName?.[name];
      if (missing) errors[name] = rule.requiredMessage;
      continue;
    }

    const v = body?.[name];
    const missing =
      v == null ||
      (typeof v === "string" && v.trim() === "") ||
      (Array.isArray(v) && v.length === 0) ||
      (rule.type === "checkbox" && v !== true);

    if (missing) errors[name] = rule.requiredMessage;
  }

  return errors;
}

export const getRegistrationConfig = async (req, res) => {
  const config = await RegistrationConfig.findOne({ key: "active" }).lean();
  if (!config) {
    return res.status(404).json({
      message: "Registration config not found. Seed the database first.",
    });
  }

  const categories = await EventCategory.find({}).sort({ name: 1 }).lean();
  const events = await Event.find({})
    .populate("categoryId", "name slug")
    .sort({ startDate: 1 })
    .lean();

  // Ensure options are in the format Event.jsx expects.
  const options = { ...(config.options || {}) };
  const meta = { ...(config.meta || {}) };

  const eventsOptionsKey = meta.eventsOptionsKey || "events";
  const categoriesOptionsKey = meta.categoriesOptionsKey || "categories";

  // categories for the radio/select used by Event.jsx (value must match event.category)
  options[categoriesOptionsKey] = categories.map((c) => ({
    value: c.slug,
    label: c.name,
    id: String(c._id),
    slug: c.slug,
  }));

  options[eventsOptionsKey] = events.map((ev) => ({
    id: String(ev._id),
    name: ev.name,
    category: ev?.categoryId?.slug || "",
    startDate: ev.startDate,
    endDate: ev.endDate,
  }));

  const schema = { ...(config.schema || {}) };
  schema.meta = { ...(schema.meta || {}), ...meta };

  res.json({
    schema,
    options,
    meta,
  });
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function parseDate(input) {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const submitRegistration = async (req, res) => {
  const config = await RegistrationConfig.findOne({ key: "active" }).lean();
  if (!config?.schema) {
    return res.status(500).json({ message: "Registration config not set." });
  }

  const schema = config.schema;

  // multer (multipart) gives strings in req.body; JSON endpoint gives parsed objects.
  const body = coerceBodyUsingSchema(schema, req.body);

  const filesByFieldName = {};
  if (req.file) {
    // default photo field name is "photo" (schema should use same name)
    filesByFieldName[req.file.fieldname] = req.file;
  }

  const errors = validateRequired(schema, body, filesByFieldName);
  if (body.email && !isValidEmail(body.email)) errors.email = "Invalid email format.";
  if (body.dob && !parseDate(body.dob)) errors.dob = "Invalid date of birth.";
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  // Map dynamic form fields into required Registration model fields.
  // This aligns with the schema we seed (see seed script), and is extendable.
  const fullName = String(body.fullName || "").trim();
  const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
  const lastName = rest.join(" ");

  const doc = await Registration.create({
    firstName: body.firstName || firstName || "",
    lastName: body.lastName || lastName || "",
    dob: parseDate(body.dob),
    gender: body.gender,
    nationality: body.nationality,
    email: String(body.email).toLowerCase(),
    phone: body.phone,
    photo: req.file
      ? {
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : undefined,
    eventId: body.eventId,
    weightDivision: body.weightDivision,
    ageDivision: body.ageDivision,
    category: body.mainCategory || body.category,
    coach: body.coachName || body.coach || "",
    club: body.clubName || body.club || "",
    emergencyContact: {
      name: body.emergencyName || "",
      relationship: body.emergencyRelationship || "",
      phone: body.emergencyPhonePrimary || "",
      phoneAlt: body.emergencyPhoneSecondary || "",
      medical: body.medicalConditions || "",
    },
    status: "submitted",
  });

  res.status(201).json({
    success: true,
    message: "Registration submitted successfully",
    id: doc._id,
  });
};


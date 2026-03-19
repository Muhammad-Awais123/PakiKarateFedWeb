import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const competitionCategorySchema = new mongoose.Schema(
  {
    ageGroup: { type: String, trim: true, default: "" }, // e.g. "Senior", "Junior", "Cadet"
    gender: { type: String, enum: ["Male", "Female", "Mixed"], default: undefined },
    discipline: { type: String, trim: true, default: "" }, // "Kumite" or "Kata"
    weightClass: { type: String, trim: true, default: "" }, // e.g. "-60kg", "+84kg", "N/A" for Kata
    label: { type: String, trim: true, default: "" }, // display label
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    // ── Core Info ──────────────────────────────────────
    event_name: { type: String, default: "", trim: true, index: true },
    // Keep `name` required for backward compatibility with your existing admin/frontend.
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      index: true,
    },
    // Optional alias for compatibility with title naming.
    title: { type: String, default: "", trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true, index: true }, // auto-generated from title
    description: { type: String, default: "", trim: true },

    // Banner: new field name + legacy `image` alias
    bannerImage: { type: String, default: "", trim: true }, // uploads/events/...
    image: { type: String, default: "", trim: true }, // legacy for your current frontend

    bulletinPdf: { type: String, default: "", trim: true },
    programmePdf: { type: String, default: "", trim: true },

    // ── Dates ──────────────────────────────────────────
    startDate: { type: Date, required: [true, "Start date is required"], index: true },
    endDate: { type: Date, required: [true, "End date is required"], index: true },
    registrationDeadline: { type: Date },

    // ── Location ───────────────────────────────────────
    // Keep legacy `location` string used by your UI.
    location: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    venue: { type: String, default: "", trim: true },
    province: { type: String, default: "", trim: true },
    country: { type: String, default: "Pakistan", trim: true },

    // ── TOP-LEVEL CATEGORY ─────────────────────────────
    majorCategory: {
      type: String,
      required: true,
      enum: [
        "national_championship",
        "provincial_circuit",
        "open_tournament",
        "youth_circuit",
        "international",
        "multisport",
        "para_karate",
        "training_camp",
        "other",
      ],
      default: "other",
      index: true,
    },

    // ── SUB-CATEGORY / SERIES ──────────────────────────
    seriesName: {
      type: String,
      enum: [
        "PKF Premier League",
        "PKF Provincial Circuit",
        "PKF Youth League",
        "PKF Cadet Circuit",
        "PKF Open Series",
        "South Asian Games",
        "Asian Karate Championships",
        "World Karate Championships",
        "Commonwealth Games",
        "Islamic Solidarity Games",
        "Other International",
        null,
      ],
      default: null,
    },

    // ── EVENT OWNERSHIP ────────────────────────────────
    eventOwnership: {
      type: String,
      enum: ["pkf_event", "external_event"],
      default: "pkf_event",
      index: true,
    },
    level: {
      type: String,
      enum: ["National", "International"],
      default: "National",
      index: true,
    },
    // Keep `type` as primary modern field.
    type: {
      type: String,
      enum: ["Games", "Championship"],
      default: "Games",
      index: true,
    },
    // Keep legacy `category` key name, but support new frontend values.
    category: {
      type: String,
      enum: ["Men", "Women", "Junior", "Senior", "our_event", "external_event"],
      default: "Senior",
      index: true,
    },
    externalUrl: { type: String, default: "", trim: true }, // only if eventOwnership=external_event

    // ── AGE GROUPS ──────────────────────────────────────
    ageGroups: [
      {
        type: String,
        enum: ["Cadet", "Junior", "U21", "Senior", "Veteran", "Para", "Open"],
      },
    ],

    // ── DISCIPLINES ────────────────────────────────────
    disciplines: [
      {
        type: String,
        enum: ["Kumite", "Kata", "Team Kumite", "Team Kata"],
      },
    ],

    // ── COMPETITION CATEGORIES ─────────────────────────
    competitionCategories: [competitionCategorySchema],

    // ── STATUS ─────────────────────────────────────────
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
      index: true,
    },
    // Status auto-computed from dates unless manually overridden:
    statusOverride: { type: Boolean, default: false },

    // ── REGISTRATION ───────────────────────────────────
    registrationOpen: { type: Boolean, default: false },
    registrationLink: { type: String, default: "", trim: true }, // external link if registration is external
    registrationFee: { type: String, default: "", trim: true }, // e.g. "PKR 2,000"
    paymentDetails: {
      bankName: { type: String, default: "", trim: true },
      accountTitle: { type: String, default: "", trim: true },
      accountNumber: { type: String, default: "", trim: true },
      iban: { type: String, default: "", trim: true },
    },
    maxParticipants: { type: Number },

    // ── DISPLAY FLAGS ──────────────────────────────────
    isFeatured: { type: Boolean, default: false }, // show in hero/homepage
    showCountdown: { type: Boolean, default: true }, // show countdown banner
    isPublished: { type: Boolean, default: false }, // draft vs live

    // ── SEO / SOCIAL ───────────────────────────────────
    hashtag: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },

    // ── Legacy fields (existing schema) ─────────────────
    // Your current frontend/admin uses these; keep them to avoid breaking.
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventCategory",
      required: false,
      index: true,
    },
    eventType: { type: String, default: "", trim: true }, // used by your UI
    availableCategories: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── VIRTUALS ─────────────────────────────────────────────
// Auto-compute status from dates (unless manually overridden):
eventSchema.virtual("computedStatus").get(function () {
  if (this.statusOverride) return this.status;
  const now = new Date();
  if (now < this.startDate) return "upcoming";
  if (now >= this.startDate && now <= this.endDate) return "ongoing";
  return "completed";
});

// Milliseconds until event starts (negative if started):
eventSchema.virtual("msUntilStart").get(function () {
  if (!this.startDate) return 0;
  return this.startDate - new Date();
});

// ── PRE-SAVE HOOK ─────────────────────────────────────────
// Auto-generate slug from title/name.
eventSchema.pre("save", function (next) {
  if (this.event_name && !this.name) this.name = this.event_name;
  if (this.event_name && !this.title) this.title = this.event_name;
  if (!this.event_name) this.event_name = this.title || this.name || "";

  if (this.name && !this.title) this.title = this.name;
  if (this.title && !this.name) this.name = this.title;

  if (this.title || this.name) {
    const base = this.title || this.name;
    if (!this.slug || this.isModified("title") || this.isModified("name")) {
      this.slug = slugify(base);
    }
  }
  next();
});

export default mongoose.model("Event", eventSchema);
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  // Keep `name` as canonical title to avoid breaking existing code.
  name: { type: String, required: [true, "Event title is required"], trim: true },
  // Optional alias for compatibility with "title" naming.
  title: { type: String, default: "", trim: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventCategory",
    required: [true, "Event categoryId is required"],
    index: true,
  },
  startDate: { type: Date, required: [true, "Start date is required"] },
  endDate: { type: Date, required: [true, "End date is required"] },
  type: { type: String, default: "", trim: true }, // National / International / etc
  location: { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
  image: { type: String, default: "", trim: true }, // URL or /uploads/... path
  registrationLink: { type: String, default: "", trim: true },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
    index: true,
  },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
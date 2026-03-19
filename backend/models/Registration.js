import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, trim: true },
    nationality: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    photo: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    weightDivision: { type: String, required: true, trim: true },
    ageDivision: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // Kata/Kumite/etc
    coach: { type: String, default: "", trim: true },
    club: { type: String, default: "", trim: true },
    emergencyContact: {
      name: { type: String, default: "", trim: true },
      relationship: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      phoneAlt: { type: String, default: "", trim: true },
      medical: { type: String, default: "", trim: true },
    },
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);


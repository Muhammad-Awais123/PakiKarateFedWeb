import mongoose from "mongoose";

const coachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "", trim: true },
    province: { type: String, trim: true },
    specialization: { type: String, trim: true },
    qualifications: { type: String, trim: true },
    yearsOfExperience: { type: Number },
    achievements: [{ type: String, trim: true }],
    bio: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Coach", coachSchema);


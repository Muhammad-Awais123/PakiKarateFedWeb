import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "", trim: true },
    gender: { type: String, enum: ["Male", "Female"] },
    dob: Date,
    province: { type: String, trim: true },
    category: { type: String, enum: ["Kumite", "Kata", "Both"] },
    weightClass: { type: String, trim: true },
    clubName: { type: String, trim: true },
    achievements: [{ type: String, trim: true }],
    bio: { type: String, trim: true },
    yearsActive: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Player", playerSchema);


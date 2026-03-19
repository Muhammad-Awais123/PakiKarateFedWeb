import mongoose from "mongoose";

const legendSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "", trim: true },
    yearsActive: { type: String, trim: true },
    achievements: [{ type: String, trim: true }],
    bio: { type: String, trim: true },
    notableTitles: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Legend", legendSchema);


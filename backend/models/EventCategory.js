import mongoose from "mongoose";

const eventCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("EventCategory", eventCategorySchema);


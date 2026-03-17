import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required"],
      index: true,
    },
    fullName: { type: String, required: [true, "Full name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], lowercase: true, trim: true },
    phone: { type: String, required: [true, "Phone is required"], trim: true },
    category: { type: String, required: [true, "Category is required"], trim: true },
    club: { type: String, required: [true, "Club is required"], trim: true },
    paymentScreenshot: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      url: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventRegistration", eventRegistrationSchema);


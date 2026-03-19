import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required"],
      index: true,
    },
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    fullName: { type: String, default: "", trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: [true, "Phone is required"], trim: true },
    dob: { type: Date },
    gender: { type: String, default: "", trim: true },
    category: { type: String, required: [true, "Category is required"], trim: true },
    beltGrade: { type: String, default: "", trim: true },
    club: { type: String, required: [true, "Club is required"], trim: true },
    city: { type: String, default: "", trim: true },
    province: { type: String, default: "", trim: true },
    cnic: { type: String, default: "", trim: true },
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
    rejectionReason: { type: String, default: "", trim: true },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("EventRegistration", eventRegistrationSchema);

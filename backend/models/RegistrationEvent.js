import mongoose from "mongoose";

const registrationEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      trim: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("RegistrationEvent", registrationEventSchema);


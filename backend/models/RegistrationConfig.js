import mongoose from "mongoose";

const registrationConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "active",
    },
    schema: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    options: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RegistrationConfig", registrationConfigSchema);


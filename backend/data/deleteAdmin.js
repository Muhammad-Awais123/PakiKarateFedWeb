import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(name);
  if (index === -1 || index === args.length - 1) return fallback;
  return args[index + 1];
};

const targetEmail = getArg("--email", "admin@pkf.com.pk").toLowerCase().trim();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

const deleteAdmin = async () => {
  try {
    const res = await User.deleteMany({ email: targetEmail, role: "admin" });
    console.log(`Deleted admin users for ${targetEmail}:`, res.deletedCount);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

deleteAdmin();
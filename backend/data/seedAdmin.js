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

const email = getArg("--email", "admin@pkf.com.pk");
const password = getArg("--password", "Admin@1234");

if (!email || !password) {
  console.error("Usage: node data/seedAdmin.js [--email <email>] [--password <password>]");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.log(`Admin already exists for email ${email} ✅`);
      console.log("Use the same credentials to log in.");
      process.exit(0);
    }

    // Pass plain password - User model's pre-save hook will hash it
    await User.create({
      name: "Admin",
      email: email.toLowerCase().trim(),
      password,
      role: "admin",
    });

    console.log("Admin created ✅");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("\nSave these credentials. You can change the password later.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin:", err);
    process.exit(1);
  }
};

createAdmin();
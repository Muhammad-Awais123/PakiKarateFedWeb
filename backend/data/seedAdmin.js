import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

const createAdmin = async () => {
  try {
    const existing = await User.findOne({ email: "admin@pkf.com" });
    if (existing) {
      console.log("Admin already exists ✅");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@pkf.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created ✅");
    console.log("Email: admin@pkf.com");
    console.log("Password: Admin@1234");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

createAdmin();
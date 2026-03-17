import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB Connected ✅");
    const users = await User.find();
    console.log("All users in DB:");
    console.log(users);
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
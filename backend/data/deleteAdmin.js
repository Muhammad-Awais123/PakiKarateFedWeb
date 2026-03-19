import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

const deleteAdmin = async () => {
  try {
    const res = await User.deleteMany({ email: "admin@pkf.com" });
    console.log("Deleted Admin:", res.deletedCount);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

deleteAdmin();
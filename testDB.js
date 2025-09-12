import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection failed:", err));

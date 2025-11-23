import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ Missing MONGODB_URI in environment variables");
  }

  if (isConnected) return;

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: "indep" });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
}

import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    collegeId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "faculty", "student", "judge", "department", "president", "secretary"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 CRITICAL FIX: check models.User first to prevent overwriting
const User = models.User || model("User", UserSchema);

export default User;

import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    collegeId: {
      type: String,
      required: true,
      unique: true, // like 23UBC506
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "faculty", "student", "judge"],
      required: true,
    },

    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

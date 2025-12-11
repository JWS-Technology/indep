import mongoose from "mongoose";

const OnStageAttendanceSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    teamId: {
      type: String,
      required: true,
    },

    teamName: {
      type: String,
      required: true,
    },

    contestantName: {
      type: String,
      required: true,
      trim: true,
    },

    dNo: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      //   enum: ["PRESENT", "ABSENT", "MALPRACTICE"],
      default: null,
    },

    malpracticeDetails: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.OnStageAttendance ||
  mongoose.model("OnStageAttendance", OnStageAttendanceSchema);

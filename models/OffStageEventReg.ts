import mongoose from "mongoose";

const OffStageEventRegSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required for registration."],
      trim: true,
    },
    teamName: {
      type: String,
      required: [true, "Team name or individual name is required."],
      trim: true,
    },
    teamId: {
      type: String,
      trim: true,
    },
    contestantName: {
      type: String,
    },
    lot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lot",
    },
    dNo: String,
  },
  {
    timestamps: true,
  }
);

const OffStageEventReg =
  mongoose.models.OffStageEventReg ||
  mongoose.model("OffStageEventReg", OffStageEventRegSchema);

export default OffStageEventReg;

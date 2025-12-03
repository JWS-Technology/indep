import mongoose, { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    stageType: {
      type: String,
      enum: ["ON_STAGE", "OFF_STAGE"],
      required: true,
    },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    venue: { type: String, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "pending", "completed"],
      default: "pending",
    },
    incharge: [
      {
        name: String,
        department: String,
      },
    ],
    openRegistration: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const Event = models.Event || model("Event", EventSchema);
export default Event;

import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // example: "ON01"
    type: { type: String, enum: ["on-stage", "off-stage"], required: true },
    description: { type: String },
    lots: [
      {
        lotNumber: Number,
        department: String,
      },
    ],
  },
  { timestamps: true }
);

export const Event = models.Event || model("Event", EventSchema);

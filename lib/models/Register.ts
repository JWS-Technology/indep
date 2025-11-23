import { Schema, model, models } from "mongoose";

const RegistrationSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    department: { type: String, required: true },
    lotNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);

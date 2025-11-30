import { Schema, model, models } from "mongoose";

const ScoreSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    lotNumber: { type: Number, required: true },
    judgeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const Score = models.Score || model("Score", ScoreSchema);

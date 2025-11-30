import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  teamName: string;
  shift: string;
}

const TeamSchema = new Schema<ITeam>(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    shift: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Fix model overwrite error in Next.js
export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);

import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ITeam extends Document {
  teamId: string;
  teamName: string;
  password: string;
  shift: string;
  isPasswordChanged: boolean;
  membersCreated: {
    faculty: boolean;
    student: boolean;
  };
}

const TeamSchema = new Schema<ITeam>(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
      required: true,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    membersCreated: {
      faculty: { type: Boolean, default: false },
      student: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Team =
  (models.Team as mongoose.Model<ITeam>) || model<ITeam>("Team", TeamSchema);

export default Team;

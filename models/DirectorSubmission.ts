import mongoose, { Schema, model, models } from "mongoose";

const DirectorSubmissionSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true },
    teamId: { type: String },
    title: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    submittedBy: { type: String }, // optional: faculty/student
  },
  { timestamps: true }
);

const DirectorSubmission =
  models.DirectorSubmission ||
  model("DirectorSubmission", DirectorSubmissionSchema);

export default DirectorSubmission;

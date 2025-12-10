import { model, models, Schema } from "mongoose";

const UploadLinksSchema = new Schema(
  {
    teamId: { type: String, ref: "Team" },
    drivelink: { type: String },
  },
  { timestamps: true }
);

const UploadLinks =
  models.UploadLinks || model("UploadLinks", UploadLinksSchema);
export default UploadLinks;

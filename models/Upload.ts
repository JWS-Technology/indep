import mongoose, { Schema, models, model } from "mongoose";

export interface IUpload {
  teamName?: string;
  teamId?: string;
  event?: string;
  originalName?: string;   // name uploaded by user
  fileName?: string;       // stored name on server
  fileType?: string;       // e.g. image/png
  size?: number;           // file size in bytes
  path?: string;           // local path or S3 key
  createdAt?: Date;
  updatedAt?: Date;
}

const UploadSchema = new Schema<IUpload>(
  {
    teamName: { type: String },
    event: {type: String},
    teamId: { type: String },
    originalName: { type: String },
    fileName: { type: String },
    fileType: { type: String },
    size: { type: Number },
    path: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite errors in Next.js (Hot Reloading Fix)
const Upload = models.Upload || model<IUpload>("Upload", UploadSchema);

export default Upload;

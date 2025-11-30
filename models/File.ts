import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  originalName: string;
  filename: string;     // stored filename on server
  fileType: string;
  size: number;
  url: string;          // public URL
  folder?: string;      // optional folder/category
  uploadedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    fileType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },

    folder: { type: String, default: null },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }
  },
  { timestamps: true }
);

// Fix overwrite error in Next.js
export default mongoose.models.File || mongoose.model<IFile>("File", FileSchema);

import mongoose, { Schema, model, models } from "mongoose";

const GalleryImageSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    category: { type: String, required: true }, // 'on-stage', 'off-stage', 'special'
    title: { type: String, required: true },
    year: { type: String, required: true }, // '2024', '2023', etc.
  },
  { timestamps: true }
);

// Check if model exists to prevent overwrite error during hot reload
const GalleryImage =
  models.GalleryImage || model("GalleryImage", GalleryImageSchema);

export default GalleryImage;

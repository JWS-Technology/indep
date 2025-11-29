import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  total: { type: Number, default: 0 },
});

export default mongoose.models.VisitorCounter ||
  mongoose.model("VisitorCounter", visitorSchema);

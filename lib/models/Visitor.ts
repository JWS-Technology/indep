import mongoose, { Schema } from "mongoose";

const VisitorSchema = new Schema({
    count: { type: Number, default: 0 }
});

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);

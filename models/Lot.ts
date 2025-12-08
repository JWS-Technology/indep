// models/Lot.js
import mongoose from "mongoose";

const LotSchema = new mongoose.Schema({
  lot_number: {
    type: String,
  },
  event: {
    type: String,
  },
  team_id: String,
  teamName: String,
  theme: {
    type: String,
    default: "",
  },
});

// Use existing model if compiled (prevents OverwriteModelError in dev/hmr)
const Lot = mongoose.models.Lot || mongoose.model("Lot", LotSchema);
export default Lot;

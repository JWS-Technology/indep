import mongoose from "mongoose";

const LotSchema = new mongoose.Schema({
  lot_number: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  team_id: String,
  // team_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Team",
  //   required: true,
  // },
  theme: {
    type: String,
    default: "", // keep empty by default
  },
});

export default mongoose.model("Lot", LotSchema);

  import mongoose from "mongoose";

  const OnStageEventRegSchema = new mongoose.Schema({
    teamId: String,
    teamName: String,
    eventName: String,

    contestants: [
      {
        contestantName: { type: String, required: true },
        dNo: { type: String, required: true },
      },
    ],
  });

  export default mongoose.models.OnStageEventReg ||
    mongoose.model("OnStageEventReg", OnStageEventRegSchema);

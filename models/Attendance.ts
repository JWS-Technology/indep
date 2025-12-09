import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  eventName: String,
  teamId: String,
  teamName: String,
  dNo: String,
  contestantName: String,
  lotNumber: String,
  attendance: {
    type: String,
    enum: ["ABSENT", "PRESENT", "MALPRACTICE"],
    default: "ABSENT",
  },
  malpracticeDetails: String,
});

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);

export default Attendance;

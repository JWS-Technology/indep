import OnStageAttendance from "@/models/OnStageAttendance";
import dbConnect from "@/utils/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  const {
    teamId,
    teamName,
    eventName,
    contestantName,
    dNo,
    status,
    malpracticeDetails = "",
  } = body;

  // Upsert attendance based on event + dNo
  await OnStageAttendance.findOneAndUpdate(
    { eventName, dNo },
    {
      teamId,
      teamName,
      contestantName,
      status,
      malpracticeDetails,
    },
    { upsert: true, new: true }
  );

  return Response.json({ success: true });
}

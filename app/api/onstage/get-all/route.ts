import OnStageEventReg from "@/models/OnStageEventReg";
import OnStageAttendance from "@/models/OnStageAttendance";
import dbConnect from "@/utils/dbConnect";

export async function GET() {
  await dbConnect();

  const regs = await OnStageEventReg.find().lean();

  // Fetch all attendance records
  const attendance = await OnStageAttendance.find().lean();

  // Create map for faster lookup
  const attMap = new Map();
  attendance.forEach((a) => {
    attMap.set(`${a.eventName}-${a.dNo}`, a);
  });

  // Merge attendance into contestants
  const merged = regs.map((reg) => {
    const contestants = reg.contestants.map(
      (c: { contestantName: string; dNo: string; _id: string }) => {
        const key = `${reg.eventName}-${c.dNo}`;
        const att = attMap.get(key);

        return {
          ...c,
          attendance: att ? att.status : "Not Marked",
        };
      }
    );

    return { ...reg, contestants };
  });

  return Response.json({
    success: true,
    data: merged,
  });
}

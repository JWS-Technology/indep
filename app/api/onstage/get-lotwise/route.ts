import dbConnect from "@/utils/dbConnect";
import Lot from "@/models/Lot";
import OnStageAttendance from "@/models/OnStageAttendance";
import OnStageEventReg from "@/models/OnStageEventReg";

export async function GET() {
  await dbConnect();

  // 1️⃣ Fetch all lots
  const lots = await Lot.find().lean();

  // 2️⃣ Fetch attendance
  const attendance = await OnStageAttendance.find().lean();

  // 3️⃣ Fetch registrations (to get contestants initially)
  const registrations = await OnStageEventReg.find().lean();

  // 4️⃣ Map registrations by team + event
  const regMap = new Map();
  registrations.forEach((r) => {
    regMap.set(`${r.teamId}-${r.eventName}`, r);
  });

  // 5️⃣ Group attendance by team + event
  const attMap = new Map();
  attendance.forEach((att) => {
    const key = `${att.teamId}-${att.eventName}`;
    if (!attMap.has(key)) attMap.set(key, []);
    attMap.get(key).push(att);
  });

  // 6️⃣ Merge lots with registrations and attendance
  const lotWise = lots.map((lot) => {
    const key = `${lot.team_id}-${lot.event}`;

    const regData = regMap.get(key);

    // Base contestants (from registration)
    let contestants =
      regData?.contestants?.map((c) => ({
        contestantName: c.contestantName,
        dNo: c.dNo,
        status: "PENDING",
        malpracticeDetails: "",
      })) || [];

    // Apply attendance if available
    const attList = attMap.get(key);
    if (attList) {
      contestants = contestants.map((c) => {
        const attRecord = attList.find((a) => a.dNo === c.dNo);
        return attRecord
          ? {
              ...c,
              status: attRecord.status,
              malpracticeDetails: attRecord.malpracticeDetails,
            }
          : c;
      });
    }

    return {
      ...lot,
      contestants,
      teamId: lot.team_id, // For frontend compatibility
      eventName: lot.event,
    };
  });

  return Response.json({
    success: true,
    data: lotWise,
  });
}

import dbConnect from "@/utils/dbConnect";
import Lot from "@/models/Lot";
import OnStageAttendance from "@/models/OnStageAttendance";
import OnStageEventReg from "@/models/OnStageEventReg";

interface Contestant {
  contestantName: string;
  dNo: string;
  _id?: string;
}

interface AttendanceRecord {
  dNo: string;
  status: string;
  malpracticeDetails?: string;
}

interface RegData {
  contestants: Contestant[];
  teamId: string;
  eventName: string;
}

export async function GET() {
  await dbConnect();

  const lots = await Lot.find().lean();
  const attendance = await OnStageAttendance.find().lean();
  const registrations: RegData[] = await OnStageEventReg.find().lean();

  // Map registrations by team + event
  const regMap = new Map<string, RegData>();
  registrations.forEach((r) => {
    regMap.set(`${r.teamId}-${r.eventName}`, r);
  });

  // Group attendance
  const attMap = new Map<string, AttendanceRecord[]>();
  attendance.forEach(
    (att: AttendanceRecord & { teamId: string; eventName: string }) => {
      const key = `${att.teamId}-${att.eventName}`;
      if (!attMap.has(key)) attMap.set(key, []);
      attMap.get(key)!.push(att);
    }
  );

  // Merge lots
  const lotWise = lots.map((lot: any) => {
    const key = `${lot.team_id}-${lot.event}`;
    const regData = regMap.get(key);

    // ✔ FIX: c now has proper type
    let contestants =
      regData?.contestants?.map((c: Contestant) => ({
        contestantName: c.contestantName,
        dNo: c.dNo,
        status: "PENDING",
        malpracticeDetails: "",
      })) || [];

    // Apply attendance
    const attList = attMap.get(key);
    if (attList) {
      contestants = contestants.map((c) => {
        const attRecord = attList.find((a) => a.dNo === c.dNo);
        return attRecord
          ? {
              ...c,
              status: attRecord.status,
              malpracticeDetails: attRecord.malpracticeDetails || "",
            }
          : c;
      });
    }

    return {
      ...lot,
      contestants,
      teamId: lot.team_id,
      eventName: lot.event,
    };
  });

  return Response.json({
    success: true,
    data: lotWise,
  });
}

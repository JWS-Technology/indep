import OnStageEventReg from "@/models/OnStageEventReg";
import dbConnect from "@/utils/dbConnect";

export async function PATCH(req: Request) {
  await dbConnect();
  const body = await req.json();

  const { regId, contestantIndex, newName } = body;

  const reg = await OnStageEventReg.findById(regId);
  reg.contestants[contestantIndex].contestantName = newName;

  await reg.save();

  return Response.json({ success: true });
}

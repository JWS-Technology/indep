import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import OnStageEventReg from "@/models/OnStageEventReg";

type Params = { teamId: string; regId: string };

export async function DELETE(
  req: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { teamId, regId } = await context.params;

    if (!teamId || !regId) {
      return NextResponse.json(
        { success: false, message: "Missing params" },
        { status: 400 }
      );
    }

    await dbConnect();

    const reg = await OnStageEventReg.findById(regId);
    if (!reg) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    // ensure team owns this registration
    if (String(reg.teamId) !== String(teamId)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // build signature for current reg: eventName + sorted dNos
    const getSig = (r: any) =>
      `${(r.eventName ?? "").toLowerCase()}::${(r.contestants ?? [])
        .map((c: any) => (c.dNo ?? "").toLowerCase())
        .sort()
        .join("|")}`;

    const targetSig = getSig(reg);

    // find all regs for this team with same eventName, then filter by identical signature
    const candidates = await OnStageEventReg.find({
      teamId,
      eventName: reg.eventName,
    });
    const identical = candidates.filter((c: any) => getSig(c) === targetSig);

    // only allow deletion if there is more than 1 identical entry (i.e., duplicates exist)
    if (identical.length <= 1) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete unique registration. Only duplicates can be deleted by the team.",
        },
        { status: 403 }
      );
    }

    // proceed to delete
    await OnStageEventReg.deleteOne({ _id: regId });

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Error in onstage DELETE:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

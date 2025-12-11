import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import OnStageEventReg from "@/models/OnStageEventReg";

export async function GET(
  req: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await context.params; // ✅ same as your offstage API

    await dbConnect();

    const registrations = await OnStageEventReg.find({ teamId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error("Error fetching onstage regs:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

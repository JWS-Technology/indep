import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import OffStageEventReg from "@/models/OffStageEventReg";

export async function GET(
  req: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await context.params; // ✅ MUST await

    await dbConnect();

    const registrations = await OffStageEventReg.find({ teamId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error("Error fetching offstage regs:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

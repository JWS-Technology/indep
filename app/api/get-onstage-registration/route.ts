// /api/onstage-registration.ts
import OnStageEventReg from "@/models/OnStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const allRegistrations = await OnStageEventReg.find({});
    return NextResponse.json({
      success: true,
      message: "All registered events fetched successfully",
      registeredData: allRegistrations,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error fetching registered events",
    });
  }
}

// PUT request to update a registration
export async function PUT(req: NextRequest) {
  try {
    const { id, teamName, eventName, contestants } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing registration ID" });
    }

    await dbConnect();

    const updated = await OnStageEventReg.findByIdAndUpdate(
      id,
      { teamName, eventName, contestants, contestantCount: contestants.length },
      { new: true } // return the updated document
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Registration not found" });
    }

    return NextResponse.json({ success: true, message: "Registration updated", updatedData: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error updating registration" });
  }
}

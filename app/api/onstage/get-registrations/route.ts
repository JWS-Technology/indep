// /app/api/onstage/get-registrations/route.ts
import OnStageEventReg from "@/models/OnStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Fetch all registered on-stage events
    const registeredData = await OnStageEventReg.find({}).lean();

    return NextResponse.json({
      success: true,
      message: "All registered on-stage events fetched",
      data: registeredData,
    });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching registered on-stage events",
      data: [],
    });
  }
}

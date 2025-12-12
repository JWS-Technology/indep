// File: /app/api/offstage/registrations/route.ts
import OffStageEventReg from "@/models/OffStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Optional: you can filter by eventName via query params
    const eventName = req.nextUrl.searchParams.get("eventName");

    const query = eventName ? { eventName } : {};

    const registrations = await OffStageEventReg.find(query)
      .populate("lot") // populate lot info if needed
      .sort({ createdAt: -1 }); // most recent first

    return NextResponse.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Error fetching off-stage registrations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registrations",
      },
      { status: 500 }
    );
  }
}

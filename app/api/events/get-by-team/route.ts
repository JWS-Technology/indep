// app/api/events/get-by-team/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Registration from "@/models/EventRegistration";

export async function GET(req: NextRequest) {
  try {
    // 1. Get teamId from URL query params (e.g., /api/events/get-by-team?teamId=team_123)
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    // 2. Validation
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // 3. Connect to DB
    await dbConnect();

    // 4. Find registrations for this team
    // We sort by registrationDate descending (newest first)
    const registrations = await Registration.find({ teamId: teamId })
      .sort({ registrationDate: -1 })
      .exec();

    // 5. Return success
    return NextResponse.json({ success: true, registrations }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching team events:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

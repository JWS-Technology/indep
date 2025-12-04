import Team from "@/models/Team";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure this always fetches fresh data

export async function GET() {
  try {
    await dbConnect();

    // Fetch all teams
    // Sorting by 'teamId' ensures they appear in logical order (e.g. 25IIT01 before 25IIT02)
    // If you prefer alphabetical names, change to: .sort({ teamName: 1 })
    const teams = await Team.find({}).sort({ teamId: 1 }).lean();

    return NextResponse.json(
      {
        success: true,
        teams,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

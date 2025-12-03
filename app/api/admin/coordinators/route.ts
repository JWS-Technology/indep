import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Coordinator from "@/models/Coordinator";

export async function GET() {
  try {
    // 1. Connect to Database
    await dbConnect();

    // 2. Fetch Coordinators
    // Note: We use .select('+password') here because your schema has { select: false }
    // for the password, but your Admin UI needs to display/edit it since
    // you are using plain text passwords.
    const coordinators = await Coordinator.find({})
      .select("+password")
      .sort({ createdAt: -1 }); // Newest first

    // 3. Return Response
    return NextResponse.json(
      {
        success: true,
        coordinators,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching coordinators:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

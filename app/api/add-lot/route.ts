import Lot from "@/models/Lot";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { lots, eventId, eventName } = await req.json();
    console.log(eventName, eventId);

    if (!lots || !Array.isArray(lots)) {
      return NextResponse.json(
        { message: "Invalid lots array", success: false },
        { status: 400 }
      );
    }

    // Convert lots to DB format
    const formattedLots = lots.map((l) => ({
      lot_number: l.lot,
      event: eventName,
      team_id: l.teamId,
      teamName: l.teamName,
      theme: l.theme ?? "",
    }));
    console.log(formattedLots);

    // console.log(formattedLots);

    // Save all lots in one operation
    const savedLots = await Lot.insertMany(formattedLots);
    console.log(savedLots)

    return NextResponse.json(
      {
        message: "Lots saved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in add lot route:", error);
    return NextResponse.json(
      { message: "Error in add lot route", success: false },
      { status: 500 }
    );
  }
}

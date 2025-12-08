import Lot from "@/models/Lot";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { teamId, eventName } = await req.json();
    console.log(teamId, eventName);

    const lot = await Lot.findOne({
      team_id: teamId,
      event: eventName,
    });
    console.log(lot);

    return NextResponse.json(
      { message: "success", success: true, lot: lot },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in get lot route");
    console.log(error);
    return NextResponse.json(
      { message: "error in get lot route" },
      { status: 400 }
    );
  }
}

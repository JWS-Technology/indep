import Registration from "@/models/EventRegistration";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { teamId, eventName } = await req.json();
    // console.log(teamId);
    // console.log(eventName);
    await dbConnect();

    const registeredData = await Registration.findOne({
      teamId: teamId,
      eventName: eventName,
    });
    console.log(registeredData);

    return NextResponse.json({
      success: true,
      message: "regitered data sent",
      registeredData: registeredData,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "error in get regitered data",
    });
  }
}

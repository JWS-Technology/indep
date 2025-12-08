import Registration from "@/models/EventRegistration";
import OffStageEventReg from "@/models/OffStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { teamId, eventName, offStageOrOnStage } = await req.json();
    // console.log(teamId);
    // console.log(eventName);
    await dbConnect();

    if (offStageOrOnStage === "OFF_STAGE") {
      const registeredData = await OffStageEventReg.findOne({
        teamId: teamId,
        eventName: eventName,
      });
      console.log(registeredData);
      return NextResponse.json({
        success: true,
        message: "regitered data sent",
        registeredData: registeredData,
      });
    }

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

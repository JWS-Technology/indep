import OnStageEventReg from "@/models/OnStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // console.log("req for ASDASDAKSHDKJASD registration came");
    const { teamId, eventName } = await req.json();

    // console.log("THIS IS DATA CAME " + teamId, eventName);

    // if (!teamId) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "error in get regitered data",
    //   });
    // }
    // if (!eventName) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "error in get regitered data",
    //   });
    // }
    await dbConnect();

    const registeredData = await OnStageEventReg.findOne({
      teamId: teamId,
      eventName: eventName,
    });

    // console.log("THIS is reg daat " + registeredData);

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

import OnStageEventReg from "@/models/OnStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    // console.log("req for onstage registration came");
    const { teamId, eventName } = await req.json();
    // console.log("THIS IS DATA COMMING " + teamId, eventName);

    // function escapeRegex(s?: string) {
    //   if (!s) return "";
    //   return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // }

    // const registeredData = await OnStageEventReg.findOne({
    //   teamId,
    //   eventName: { $regex: `^${escapeRegex(eventName)}$`, $options: "i" },
    // });

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

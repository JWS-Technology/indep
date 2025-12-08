import OffStageEventReg from "@/models/OffStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  try {
    await dbConnect();
    const { dNo, contestantName, teamId, teamName, eventName } =
      await req.json();

    // console.log(dNo, contestantName, teamId, teamName, eventName);
    // return NextResponse.json({
    //   message: "registration successful",
    //   success: true,
    // });

    const registered = await OffStageEventReg.create({
      eventName: eventName,
      teamId: teamId,
      teamName: teamName,
      contestantName: contestantName,
      dNo: dNo,
    });


    return NextResponse.json({
      message: "registration successful",
      success: true,
    });
  } catch (error) {
    console.log("error in off stage event registration");
    console.log(error);
    return NextResponse.json({
      message: "error in off stage registration",
      success: false,
    });
  }
}

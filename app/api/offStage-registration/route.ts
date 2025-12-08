import OffStageEventReg from "@/models/OffStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  try {
    await dbConnect();
    const {
      dNo,
      contestantName,
      teamId,
      teamName,
      eventName,
      secondContestant,
      secondDno,
    } = await req.json();

    console.log(
      dNo,
      contestantName,
      teamId,
      teamName,
      eventName,
      secondContestant,
      secondDno
    );
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
      secondContestantName: secondContestant,
      secondDno: secondDno,
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
export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const {
      dNo,
      contestantName,
      teamId,
      teamName,
      eventName,
      secondContestant,
      secondDno,
    } = await req.json();

    if (!teamId || !eventName) {
      return NextResponse.json(
        { message: "teamId and eventName are required", success: false },
        { status: 400 }
      );
    }

    const updated = await OffStageEventReg.findOneAndUpdate(
      { teamId: teamId, eventName: eventName }, // same identifiers as POST
      {
        eventName: eventName,
        teamId: teamId,
        teamName: teamName,
        contestantName: contestantName,
        dNo: dNo,
        secondContestantName: secondContestant,
        secondDno: secondDno,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "No matching record found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Update successful",
      success: true,
      data: updated,
    });
  } catch (error) {
    console.log("error in PATCH off stage event registration");
    console.log(error);
    return NextResponse.json({
      message: "error in off stage registration update",
      success: false,
    });
  }
}

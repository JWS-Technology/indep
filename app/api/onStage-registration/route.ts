import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import OnStageEventReg from "@/models/OnStageEventReg";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { teamId, teamName, eventName, contestants } = body;
    console.log(teamId, teamName, eventName, contestants);

    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "On-stage event registered successfully",
    //     // data: savedData,
    //   },
    //   { status: 201 }
    // );
    // Validate fields
    if (!teamId || !teamName || !eventName || !Array.isArray(contestants)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optional: Validate contestants format
    for (const c of contestants) {
      if (!c.contestantName || !c.dNo) {
        return NextResponse.json(
          { success: false, message: "Invalid contestant entry" },
          { status: 400 }
        );
      }
    }

    // Save to DB
    const savedData = await OnStageEventReg.create({
      teamId,
      teamName,
      eventName,
      contestants,
    });

    console.log(savedData);

    return NextResponse.json(
      {
        success: true,
        message: "On-stage event registered successfully",
        // data: savedData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

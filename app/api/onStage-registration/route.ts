import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import OnStageEventReg from "@/models/OnStageEventReg";

export async function POST(req: Request) {
  try {
    await dbConnect();
    // console.log("Request received for on-stage registration");

    const body = await req.json();
    const { teamId, teamName, eventName, contestants, contestantCount } = body;
    // console.log(contestantCount);

    // Basic validation
    if (!teamId || !teamName || !eventName || !Array.isArray(contestants)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Normalize contestants: accept either { name, dno } or { contestantName, dNo }
    const normalized = contestants.map((c: any) => {
      return {
        contestantName: (c.contestantName || c.name || "").toString().trim(),
        dNo: (c.dNo || c.dno || "").toString().trim(),
      };
    });

    // Validate normalized entries
    for (const c of normalized) {
      if (!c.contestantName || !c.dNo) {
        return NextResponse.json(
          { success: false, message: "Invalid contestant entry" },
          { status: 400 }
        );
      }
    }

    const alreadyRegisteredData = await OnStageEventReg.findOne({
      teamId: teamId,
      eventName: eventName,
    });

    if (alreadyRegisteredData) {
      const updatedRegisteredData = await OnStageEventReg.findOneAndUpdate(
        { teamId, eventName },
        {
          $set: {
            teamId,
            teamName,
            eventName,
            contestants: normalized,
            contestantCount: contestantCount,
          },
        },
        { new: true }
      );
      // console.log("THIS IS UPDATED REG DATA " + updatedRegisteredData);
      return NextResponse.json(
        {
          success: true,
          message: "On-stage event updated successfully",
          data: alreadyRegisteredData,
        },
        { status: 201 }
      );
    }

    // console.log(" THIS IS ALREADY REGISTERED DATA" + alreadyRegisteredData);

    // Save to DB
    const savedData = await OnStageEventReg.create({
      teamId,
      teamName,
      eventName,
      contestants: normalized,
      contestantCount: contestantCount,
    });

    // console.log("Saved registration:", savedData._id);

    return NextResponse.json(
      {
        success: true,
        message: "On-stage event registered successfully",
        data: savedData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import OnStageEventReg from "@/models/OnStageEventReg";

export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log("Request received for on-stage registration");

    const body = await req.json().catch(() => ({}));
    let { teamId, teamName, eventName, contestants } = body;

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

    // Save to DB
    const savedData = await OnStageEventReg.create({
      teamId,
      teamName,
      eventName,
      contestants: normalized,
    });

    console.log("Saved registration:", savedData._id);

    return NextResponse.json(
      {
        success: true,
        message: "On-stage event registered successfully",
        data: savedData,
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

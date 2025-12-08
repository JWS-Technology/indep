import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DirectorSubmission from "@/models/DirectorSubmission";

export async function POST(req: Request) {
  await dbConnect();
  console.log("req came");

  try {
    const { eventId, teamId } = await req.json();

    const submission = await DirectorSubmission.findOne({ eventId, teamId });
    console.log(submission);
    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

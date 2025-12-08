import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DirectorSubmission from "@/models/DirectorSubmission";

// ----------------------
// CREATE SUBMISSION
// ----------------------
export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const submission = await DirectorSubmission.create(body);

    return NextResponse.json(
      { message: "Submission saved", submission },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save submission" },
      { status: 500 }
    );
  }
}

// ----------------------
// UPDATE SUBMISSION
// ----------------------
export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { submissionId, title, youtubeLink } = body;

    if (!submissionId)
      return NextResponse.json(
        { error: "Missing submissionId" },
        { status: 400 }
      );

    const updated = await DirectorSubmission.findByIdAndUpdate(
      submissionId,
      { title, youtubeLink },
      { new: true }
    );

    return NextResponse.json({
      message: "Submission updated",
      submission: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update submission" },
      { status: 500 }
    );
  }
}

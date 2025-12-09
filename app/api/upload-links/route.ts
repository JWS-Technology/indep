import Team from "@/models/Team";
import UploadLinks from "@/models/UploadLinks";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { teamId, drivelink } = await req.json();

    if (!teamId || !drivelink) {
      return NextResponse.json(
        {
          success: false,
          message: "teamId and driveLink is required!",
        },
        { status: 400 }
      );
    }

    const teamExists = await Team.findOne({ teamId });
    if (!teamExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid teamId",
        },
        { status: 404 }
      );
    }

    const UploadLink = await UploadLinks.findOneAndUpdate(
      { teamId },
      { drivelink },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Drive link saved successfully",
      data: UploadLink,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

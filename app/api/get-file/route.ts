import Upload from "@/models/Upload";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("req came");
    await dbConnect();
    const { teamId, eventName } = await req.json();
    console.log(teamId, eventName);
    const fileDetails = await Upload.findOne({
      teamId: teamId,
      event: eventName,
    });
    console.log(fileDetails);
    return NextResponse.json(
      { message: "success", fileName: fileDetails.originalName },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in get file");
    console.log(error);
    return NextResponse.json({ message: "server error" }, { status: 400 });
  }
}

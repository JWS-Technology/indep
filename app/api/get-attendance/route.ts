import Attendance from "@/models/Attendance";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { filterEvent } = await req.json();
    console.log(filterEvent)
    const attendance = await Attendance.find({
      eventName: filterEvent,
    });
    // console.log(attendance);

    return NextResponse.json(
      { message: "success", success: true, attendance: attendance },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in get lot route");
    console.log(error);
    return NextResponse.json(
      { message: "error in get lot route" },
      { status: 400 }
    );
  }
}

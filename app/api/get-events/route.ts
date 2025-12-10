import Attendance from "@/models/Attendance";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Fetch raw documents (only eventName)
    const docs = await Attendance.find({}, { eventName: 1 });
    // const docs = await Attendance.find();
    // console.log(docs)

    return NextResponse.json({ success: true, events: docs }, { status: 200 });
  } catch (error) {
    console.log("Error fetching events:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

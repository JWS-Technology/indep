import Attendance from "@/models/Attendance";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // await dbConnect();
    const {
      eventName,
      teamName,
      teamId,
      contestantName,
      dNo,
      lotNo,
      attendance,
      malpracticeDetails,
    } = await req.json();

    const attendanceExists = await Attendance.findOne({
      eventName: eventName,
      dNo: dNo,
    });
    // console.log(attendance);

    if (attendanceExists) {
      const updated = await Attendance.findOneAndUpdate(
        { eventName: eventName, dNo: dNo }, // find by event & dNo
        {
          $set: {
            teamName,
            teamId,
            contestantName,
            lotNumber: lotNo,
            attendance,
            malpracticeDetails,
          },
        },
        { new: true, upsert: false } // ❗ upsert: false → do nothing if not found
      );
    //   console.log(updated);
      return NextResponse.json(
        {
          message: "saved attendance",
          success: true,
        },
        { status: 200 }
      );
    }

    const savedAttendance = await Attendance.create({
      eventName: eventName,
      teamName: teamName,
      teamId: teamId,
      contestantName: contestantName,
      dNo: dNo,
      lotNumber: lotNo,
      attendance: attendance,
      malpracticeDetails: malpracticeDetails,
    });
    // console.log(savedAttendance);
    return NextResponse.json(
      {
        message: "saved attendance",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in save attendance route");
    console.log(error);
    return NextResponse.json(
      {
        message: "failed to save attendancec",
        success: false,
      },
      { status: 400 }
    );
  }
}

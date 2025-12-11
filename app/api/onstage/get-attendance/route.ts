import dbConnect from "@/utils/dbConnect";
import OnStageAttendance from "@/models/OnStageAttendance";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { eventName } = await req.json();

    if (!eventName) {
      return Response.json(
        { success: false, message: "Event name is required." },
        { status: 400 }
      );
    }

    // Fetch marked attendance for the event
    const records = await OnStageAttendance.find({ eventName }).lean();

    return Response.json({
      success: true,
      attendance: records,
    });
  } catch (error) {
    console.error("OnStage Attendance Fetch Error:", error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

import dbConnect from "@/utils/dbConnect";
import OnStageAttendance from "@/models/OnStageAttendance";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { eventName } = await req.json();

    if (!eventName) {
      return Response.json(
        { success: false, message: "eventName is required" },
        { status: 400 }
      );
    }

    const records = await OnStageAttendance.find({ eventName }).lean();

    return Response.json({
      success: true,
      attendance: records,
    });
  } catch (error) {
    console.error("Attendance load error:", error);
    return Response.json(
      { success: false, message: "Failed to load attendance" },
      { status: 500 }
    );
  }
}

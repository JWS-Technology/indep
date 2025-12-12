import dbConnect from "@/utils/dbConnect";
import OnStageEventReg from "@/models/OnStageEventReg";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all event registrations
    const events = await OnStageEventReg.find({}, { eventName: 1 }).lean();

    // Extract unique event names
    const eventNames = Array.from(
      new Set(events.map((e) => e.eventName).filter(Boolean))
    );

    return Response.json({
      success: true,
      events: eventNames,
    });
  } catch (error) {
    console.error("OnStage get-events API error:", error);
    return Response.json(
      { success: false, message: "Failed to load on-stage events." },
      { status: 500 }
    );
  }
}

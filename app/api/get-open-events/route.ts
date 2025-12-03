// app/api/events/open/route.ts
import dbConnect from "@/utils/dbConnect";
import Event from "@/models/Event";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Find events where openRegistration is true
    const events = await Event.find({ openRegistration: true }).lean();

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error fetching open events:", err);

    return new Response(
      JSON.stringify({ error: err?.message ?? "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

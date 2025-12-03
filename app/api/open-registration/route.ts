// app/api/events/open-registration/route.ts
import dbConnect from "@/utils/dbConnect";
import Event from "@/models/Event";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, openRegistration } = body ?? {};

    // Basic validation
    if (!eventId || typeof eventId !== "string") {
      return new Response(
        JSON.stringify({ error: "eventId is required and must be a string" }),
        { status: 400 }
      );
    }
    if (typeof openRegistration !== "boolean") {
      return new Response(
        JSON.stringify({
          error: "openRegistration is required and must be a boolean",
        }),
        { status: 400 }
      );
    }

    // Connect to DB
    await dbConnect();

    // Update the event
    const updated = await Event.findByIdAndUpdate(
      eventId,
      { openRegistration },
      { new: true, runValidators: true }
    ).lean();
    console.log(updated);

    if (!updated) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, event: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("open-registration error:", err);

    if (err?.name === "CastError") {
      return new Response(JSON.stringify({ error: "Invalid eventId format" }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// Optional: allow other methods (e.g., PATCH) with a simple handler

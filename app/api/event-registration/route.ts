// app/api/register/route.ts
import dbConnect from "@/utils/dbConnect";
import Registration from "@/models/EventRegistration";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Basic validation
    const { eventName, teamName, songTitle = "", tune = "" } = body ?? {};

    if (!eventName || typeof eventName !== "string" || !eventName.trim()) {
      return new Response(JSON.stringify({ error: "eventName is required" }), { status: 400 });
    }
    if (!teamName || typeof teamName !== "string" || !teamName.trim()) {
      return new Response(JSON.stringify({ error: "teamName is required" }), { status: 400 });
    }

    // Connect to DB
    await dbConnect();

    // Create registration document
    const registration = await Registration.create({
      eventName: eventName.trim(),
      teamName: teamName.trim(),
      songTitle: String(songTitle).trim(),
      tune: String(tune).trim(),
      // registrationDate uses schema default if omitted
    });

    // Return created document
    return new Response(JSON.stringify({ success: true, registration }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Registration error:", err);

    // Handle Mongoose validation / duplicate key errors gracefully where possible
    if (err?.name === "ValidationError") {
      return new Response(JSON.stringify({ error: err.message }), { status: 422 });
    }
    if (err?.code === 11000) {
      // duplicate key (if you enforce unique fields later)
      return new Response(JSON.stringify({ error: "Duplicate entry" }), { status: 409 });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

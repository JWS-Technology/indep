// app/api/register/route.ts
import dbConnect from "@/utils/dbConnect";
import Registration from "@/models/EventRegistration";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Basic validation
    const {
      eventName,
      teamName,
      songTitle = "",
      tune = "",
      teamId,
    } = body ?? {};

    if (!eventName || typeof eventName !== "string" || !eventName.trim()) {
      return new Response(JSON.stringify({ error: "eventName is required" }), {
        status: 400,
      });
    }
    if (!teamName || typeof teamName !== "string" || !teamName.trim()) {
      return new Response(JSON.stringify({ error: "teamName is required" }), {
        status: 400,
      });
    }

    // Connect to DB
    await dbConnect();

    // Create registration document
    const registration = await Registration.create({
      eventName: eventName.trim(),
      teamName: teamName.trim(),
      teamId: teamId,
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
      return new Response(JSON.stringify({ error: err.message }), {
        status: 422,
      });
    }
    if (err?.code === 11000) {
      // duplicate key (if you enforce unique fields later)
      return new Response(JSON.stringify({ error: "Duplicate entry" }), {
        status: 409,
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      eventName,
      teamName,
      songTitle = "",
      tune = "",
      teamId,
      registeredDataId,
      status = "pending",
      remark,
    } = body ?? {};

    // basic id validation
    if (!registeredDataId || typeof registeredDataId !== "string") {
      return new Response(
        JSON.stringify({ error: "registeredDataId is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Build updates object, trimming strings
    const updates: Record<string, any> = {};

    if (typeof eventName === "string" && eventName.trim())
      updates.eventName = eventName.trim();
    if (typeof teamName === "string" && teamName.trim())
      updates.teamName = teamName.trim();
    if (typeof teamId === "string" && teamId.trim())
      updates.teamId = teamId.trim();

    // songTitle and tune may be empty strings intentionally; keep them as strings
    if (typeof songTitle !== "undefined")
      updates.songTitle = String(songTitle).trim();
    if (typeof tune !== "undefined") updates.tune = String(tune).trim();

    if (typeof remark !== "undefined") updates.remark = String(remark).trim();

    // Optional: validate status against allowed enum
    if (typeof status !== "undefined") {
      const allowed = ["pending", "approved", "correction"];
      if (!allowed.includes(status)) {
        return new Response(
          JSON.stringify({
            error: `Invalid status. Allowed: ${allowed.join(", ")}`,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      updates.status = status;
    }

    // If nothing to update
    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields provided to update" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Execute update
    const updated = await Registration.findByIdAndUpdate(
      registeredDataId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return new Response(JSON.stringify({ error: "Registration not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Update error:", err);

    // invalid ObjectId (CastError) or other mongoose cast issues
    if (err?.name === "CastError") {
      return new Response(
        JSON.stringify({ error: "Invalid registeredDataId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (err?.name === "ValidationError") {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

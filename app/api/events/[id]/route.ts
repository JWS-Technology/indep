import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Event from "@/models/Event";

// Fix: Define params as a Promise
type Props = {
  params: Promise<{ id: string }>;
};

// Update Event (Schedule Time/Venue)
// Update Event (Schedule Time/Venue)
export async function PUT(req: Request, { params }: Props) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();

    // REMOVED OR MODIFIED LOGIC:
    // Only auto-update to 'scheduled' if the status is currently 'pending'.
    // This prevents overwriting 'live', 'completed', or 'cancelled'.
    if (body.venue && body.time && body.status === "pending") {
      body.status = "scheduled";
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json({ message: "Event updated", event: updatedEvent });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// Delete Event
export async function DELETE(req: Request, { params }: Props) {
  await dbConnect();
  try {
    // Fix: Await the params here as well
    const { id } = await params;

    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: Props) {
  await dbConnect();
  try {
    const { id } = await params;

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

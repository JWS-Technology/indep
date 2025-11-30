import { NextResponse } from "next/server";
import connectDB from "@/app/api/db/connection";
import Event from "@/models/Event";

export async function GET() {
  await connectDB();
  try {
    const events = await Event.find({}).sort({ date: 1, time: 1 });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const newEvent = await Event.create(body);
    return NextResponse.json(
      { message: "Event created", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

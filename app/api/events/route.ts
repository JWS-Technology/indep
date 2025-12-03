import { NextResponse } from "next/server";
import Event from "@/models/Event";
import dbConnect from "@/utils/dbConnect";

export async function GET() {
  await dbConnect();
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
  await dbConnect();
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

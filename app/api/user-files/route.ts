import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import dbConnect from "@/utils/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const events = body.events;

  if (!events || !Array.isArray(events)) {
    return NextResponse.json(
      { error: "Missing or invalid events" },
      { status: 400 }
    );
  }

  const uploadBase = path.join(process.cwd(), "public", "uploads");

  const results: any[] = [];

  for (let event of events) {
    const safeEvent = event.replace(/[^a-zA-Z0-9_\- ]/g, "_");
    const eventDir = path.join(uploadBase, safeEvent);

    if (!fs.existsSync(eventDir)) {
      results.push({ event, files: [] });
      continue;
    }

    const files = fs.readdirSync(eventDir).map((file) => ({
      name: file,
      url: `/uploads/${safeEvent}/${file}`,
    }));

    results.push({ event, files });
  }

  return NextResponse.json({ events: results });
}

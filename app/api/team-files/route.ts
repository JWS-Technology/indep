import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  const body = await req.json();
  const { teamId } = body;

  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }

  const uploadBase = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadBase)) {
    return NextResponse.json(
      { error: "Uploads folder not found" },
      { status: 404 }
    );
  }

  const eventFolders = fs.readdirSync(uploadBase); // folk, western dance, etc.

  const result: any[] = [];

  for (const eventFolder of eventFolders) {
    const eventDir = path.join(uploadBase, eventFolder);

    if (!fs.lstatSync(eventDir).isDirectory()) continue;

    const files = fs
      .readdirSync(eventDir)
      .filter((file) => file.startsWith(teamId)) // filter by team ID
      .map((file) => ({
        name: file,
        url: `/uploads/${eventFolder}/${file}`,
      }));

    if (files.length > 0) {
      result.push({
        event: eventFolder,
        files,
      });
    }
  }

  return NextResponse.json({ files: result });
}

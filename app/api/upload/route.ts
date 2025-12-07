import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import dbConnect from "@/utils/dbConnect";
import Upload from "@/models/Upload";

export const runtime = "nodejs";

// File save directory
const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  try {
    await dbConnect();

    const form = await req.formData();

    const file = form.get("file") as File;
    const teamId = form.get("teamId") as string;
    const teamName = form.get("teamName") as string;
    const eventName = form.get("eventName") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read stream → buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop();
    const newFileName = `${teamId}_${teamName}_${eventName}.${ext}`;
    const filePath = path.join(uploadDir, newFileName);

    // Write to disk
    await fs.writeFile(filePath, buffer);

    // Save to MongoDB
    await Upload.create({
      teamName,
      event: eventName,
      teamId,
      originalName: file.name,
      fileName: newFileName,
      fileType: file.type,
      size: file.size,
      path: `/uploads/${newFileName}`,
    });

    return NextResponse.json(
      {
        message: "File uploaded & saved to DB",
        filePath: `/uploads/${newFileName}`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json(
      { message: "Upload failed", error: err.toString() },
      { status: 500 }
    );
  }
}

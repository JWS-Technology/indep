// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs"; // correct runtime value: 'nodejs' (not 'node')

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  try {
    // ensure upload dir exists
    await fs.mkdir(uploadDir, { recursive: true });

    // parse incoming form data (works in route handlers)
    const formData = await req.formData();

    // 'mediaFile' is the <input name="mediaFile" /> on the client
    const file = formData.get("mediaFile") as File | null;
    if (!file) {
      return NextResponse.json({ message: "No file uploaded (mediaFile missing)" }, { status: 400 });
    }

    // File has a name property in many runtimes; fallback to timestamped filename
    let originalName = `upload-${Date.now()}`;
    if (file && 'name' in file && typeof (file as { name: unknown }).name === 'string') {
      originalName = (file as { name: string }).name;
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // write file to disk
    const dest = path.join(uploadDir, originalName);
    await fs.writeFile(dest, buffer);

    const url = `/uploads/${originalName}`;
    return NextResponse.json({
      message: "File uploaded successfully",
      filename: originalName,
      size: buffer.length,
      url,
    }, { status: 200 });
  } catch (err) {
    console.error("upload error:", err);
    return NextResponse.json({
      message: "Upload failed",
      error: String(err),
    }, { status: 500 });
  }
}

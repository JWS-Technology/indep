// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import dbConnect from "@/utils/dbConnect";
import FileModel from "@/models/File";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  await dbConnect(); // ensure MongoDB connection

  try {
    // ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await req.formData();

    const file = formData.get("mediaFile") as File | null;
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded (mediaFile missing)" },
        { status: 400 }
      );
    }

    // get original file name
    let originalName = `upload-${Date.now()}`;
    if (file instanceof File && typeof file.name === "string") {
      originalName = file.name;
    }

    // get file type (mime)
    const fileType = file instanceof File && typeof file.type === "string"
      ? file.type || "application/octet-stream"
      : "application/octet-stream";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // create unique stored filename to prevent overwriting
    const uniqueFilename = `${Date.now()}-${originalName}`;

    const filePath = path.join(uploadDir, uniqueFilename);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    // SAVE to MongoDB
    const saved = await FileModel.create({
      originalName,
      filename: uniqueFilename,
      fileType,
      size: buffer.length,
      url: fileUrl,
      folder: null,
      uploadedBy: null,
    });

    return NextResponse.json(
      {
        message: "File uploaded & saved to DB",
        file: saved,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("upload error:", err);
    return NextResponse.json(
      {
        message: "Upload failed",
        error: String(err),
      },
      { status: 500 }
    );
  }
}

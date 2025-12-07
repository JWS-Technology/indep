// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import dbConnect from "@/utils/dbConnect";
import Upload from "@/models/Upload";

export const runtime = "nodejs";

// Directory: /public/uploads
const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  try {
    await dbConnect();
    // console.log(await req.json());
    // console.log(await req.body);
    const { fileType, fileSize, fileName, teamData, data, eventName } =
      await req.json();
    // console.log(fileType, fileSize, fileName, teamData, eventName);

    // return NextResponse.json(
    //   {
    //     message: "File uploaded & saved to DB",
    //     filePath: `/uploads/${fileName}`,
    //   },
    //   { status: 200 }
    // );

    if (!data || !fileName) {
      return NextResponse.json(
        { message: "Missing file or data" },
        { status: 400 }
      );
    }

    // Convert base64 → Buffer
    const buffer = Buffer.from(data, "base64");

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate safe file path
    const newFileName = `${teamData.teamId}_${teamData.teamName}_${eventName}`;
    const filePath = path.join(uploadDir, newFileName);

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    // Save in MongoDB
    await Upload.create({
      teamName: teamData.teamName,
      event: eventName,
      teamId: teamData.teamId,
      originalName: fileName,
      fileName: newFileName,
      fileType: fileType,
      size: fileSize,
      path: `/uploads/${fileName}`,
    });
    console.log("success");
    return NextResponse.json(
      {
        message: "File uploaded & saved to DB",
        filePath: `/uploads/${fileName}`,
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

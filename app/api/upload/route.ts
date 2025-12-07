import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import dbConnect from "@/utils/dbConnect";
import Upload from "@/models/Upload";

export const runtime = "nodejs";

// File save directory
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Helper: sanitize folder/filename parts
function cleanName(str: string) {
  return str.replace(/[^a-zA-Z0-9_\- .]/g, "_");
}

// Helper: write file + auto-create folder
async function writeFileWithDirs(filePath: string, buffer: Buffer) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const form = await req.formData();

    const file = form.get("file") as File | null;
    const rawTeamId = form.get("teamId");
    const rawTeamName = form.get("teamName");
    const rawEventName = form.get("eventName");

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Safe values
    const teamId = cleanName(String(rawTeamId ?? "unknown"));
    const teamName = cleanName(String(rawTeamName ?? "unknown_team"));
    const eventName = cleanName(String(rawEventName ?? "general"));

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine extension
    let ext = "";
    if (file.name.includes(".")) {
      ext = cleanName(file.name.split(".").pop() || "bin");
    } else if (file.type.includes("/")) {
      ext = file.type.split("/").pop() || "bin";
    } else {
      ext = "bin";
    }

    // Build filename and path
    const newFileName = `${teamId}_${teamName}_${eventName}.${ext}`;
    const eventDir = path.join(uploadDir, eventName);
    const filePath = path.join(eventDir, newFileName);

    // Write file (auto-create folder)
    await writeFileWithDirs(filePath, buffer);

    // Store a web-friendly path instead of absolute filesystem path
    const publicPath = `/uploads/${eventName}/${newFileName}`;

    // Save to DB
    await Upload.create({
      teamName,
      event: eventName,
      teamId,
      originalName: file.name,
      fileName: newFileName,
      fileType: file.type,
      size: file.size,
      path: publicPath, // NOT filePath (absolute)
    });

    return NextResponse.json(
      {
        message: "File uploaded & saved to DB",
        path: publicPath,
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


// import { NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";

// import dbConnect from "@/utils/dbConnect";
// import Upload from "@/models/Upload";

// export const runtime = "nodejs";

// // File save directory
// const uploadDir = path.join(process.cwd(), "public", "uploads");

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     const form = await req.formData();

//     const file = form.get("file") as File;
//     const teamId = form.get("teamId") as string;
//     const teamName = form.get("teamName") as string;
//     const eventName = form.get("eventName") as string;

//     if (!file) {
//       return NextResponse.json(
//         { message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // Read stream → buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Ensure directory exists
//     await fs.mkdir(uploadDir, { recursive: true });

//     const ext = file.name.split(".").pop();
//     const newFileName = `${teamId}_${teamName}_${eventName}.${ext}`;
//     const filePath = path.join(`${uploadDir}/${eventName}`, newFileName);

//     // Write to disk
//     await fs.writeFile(filePath, buffer);

//     // Save to MongoDB
//     await Upload.create({
//       teamName,
//       event: eventName,
//       teamId,
//       originalName: file.name,
//       fileName: newFileName,
//       fileType: file.type,
//       size: file.size,
//       path: filePath,
//     });

//     return NextResponse.json(
//       {
//         message: "File uploaded & saved to DB",
//         // filePath: filePath,
//       },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("Upload Error:", err);
//     return NextResponse.json(
//       { message: "Upload failed", error: err.toString() },
//       { status: 500 }
//     );
//   }
// }

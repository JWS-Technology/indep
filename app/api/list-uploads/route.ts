import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const uploadsPath = path.join(process.cwd(), "public", "uploads");

    const list = await readDirRecursive(uploadsPath);

    return NextResponse.json({ files: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function readDirRecursive(dir: string) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  const results: any[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = fullPath.replace(process.cwd(), "");

    if (entry.isDirectory()) {
      results.push({
        type: "folder",
        name: entry.name,
        path: relativePath,
        children: await readDirRecursive(fullPath),
      });
    } else {
      results.push({
        type: "file",
        name: entry.name,
        path: relativePath.replace("\\", "/"),
        url: relativePath.replace(/\\/g, "/"),
      });
    }
  }

  return results;
}

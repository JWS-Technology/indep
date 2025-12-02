import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";
import Team from "@/models/Team";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // 1. Get Token from cookies
    // Note: In Next.js 15, cookies() is async, but headers().get('cookie') is often easier for simple extraction
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    // Simple manual parsing or use a library. Assuming standard format:
    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-this"
    );

    // 2. Fetch fresh Team data
    const team = await Team.findById(decoded.id).select("-password");

    return NextResponse.json({ success: true, team });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid Token" },
      { status: 401 }
    );
  }
}

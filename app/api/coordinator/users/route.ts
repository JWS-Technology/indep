import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  try {
    const users = await User.find({ role }).select("-password");

    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // 1. Get the role from the URL query params (e.g., ?role=student)
    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get("role");

    // 2. Build the database query
    // If a role is provided and it's not "all", filter by that role.
    const query = roleParam && roleParam !== "all" ? { role: roleParam } : {};

    // 3. Fetch from DB
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select("-password")
      .lean();

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";
import Team from "@/models/Departments";

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { newPassword } = await request.json();

    // Auth Check
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");
    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-this"
    );

    // Update DB
    await Team.findByIdAndUpdate(decoded.id, {
      password: newPassword, // In production, hash this!
      isPasswordChanged: true,
    });

    // We recommend logging them out so they re-login with new password, or update token.
    // Dashboard handles redirect to login.
    const response = NextResponse.json({ success: true });
    response.cookies.delete("token"); // Force re-login
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

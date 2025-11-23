import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";
import connectDB from "../db/connection";

export async function GET(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await User.find().select("-password");

  return NextResponse.json({
    role: decoded.role,
    users,
  });
}

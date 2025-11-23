import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectDB } from "../../db/connection";

export async function POST(request: Request) {
  await connectDB();
  const { name, email, password } = await request.json();

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });

  return NextResponse.json({ success: true });
}

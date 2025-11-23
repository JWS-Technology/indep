import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectDB } from "../../db/connection";

export async function POST(request: Request) {
  await connectDB();

  const { email, password } = await request.json();
  const user: any = await User.findOne({ email });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  return NextResponse.json({ success: true, user });
}

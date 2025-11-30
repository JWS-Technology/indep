import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/app/api/db/connection";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );

    // 🔥 Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        department: user.department,
        assignedEvent: user.assignedEvent,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 🔥 Store JWT in secure cookies
    const response = NextResponse.json({
      message: "Login success",
      role: user.role,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

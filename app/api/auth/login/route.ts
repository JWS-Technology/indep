import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // 1. Get collegeId instead of email
    const { collegeId, password } = await req.json();
    console.log("Login Attempt:", collegeId);

    // 2. Find user by collegeId
    // Note: We use a case-insensitive regex or just ensure input is cleaned.
    // Ideally, store IDs in uppercase and convert input to uppercase.
    const user = await User.findOne({ collegeId });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // 🔥 Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        department: user.department,
        collegeId: user.collegeId, // Added collegeId to payload
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

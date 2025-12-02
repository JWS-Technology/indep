import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Team from "@/models/Team"; // 🔥 IMPORTANT
import dbConnect from "@/utils/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { collegeId, password } = await req.json();
    console.log("Login Attempt:", collegeId);

    // 1️⃣ Check Team Collection First (Department Login)
    const team = await Team.findOne({ teamId: collegeId });

    if (team) {
      const isMatch = await bcrypt.compare(password, team.password);
      if (!isMatch)
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 400 }
        );

      const token = jwt.sign(
        {
          id: team._id,
          role: "team",
          department: team.teamName,
          teamId: team.teamId,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        message: "Login success",
        role: "team",
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // 2️⃣ If not a team, fallback to normal User login
    const user = await User.findOne({ collegeId });

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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        department: user.department,
        collegeId: user.collegeId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login success",
      role: user.role,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

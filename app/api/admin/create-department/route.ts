import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/dbConnect";
import Team from "@/models/Team";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.name || !body.collegeId || !body.password || !body.shift) {
      return NextResponse.json(
        { error: "Department Name, ID, Password, and Shift are required" },
        { status: 400 }
      );
    }

    const existingTeam = await Team.findOne({ teamId: body.collegeId });
    if (existingTeam) {
      return NextResponse.json(
        { error: "A department with this ID already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newTeam = await Team.create({
      teamName: body.name,
      teamId: body.collegeId,
      password: hashedPassword, // 🔥 FIXED
      shift: body.shift,
    });

    return NextResponse.json({
      success: true,
      message: "Department created successfully",
      data: newTeam,
    });
  } catch (error: any) {
    console.error("Create Department Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create department" },
      { status: 500 }
    );
  }
}

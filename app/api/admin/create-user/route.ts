import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/api/db/connection";
import User from "@/models/User";
import { shiftOne, shiftTwo } from "@/data/teams"; // your arrays

export async function POST(req: Request) {
  console.log("req came");
  try {
    await connectDB();

    const body = await req.json();
    const { name, collegeId, password, role, department } = body;

    // Validate department exists in your arrays
    const validDepartments = [...shiftOne, ...shiftTwo];

    if (!validDepartments.includes(department)) {
      return NextResponse.json(
        { error: "Invalid department" },
        { status: 400 }
      );
    }

    // Check duplicate college ID
    const exist = await User.findOne({ collegeId });
    if (exist) {
      return NextResponse.json(
        { error: "College ID already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      collegeId,
      password: hashed,
      role,
      department,
    });

    return NextResponse.json({ message: "User created", user: newUser });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

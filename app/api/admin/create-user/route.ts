import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { shiftOne, shiftTwo } from "@/data/teams"; // your arrays
import dbConnect from "@/utils/dbConnect";
import Team from "@/models/Team";

export async function POST(req: Request) {
  console.log("req came");
  try {
    await dbConnect();

    const body = await req.json();
    const { name, collegeId, password, role, department, email, phone } = body;

    // Validate department exists in your arrays
    // const validDepartments = [...shiftOne, ...shiftTwo];

    // if (!validDepartments.includes(department)) {
    //   console.log(department)
    //   return NextResponse.json(
    //     { error: "Invalid department" },
    //     { status: 400 }
    //   );
    // }

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
      email,
      phone,
    });
    newUser.save();
    if (role === "faculty" || role === "student") {
      await Team.updateOne(
        { teamName: department },
        {
          $set: {
            [`membersCreated.${role}`]: true, // ⬅ DYNAMICALLY update faculty OR student
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User created",
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

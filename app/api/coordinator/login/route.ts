import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Coordinator from "@/models/Coordinator";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { dNo, password } = await req.json();

    // 1. Validate Input
    if (!dNo || !password) {
      return NextResponse.json(
        { error: "Please provide Department No and Password" },
        { status: 400 }
      );
    }

    // 2. Find Coordinator
    // We must use .select('+password') because it is hidden by default in your schema
    const coordinator = await Coordinator.findOne({
      dNo: { $regex: new RegExp(`^${dNo}$`, "i") }, // Case insensitive search
    }).select("+password");

    if (!coordinator) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Verify Password (Plain text comparison based on your sample data)
    if (coordinator.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Generate JWT Token
    const token = jwt.sign(
      {
        id: coordinator._id,
        role: "coordinator",
        name: coordinator.name,
        dNo: coordinator.dNo,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Create Response and Set Cookie
    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";
import Coordinator from "@/models/Coordinator";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function GET(req: NextRequest) {
  try {
    // 1. Get the token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded || decoded.role !== "coordinator") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid role" },
        { status: 401 }
      );
    }

    // 3. Connect to DB
    await dbConnect();

    // 4. Fetch Coordinator Details (excluding password)
    const coordinator = await Coordinator.findById(decoded.id).select(
      "-password"
    );

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: "Coordinator not found" },
        { status: 404 }
      );
    }

    // 5. Return Data
    return NextResponse.json(
      {
        success: true,
        coordinator: coordinator,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/utils/dbConnect"; // Ensure this path matches your project structure
import Coordinator from "@/models/Coordinator";

export async function POST(req: Request) {
  try {
    // 1. Connect to Database
    await dbConnect();

    // 2. Parse Request Body
    const body = await req.json();
    const { name, dNo, password, assignedEvents } = body;

    // 3. Validation
    if (!name || !dNo || !password) {
      return NextResponse.json(
        { error: "Name, Department No (dNo), and Password are required." },
        { status: 400 }
      );
    }

    // 4. Check for Duplicate dNo
    // Case-insensitive check
    const existingCoordinator = await Coordinator.findOne({
      dNo: { $regex: new RegExp(`^${dNo}$`, "i") },
    });

    if (existingCoordinator) {
      return NextResponse.json(
        { error: "A Coordinator with this Department No. already exists." },
        { status: 409 }
      );
    }

    // 5. Create New Coordinator (Plain Text Password)
    const newCoordinator = await Coordinator.create({
      name,
      dNo,
      password: password, // Storing directly without encryption
      assignedEvents: assignedEvents || [],
    });

    // 6. Return Success
    return NextResponse.json(
      {
        success: true,
        message: "Coordinator created successfully",
        coordinator: {
          id: newCoordinator._id,
          name: newCoordinator.name,
          dNo: newCoordinator.dNo,
          assignedEvents: newCoordinator.assignedEvents,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Coordinator Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Coordinator from "@/models/Coordinator";

// --- UPDATE (PUT) ---
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Update type to Promise
) {
  try {
    await dbConnect();

    // 2. AWAIT params before using id
    const { id } = await params;

    const body = await req.json();

    // Logic: If password is an empty string, remove it from the update
    const updateData = { ...body };
    if (!updateData.password || updateData.password.trim() === "") {
      delete updateData.password;
    }

    // Update the coordinator
    const updatedCoordinator = await Coordinator.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCoordinator) {
      return NextResponse.json(
        { error: "Coordinator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coordinator: updatedCoordinator,
      message: "Coordinator updated successfully",
    });
  } catch (error: any) {
    console.error("Update Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A Coordinator with this Department No. already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update coordinator" },
      { status: 500 }
    );
  }
}

// --- DELETE (DELETE) ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Update type to Promise
) {
  try {
    await dbConnect();

    // 2. AWAIT params before using id
    const { id } = await params;

    const deletedCoordinator = await Coordinator.findByIdAndDelete(id);

    if (!deletedCoordinator) {
      return NextResponse.json(
        { error: "Coordinator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coordinator deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete coordinator" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Registration from "@/models/EventRegistration";
import dbConnect from "@/utils/dbConnect";

// Update Registration (Status, Remarks, etc.)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }   // <-- accept Promise here
) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id } = await params;                       // <-- await params to get id

    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updatedRegistration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: updatedRegistration,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update registration" },
      { status: 500 }
    );
  }
}

// Delete Registration
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }   // <-- accept Promise here too
) {
  try {
    await dbConnect();
    const { id } = await params;                       // <-- await params to get id

    const deletedRegistration = await Registration.findByIdAndDelete(id);

    if (!deletedRegistration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}

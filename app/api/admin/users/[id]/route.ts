import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

// Define Params type as Promise for Next.js 15+
type Props = {
  params: Promise<{ id: string }>;
};

// --- UPDATE USER (PUT) ---
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Prepare update object
    const updateData: any = {
      name: body.name,
      collegeId: body.collegeId,
      email: body.email,
      phone: body.phone,
      role: body.role,
      department: body.department,
    };

    // Only hash password if it was provided in the edit form
    if (body.password && body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update User Error:", error);
    // Handle Duplicate Key Errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "College ID or Email already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// --- DELETE USER (DELETE) ---
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "User deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

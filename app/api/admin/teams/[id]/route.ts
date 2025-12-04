import Team from "@/models/Team";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

// 1. Define the type for params as a Promise
type Props = {
  params: Promise<{ id: string }>;
};

// Handle PUT (Update)
export async function PUT(
  request: NextRequest,
  // 2. Update the second argument to match the Promise type
  { params }: Props
) {
  try {
    await dbConnect();

    // 3. Await the params before accessing 'id'
    const { id } = await params;

    const body = await request.json();

    const updateData: any = {
      teamId: body.teamId,
      teamName: body.teamName,
      shift: body.shift,
      isPasswordChanged: body.isPasswordChanged,
      membersCreated: body.membersCreated,
    };

    if (body.password && body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    const updatedTeam = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTeam) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, team: updatedTeam },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Team Error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Team ID must be unique." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// Handle DELETE (Remove)
export async function DELETE(
  request: NextRequest,
  // 4. Update the type here as well
  { params }: Props
) {
  try {
    await dbConnect();

    // 5. Await the params here as well
    const { id } = await params;

    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Team deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Team Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete team" },
      { status: 500 }
    );
  }
}

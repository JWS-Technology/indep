import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Registration from "@/models/EventRegistration";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id, status, remark } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Registration ID and Status are required" },
        { status: 400 }
      );
    }

    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      {
        status,
        remark:
          remark ||
          (status === "approved" ? "Approved" : "Correction Required"),
      },
      { new: true }
    );

    if (!updatedRegistration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      data: updatedRegistration,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// app/api/lots/[id]/route.ts

import dbConnect from "@/utils/dbConnect";
import Lot from "@/models/Lot";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: any) {
  try {
    await dbConnect();

    const id = params.id;
    console.log("Deleting lot:", id);

    const deleted = await Lot.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Lot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Lot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting lot" },
      { status: 500 }
    );
  }
}

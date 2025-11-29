import { NextResponse } from "next/server";
import Visitor from "@/lib/models/Visitor";
import connectDB from "@/app/api/db/connection";

export async function GET() {
  try {
    await connectDB();

    // Fetch existing counter
    let counter = await Visitor.findOne();

    // Create document if not exists
    if (!counter) {
      counter = await Visitor.create({ total: 0 });
    }

    // Increase by 1 on EVERY visit
    counter.total += 1;
    console.log(counter);
    await counter.save();

    return NextResponse.json({ total: counter.total });
  } catch (error) {
    console.error("Error updating visitor count:", error);
    return NextResponse.json(
      { error: "Failed to update count" },
      { status: 500 }
    );
  }
}

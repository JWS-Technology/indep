import Lot from "@/models/Lot";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch ONLY teams that have registered lots
    const lots = await Lot.find({});

    return NextResponse.json(
      { success: true, lots },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error fetching lots" },
      { status: 500 }
    );
  }
}

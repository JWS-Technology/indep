import { NextResponse } from "next/server";
import Registration from "@/models/EventRegistration";
import dbConnect from "@/utils/dbConnect";

export async function GET() {
  try {
    console.log("req came");
    await dbConnect();

    const registrations = await Registration.find({}).sort({
      registrationDate: -1,
    });
    console.log(registrations);
    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

import Coordinator from "@/models/Coordinator";
import Registration from "@/models/EventRegistration";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const coordinator = await Coordinator.findOne({ dNo: body.dNo });
    // console.log(coordinator.assignedEvents);

    const registrationData = await Registration.find({
      eventName: { $in: coordinator.assignedEvents },
    });

    // console.log(registrationData);

    return NextResponse.json(
      { success: true, message: "events sent", eventData: registrationData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 400 }
    );
  }
}

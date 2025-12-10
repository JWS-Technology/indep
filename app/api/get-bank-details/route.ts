import BankDetails from "@/models/BankDetails";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { teamId } = await req.json();

    const savedDetails = await BankDetails.findOne({
      teamId: teamId,
    });

    console.log("this is saved bank deails");
    console.log(savedDetails);

    return NextResponse.json(
      {
        message: "got bank details successfully",
        success: true,
        bankDetails: savedDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in save bank details route");
    console.log(error);
    return NextResponse.json(
      {
        message: "failed to save bank details",
        success: false,
      },
      { status: 400 }
    );
  }
}

import BankDetails from "@/models/BankDetails";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    // console.log("Req came");
    const { teamId, teamName, managerName, accountNo, ifsc, bankName } =
      await req.json();
    // console.log(body);

    const alreadyFilled = await BankDetails.findOne({
      teamId: teamId,
    });

    if (alreadyFilled) {
      const updatedDetails = await BankDetails.updateOne(
        { teamId }, // find the document
        {
            $set: {
            teamName,
            managerName,
            accountNumber: accountNo,
            bankName,
            ifscCode: ifsc,
          },
        },
        { upsert: true } // optional: create if doesn't exist
      );
      console.log(updatedDetails);
      return NextResponse.json(
        {
          message: "Updated bank details successfully",
          success: true,
        },
        { status: 200 }
      );
    }

    const savedDetails = await BankDetails.create({
      teamId: teamId,
      teamName: teamName,
      managerName: managerName,
      accountNumber: accountNo,
      bankName: bankName,
      ifscCode: ifsc,
    });

    // console.log(savedDetails);

    return NextResponse.json(
      {
        message: "bank details saved successfully",
        success: true,
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

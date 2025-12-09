import Lot from "@/models/Lot";
import OffStageEventReg from "@/models/OffStageEventReg";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const lots = await Lot.aggregate([
      {
        $lookup: {
          from: OffStageEventReg.collection.name, // correct collection name
          let: { eventName: "$event", teamId: "$team_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$eventName", "$$eventName"] },
                    { $eq: ["$teamId", "$$teamId"] }
                  ]
                }
              }
            }
          ],
          as: "registration"
        }
      },
      // convert array → single object (first matching registration)
      {
        $addFields: {
          registration: { $arrayElemAt: ["$registration", 0] }
        }
      }
    ]);

    return NextResponse.json({ success: true, lots }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error fetching lots" }, { status: 500 });
  }
}

// import Lot from "@/models/Lot";
// import OffStageEventReg from "@/models/OffStageEventReg";
// import dbConnect from "@/utils/dbConnect";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();

//     // Fetch ONLY teams that have registered lots
//     const lots = await Lot.find({});

//     console.log(lots)

//     return NextResponse.json(
//       { success: true, lots },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { success: false, message: "Error fetching lots" },
//       { status: 500 }
//     );
//   }
// }

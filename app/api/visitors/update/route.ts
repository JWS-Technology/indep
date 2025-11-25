import connectDB from "@/app/api/db/connection";
import Visitor from "@/lib/models/Visitor";

export async function POST() {
    await connectDB();

    // ensure single record exists
    let record = await Visitor.findOne();
    if (!record) record = await Visitor.create({ count: 1 });

    // increment count
    record.count += 1;
    await record.save();

    return Response.json({ count: record.count });
}

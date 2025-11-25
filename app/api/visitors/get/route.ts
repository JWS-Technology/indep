import connectDB from "@/app/api/db/connection";
import Visitor from "@/lib/models/Visitor";

export async function GET() {
    await connectDB();

    const record = await Visitor.findOne();
    return Response.json({ count: record?.count || 0 });
}

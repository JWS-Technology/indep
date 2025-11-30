import { NextResponse } from "next/server";
import Visitor from "@/models/Visitor";
import connectDB from "@/app/api/db/connection";

export async function GET() {
  await connectDB();
  let counter = await Visitor.findOne();
  if (!counter) counter = await Visitor.create({ total: 0 });

  return NextResponse.json({ total: counter.total });
}

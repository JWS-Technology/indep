import { NextResponse } from "next/server";
import Visitor from "@/models/Visitor";
import dbConnect from "@/utils/dbConnect";

export async function GET() {
  await dbConnect();
  let counter = await Visitor.findOne();
  if (!counter) counter = await Visitor.create({ total: 0 });

  return NextResponse.json({ total: counter.total });
}

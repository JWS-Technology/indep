import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true });

  // Replace "token" with your actual cookie name
  res.cookies.set("token", "", { maxAge: 0, path: "/" });

  return res;
}

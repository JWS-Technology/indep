import { NextResponse } from "next/server";

export async function POST() {
  // Clear the token cookie
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // expire immediately
  });

  return response;
}

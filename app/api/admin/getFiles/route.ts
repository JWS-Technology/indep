import { NextResponse } from "next/server";
// Assuming dbConnect and FileModel are located here based on your previous backend route
import dbConnect from "@/utils/dbConnect"; 
import FileModel from "@/models/File"; 

export const runtime = "nodejs";

export async function GET() {
  await dbConnect(); // Ensure connection to MongoDB

  try {
    // 1. Fetch all documents from the FileModel collection
    // The .lean() method tells Mongoose to return plain JavaScript objects 
    // rather than full Mongoose Documents, which is faster for API responses.
    const files = await FileModel.find({}).lean();

    // 2. Return the data with a success status
    return NextResponse.json(
      {
        message: "Successfully retrieved all files",
        files: files,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("GET /api/files error:", err);
    
    // 3. Handle errors and return a 500 internal server error response
    return NextResponse.json(
      {
        message: "Failed to retrieve files",
        error: String(err),
      },
      { status: 500 }
    );
  }
}
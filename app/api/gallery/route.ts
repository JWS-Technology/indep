import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import GalleryImage from "@/models/GalleryImage";

// Force dynamic ensures this API is not cached statically at build time
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Connect to Backend
    await dbConnect();

    // 2. Fetch Data
    const images = await GalleryImage.find({}).sort({ createdAt: -1 });

    // 3. Return JSON Response
    return NextResponse.json({ success: true, data: images });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch images",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Debug: Log what is actually being received
    console.log("Attempting to create GalleryImage with:", body);

    // Validation & Data Normalization
    // The error "Path `src` is required" indicates the DB Schema expects a 'src' field.
    // If the frontend sent 'imageUrl' or 'url' by mistake, we map it to 'src' here.
    const imagePayload = { ...body };

    if (!imagePayload.src) {
      if (imagePayload.imageUrl) imagePayload.src = imagePayload.imageUrl;
      else if (imagePayload.url) imagePayload.src = imagePayload.url;
      else if (imagePayload.link) imagePayload.src = imagePayload.link;
    }

    // Final Validation check before Database operation
    if (!imagePayload.src) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error: The 'src' (Image URL) field is missing.",
        },
        { status: 400 }
      );
    }

    const newImage = await GalleryImage.create(imagePayload);

    return NextResponse.json(
      { success: true, data: newImage },
      { status: 201 }
    );
  } catch (error: any) {
    // Debug: Log the specific error from Mongoose/MongoDB
    console.error("Gallery Creation Failed:", error);

    // Return the actual error message to the client so you can see it in the UI/Console
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create",
        details: error.errors, // Often contains validation specific details
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import GalleryImage from "@/models/GalleryImage";

export const dynamic = "force-dynamic";

// --- DELETE: Remove an image ---
export async function DELETE(
  request: Request,
  // In Next.js 15+, params is a Promise that must be awaited
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Await the params promise to extract the ID
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    const deletedImage = await GalleryImage.findByIdAndDelete(id);

    if (!deletedImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image deleted successfully",
        data: deletedImage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Gallery Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete image",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// --- PUT: Update image details ---
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    // We only allow updating specific fields to prevent overwriting metadata accidentally
    const updateData = {
      title: body.title,
      category: body.category,
      year: body.year,
      alt: body.alt,
    };

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated doc
    );

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Gallery Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update image",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

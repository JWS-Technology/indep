import UploadLinks from "@/models/UploadLinks";
import dbConnect from "@/utils/dbConnect";

export async function GET(
  req: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    await dbConnect();

    const { teamId } = await context.params;

    const link = await UploadLinks.findOne({ teamId });

    return Response.json(
      {
        success: true,
        drivelink: link?.drivelink || null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error fetching drive link:", err);
    return Response.json(
      {
        success: false,
        message: "failed to fetch link",
      },
      { status: 500 }
    );
  }
}

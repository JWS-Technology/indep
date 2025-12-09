import Team from "@/models/Team";
import dbConnect from "@/utils/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    const teams = await Team.find().sort({ name: 1 }); // optional sorting

    return Response.json({ success: true, teams }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return Response.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

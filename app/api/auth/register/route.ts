import connectDB from "@/app/api/db/connection";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, password, role, department } = await req.json();

  if (!name || !email || !password) {
    return Response.json(
      { success: false, error: "Missing fields" },
      { status: 400 }
    );
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return Response.json(
      { success: false, error: "User already exists" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    department,
  });

  return Response.json({ success: true, user }, { status: 201 });
}

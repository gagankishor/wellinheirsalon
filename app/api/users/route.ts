import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "super_admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const users = await User.find({})
      .select("email role staffId createdAt")
      .populate("staffId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

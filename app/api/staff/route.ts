import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Staff from "@/models/Staff";
import "@/models/Service"; // register Service so Staff.populate("services") works

export async function GET() {
  try {
    await connectDB();
    const staff = await Staff.find({ isActive: true })
      .populate("services", "name durationMinutes price")
      .sort({ name: 1 })
      .lean();
    return NextResponse.json(staff);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const staff = await Staff.create(body);
    return NextResponse.json(staff);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}

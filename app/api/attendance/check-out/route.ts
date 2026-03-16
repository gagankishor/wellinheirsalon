import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";

export async function POST() {
  try {
    const session = await auth();
    const staffId = session?.user?.staffId;
    if (!staffId || session?.user?.role !== "staff") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const date = startOfDay(new Date());
    const record = await Attendance.findOne({ staffId, date });
    if (!record) return NextResponse.json({ error: "No check-in found for today" }, { status: 400 });
    if (record.checkOut) return NextResponse.json({ error: "Already checked out today" }, { status: 400 });
    record.checkOut = new Date();
    await record.save();
    return NextResponse.json(record);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

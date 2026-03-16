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
    const existing = await Attendance.findOne({ staffId, date });
    if (existing) {
      if (existing.checkIn) return NextResponse.json({ error: "Already checked in today" }, { status: 400 });
      existing.checkIn = new Date();
      await existing.save();
      return NextResponse.json(existing);
    }
    const record = await Attendance.create({
      staffId,
      date,
      checkIn: new Date(),
      status: "present",
    });
    return NextResponse.json(record);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

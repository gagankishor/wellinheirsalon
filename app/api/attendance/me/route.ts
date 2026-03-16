import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const staffId = session?.user?.staffId;
    if (!staffId || session?.user?.role !== "staff") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const date = dateStr ? startOfDay(new Date(dateStr)) : startOfDay(new Date());
    const record = await Attendance.findOne({
      staffId,
      date,
    }).lean();
    return NextResponse.json(record || null);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

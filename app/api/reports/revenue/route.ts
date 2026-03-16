import { NextResponse } from "next/server";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import ServiceRecord from "@/models/ServiceRecord";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // day | month
    const dateStr = searchParams.get("date"); // YYYY-MM-DD for day, YYYY-MM for month

    let start: Date;
    let end: Date;
    const base = dateStr ? new Date(dateStr) : new Date();

    if (period === "day") {
      start = startOfDay(base);
      end = endOfDay(base);
    } else {
      start = startOfMonth(base);
      end = endOfMonth(base);
    }

    const completed = await Appointment.find({
      status: "completed",
      startTime: { $gte: start, $lte: end },
    })
      .populate("serviceId", "price")
      .lean();

    const records = await ServiceRecord.find({
      completedAt: { $gte: start, $lte: end },
    }).lean();

    const byAppointment = completed.reduce((sum, a) => sum + ((a.serviceId as { price?: number })?.price ?? 0), 0);
    const byRecord = records.reduce((sum, r) => sum + r.amount, 0);
    const revenue = byRecord > 0 ? byRecord : byAppointment;

    return NextResponse.json({
      start: start.toISOString(),
      end: end.toISOString(),
      period,
      revenue,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get revenue" }, { status: 500 });
  }
}

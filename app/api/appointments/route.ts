import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";

const activeStatuses = ["scheduled", "confirmed", "in_progress"];

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");
    const customerId = searchParams.get("customerId");
    const from = searchParams.get("from"); // ISO date
    const to = searchParams.get("to");
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (staffId) filter.staffId = staffId;
    if (customerId) filter.customerId = customerId;
    if (status) filter.status = status;
    if (from || to) {
      filter.startTime = {};
      if (from) (filter.startTime as Record<string, Date>).$gte = new Date(from);
      if (to) (filter.startTime as Record<string, Date>).$lte = new Date(to);
    }

    const appointments = await Appointment.find(filter)
      .populate("customerId", "name phone")
      .populate("staffId", "name")
      .populate("serviceId", "name durationMinutes price")
      .sort({ startTime: 1 })
      .lean();

    return NextResponse.json(appointments);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { startTime, endTime, staffId, recurrence } = body;
    const appointments: unknown[] = [];

    const createOne = (start: Date, end: Date) => ({
      ...body,
      startTime: start,
      endTime: end,
      staffId,
    });

    if (recurrence?.frequency && recurrence.frequency !== "none") {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const endDate = recurrence.endDate ? new Date(recurrence.endDate) : new Date(start);
      endDate.setMonth(endDate.getMonth() + 3); // default 3 months
      const interval = recurrence.interval ?? 1;
      let current = new Date(start);

      while (current <= endDate) {
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + (end.getTime() - start.getTime()) / 60000);
        appointments.push(createOne(new Date(current), slotEnd));
        switch (recurrence.frequency) {
          case "daily":
            current.setDate(current.getDate() + interval);
            break;
          case "weekly":
            current.setDate(current.getDate() + 7 * interval);
            break;
          case "biweekly":
            current.setDate(current.getDate() + 14 * interval);
            break;
          case "monthly":
            current.setMonth(current.getMonth() + interval);
            break;
          default:
            current.setDate(current.getDate() + 1);
        }
      }
    } else {
      appointments.push(createOne(new Date(startTime), new Date(endTime)));
    }

    const created = await Appointment.insertMany(appointments);
    return NextResponse.json(created);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create appointment(s)" }, { status: 500 });
  }
}

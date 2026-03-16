import { NextResponse } from "next/server";
import { addMinutes, setHours, setMinutes, startOfDay } from "date-fns";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import Staff from "@/models/Staff";

// Default salon hours 9–18
const DEFAULT_OPEN = 9;
const DEFAULT_CLOSE = 18;
const SLOT_MINUTES = 30;

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date"); // YYYY-MM-DD
    const staffId = searchParams.get("staffId");
    const durationMinutes = parseInt(searchParams.get("duration") || "60", 10);

    if (!dateStr) {
      return NextResponse.json({ error: "date required" }, { status: 400 });
    }

    const date = startOfDay(new Date(dateStr));
    const open = setMinutes(setHours(date, DEFAULT_OPEN), 0);
    const close = setMinutes(setHours(date, DEFAULT_CLOSE), 0);

    let staffIds: string[] = [];
    if (staffId) {
      staffIds = [staffId];
    } else {
      const staffList = await Staff.find({ isActive: true }).select("_id").lean();
      staffIds = staffList.map((s) => String(s._id));
    }

    const busy = await Appointment.find({
      staffId: { $in: staffIds },
      startTime: { $gte: open, $lt: close },
      status: { $in: ["scheduled", "confirmed", "in_progress"] },
    })
      .select("staffId startTime endTime")
      .lean();

    const slots: { time: string; staffId: string; available: boolean }[] = [];
    for (const sid of staffIds) {
      let slotStart = new Date(open);
      while (addMinutes(slotStart, durationMinutes) <= close) {
        const slotEnd = addMinutes(slotStart, durationMinutes);
        const overlaps = busy.some(
          (b) =>
            String(b.staffId) === sid &&
            slotStart < new Date(b.endTime) &&
            slotEnd > new Date(b.startTime)
        );
        slots.push({
          time: slotStart.toISOString(),
          staffId: sid,
          available: !overlaps,
        });
        slotStart = addMinutes(slotStart, SLOT_MINUTES);
      }
    }

    return NextResponse.json({ slots, open: open.toISOString(), close: close.toISOString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Availability check failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { format } from "date-fns";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import { sendAppointmentReminder } from "@/lib/whatsapp";

/**
 * POST /api/reminders/send
 * Body: { appointmentId?: string } or no body to send due reminders.
 * Sends WhatsApp reminder for an appointment (or all due ones if no id).
 */
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const appointmentId = body.appointmentId;

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId)
        .populate("customerId", "name phone")
        .populate("serviceId", "name")
        .lean();
      if (!appointment || ["cancelled", "completed"].includes(appointment.status)) {
        return NextResponse.json({ error: "Appointment not found or not eligible" }, { status: 400 });
      }
      const customer = appointment.customerId as { name: string; phone: string };
      const service = appointment.serviceId as { name: string };
      const sent = await sendAppointmentReminder(
        customer.phone,
        customer.name,
        service.name,
        format(new Date(appointment.startTime), "d MMM yyyy 'at' HH:mm")
      );
      if (sent) {
        await Appointment.findByIdAndUpdate(appointmentId, { reminderSent: true });
      }
      return NextResponse.json({ sent });
    }

    const from = new Date();
    const to = new Date();
    to.setHours(to.getHours() + 24);
    const due = await Appointment.find({
      startTime: { $gte: from, $lte: to },
      status: { $in: ["scheduled", "confirmed"] },
      reminderSent: { $ne: true },
    })
      .populate("customerId", "name phone")
      .populate("serviceId", "name")
      .lean();

    let sentCount = 0;
    for (const app of due) {
      const customer = app.customerId as { name: string; phone: string };
      const service = app.serviceId as { name: string };
      const ok = await sendAppointmentReminder(
        customer.phone,
        customer.name,
        service.name,
        format(new Date(app.startTime), "d MMM yyyy 'at' HH:mm")
      );
      if (ok) {
        await Appointment.findByIdAndUpdate(app._id, { reminderSent: true });
        sentCount++;
      }
    }
    return NextResponse.json({ sent: sentCount, total: due.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}

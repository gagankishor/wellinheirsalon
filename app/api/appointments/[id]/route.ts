import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import ServiceRecord from "@/models/ServiceRecord";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const appointment = await Appointment.findById(id)
      .populate("customerId", "name phone email")
      .populate("staffId", "name")
      .populate("serviceId", "name durationMinutes price")
      .lean();
    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(appointment);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    )
      .populate("customerId", "name phone")
      .populate("staffId", "name commissionPercent")
      .populate("serviceId", "name durationMinutes price")
      .lean();
    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.status === "completed") {
      const app = appointment as {
        customerId: { _id?: unknown } | unknown;
        staffId: { _id?: unknown; commissionPercent?: number } | unknown;
        serviceId: { _id?: unknown; price?: number } | unknown;
      };
      const customerId = typeof app.customerId === "object" && app.customerId && "_id" in app.customerId ? app.customerId._id : app.customerId;
      const staffId = typeof app.staffId === "object" && app.staffId && "_id" in app.staffId ? app.staffId._id : app.staffId;
      const serviceId = typeof app.serviceId === "object" && app.serviceId && "_id" in app.serviceId ? app.serviceId._id : app.serviceId;
      const amount = typeof app.serviceId === "object" && app.serviceId && "price" in app.serviceId ? Number(app.serviceId.price) : 0;
      const commissionPercent = typeof app.staffId === "object" && app.staffId && "commissionPercent" in app.staffId ? Number(app.staffId.commissionPercent) : 0;
      await ServiceRecord.create({
        customerId,
        staffId,
        serviceId,
        appointmentId: id,
        amount,
        commissionAmount: (amount * commissionPercent) / 100,
        completedAt: new Date(),
      });
    }
    return NextResponse.json(appointment);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status: "cancelled" } },
      { new: true }
    ).lean();
    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(appointment);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}

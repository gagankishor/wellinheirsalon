import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Staff from "@/models/Staff";
import "@/models/Service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const staff = await Staff.findById(id)
      .populate("services", "name durationMinutes price")
      .lean();
    if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(staff);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
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
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    )
      .populate("services", "name durationMinutes price")
      .lean();
    if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(staff);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).lean();
    if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(staff);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}

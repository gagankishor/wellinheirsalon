import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import ServiceRecord from "@/models/ServiceRecord";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "super_admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const staffId = searchParams.get("staffId");

    const filter: Record<string, unknown> = {};
    if (customerId) filter.customerId = customerId;
    if (staffId) filter.staffId = staffId;

    const records = await ServiceRecord.find(filter)
      .populate("customerId", "name phone")
      .populate("staffId", "name")
      .populate("serviceId", "name price")
      .sort({ completedAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json(records);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch service records" }, { status: 500 });
  }
}

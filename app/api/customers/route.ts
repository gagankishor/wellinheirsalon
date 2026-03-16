import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const filter = q ? { $or: [{ name: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }] } : {};
    const customers = await Customer.find(filter)
      .populate("preferredStaffId", "name")
      .sort({ name: 1 })
      .limit(100)
      .lean();
    return NextResponse.json(customers);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const customer = await Customer.create(body);
    return NextResponse.json(customer);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

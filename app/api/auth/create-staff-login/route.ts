import { NextResponse } from "next/server";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Staff from "@/models/Staff";

/**
 * Super admin only: create a login for a staff member.
 * POST /api/auth/create-staff-login { "staffId": "...", "password": "..." }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const { staffId, password } = await request.json();
    if (!staffId || !password || password.length < 6) {
      return NextResponse.json({ error: "staffId and password (min 6 chars) required" }, { status: 400 });
    }
    const staff = await Staff.findById(staffId).lean();
    if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    const email = (staff as { email: string }).email.toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "Login already exists for this staff email" }, { status: 400 });
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      passwordHash,
      role: "staff",
      staffId,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

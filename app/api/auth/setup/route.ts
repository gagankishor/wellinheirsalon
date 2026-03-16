import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/** GET: returns { needsSetup: true } if no users exist yet */
export async function GET() {
  try {
    await connectDB();
    const count = await User.countDocuments();
    return NextResponse.json({ needsSetup: count === 0 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ needsSetup: true });
  }
}

/**
 * One-time setup: create first super admin. Only works when there are zero users.
 * POST /api/auth/setup { "email": "...", "password": "..." }
 */
export async function POST(request: Request) {
  try {
    await connectDB();
    const count = await User.countDocuments();
    if (count > 0) {
      return NextResponse.json({ error: "Setup already done" }, { status: 400 });
    }
    const { email, password } = await request.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Email and password (min 6 chars) required" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash,
      role: "super_admin",
    });
    return NextResponse.json({ ok: true, id: user._id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}

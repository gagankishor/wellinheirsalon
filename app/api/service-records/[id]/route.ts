import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import ServiceRecord from "@/models/ServiceRecord";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "super_admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const { id } = await params;
    const record = await ServiceRecord.findByIdAndDelete(id);
    if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete service record" }, { status: 500 });
  }
}

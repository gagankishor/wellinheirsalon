import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { connectDB } from "@/lib/db";
import ServiceRecord from "@/models/ServiceRecord";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months") || "1", 10);
    const end = endOfMonth(new Date());
    const start = startOfMonth(subMonths(end, months - 1));

    const records = await ServiceRecord.aggregate([
      { $match: { completedAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$staffId", revenue: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      { $lookup: { from: "staff", localField: "_id", foreignField: "_id", as: "staff" } },
      { $unwind: "$staff" },
      { $project: { name: "$staff.name", revenue: 1, count: 1 } },
    ]);

    return NextResponse.json(records);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get top staff" }, { status: 500 });
  }
}

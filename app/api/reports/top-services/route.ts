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
      { $group: { _id: "$serviceId", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      { $lookup: { from: "services", localField: "_id", foreignField: "_id", as: "service" } },
      { $unwind: "$service" },
      { $project: { name: "$service.name", count: 1, revenue: 1 } },
    ]);

    return NextResponse.json(records);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get top services" }, { status: 500 });
  }
}

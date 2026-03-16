"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export default function ReportsPage() {
  const [period, setPeriod] = useState<"day" | "month">("month");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [revenue, setRevenue] = useState<{ revenue: number; start: string; end: string } | null>(null);
  const [topServices, setTopServices] = useState<{ name: string; count: number; revenue: number }[]>([]);
  const [topStaff, setTopStaff] = useState<{ name: string; revenue: number; count: number }[]>([]);

  useEffect(() => {
    const params = new URLSearchParams({ period, date: period === "month" ? date.slice(0, 7) : date });
    fetch(`/api/reports/revenue?${params}`)
      .then((r) => r.json())
      .then(setRevenue);
  }, [period, date]);

  useEffect(() => {
    fetch("/api/reports/top-services?months=1")
      .then((r) => r.json())
      .then((d) => setTopServices(Array.isArray(d) ? d : []));
    fetch("/api/reports/top-staff?months=1")
      .then((r) => r.json())
      .then((d) => setTopStaff(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-[var(--foreground)]">Reports & Analytics</h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Period</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "day" | "month")}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          >
            <option value="day">Daily</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Date</span>
          <input
            type={period === "month" ? "month" : "date"}
            value={period === "month" ? date.slice(0, 7) : date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="font-medium text-[var(--muted)]">Revenue</h2>
        <p className="mt-2 text-2xl font-semibold text-[var(--accent)]">
          ₹{revenue?.revenue ?? 0}
        </p>
        {revenue && (
          <p className="mt-1 text-xs text-[var(--muted)]">
            {format(new Date(revenue.start), "d MMM")} – {format(new Date(revenue.end), "d MMM yyyy")}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="font-medium">Top services (this month)</h2>
          {topServices.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">No data yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {topServices.map((s, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span>{s.count} · ₹{s.revenue}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="font-medium">Top staff (this month)</h2>
          {topStaff.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">No data yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {topStaff.map((s, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span>{s.count} · ₹{s.revenue}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

interface Appointment {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
  customerId: { name: string; phone?: string };
  serviceId: { name: string; durationMinutes: number; price: number };
}

export default function MyAppointmentsPage() {
  const { data: session } = useSession();
  const staffId = session?.user?.staffId;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!staffId) return;
    const from = new Date();
    from.setDate(from.getDate() - 1);
    const to = new Date();
    to.setDate(to.getDate() + 14);
    const params = new URLSearchParams({
      staffId,
      from: from.toISOString(),
      to: to.toISOString(),
    });
    fetch(`/api/appointments?${params}`)
      .then((r) => r.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [staffId]);

  const upcoming = appointments.filter(
    (a) => new Date(a.startTime) >= new Date() && !["cancelled"].includes(a.status)
  );
  const past = appointments.filter(
    (a) => new Date(a.startTime) < new Date() || ["cancelled", "completed"].includes(a.status)
  );

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--foreground)]">
        My Appointments
      </h1>
      <p className="mb-8 text-[var(--muted)]">
        Your schedule and recent appointments
      </p>

      {loading ? (
        <p className="text-[var(--muted)]">Loading…</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="mb-4 font-medium text-[var(--foreground)]">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No upcoming appointments.</p>
            ) : (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
                <ul className="divide-y divide-[var(--border)]">
                  {upcoming.map((a) => (
                    <li key={a._id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                      <div>
                        <p className="font-medium">{format(new Date(a.startTime), "EEE, d MMM · HH:mm")}</p>
                        <p className="text-sm text-[var(--muted)]">
                          {a.customerId?.name} – {a.serviceId?.name}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        a.status === "confirmed" ? "bg-green-100 text-green-800" :
                        a.status === "completed" ? "bg-[var(--card-hover)] text-[var(--muted)]" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {a.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 font-medium text-[var(--foreground)]">Recent / Past</h2>
            {past.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No past appointments.</p>
            ) : (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
                <ul className="divide-y divide-[var(--border)]">
                  {past.slice(0, 20).map((a) => (
                    <li key={a._id} className="flex flex-wrap items-center justify-between gap-4 p-4 opacity-80">
                      <div>
                        <p className="font-medium">{format(new Date(a.startTime), "EEE, d MMM · HH:mm")}</p>
                        <p className="text-sm text-[var(--muted)]">
                          {a.customerId?.name} – {a.serviceId?.name}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--muted)]">{a.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
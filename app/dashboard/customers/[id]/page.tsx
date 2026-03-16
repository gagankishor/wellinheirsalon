"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  anniversary?: string;
  preferredStaffId?: { _id: string; name: string };
  notes?: string;
}

interface ServiceRecord {
  _id: string;
  completedAt: string;
  amount: number;
  serviceId?: { name: string };
  staffId?: { name: string };
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [history, setHistory] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((c) => setCustomer(c._id ? c : null))
      .catch(() => setCustomer(null));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/appointments?customerId=${id}`)
      .then((r) => r.json())
      .then((apps: { _id: string; startTime: string; status: string; serviceId?: { name: string }; staffId?: { name: string } }[]) => {
        const completed = apps.filter((a) => a.status === "completed");
        setHistory(
          completed.map((a) => ({
            _id: a._id,
            completedAt: a.startTime,
            amount: (a.serviceId as { price?: number })?.price ?? 0,
            serviceId: a.serviceId,
            staffId: a.staffId,
          }))
        );
      });
  }, [id]);

  if (!customer) return <div className="p-8">Loading…</div>;

  return (
    <div className="p-8">
      <button type="button" onClick={() => router.back()} className="mb-4 text-sm text-[var(--accent)]">
        ← Back to customers
      </button>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{customer.name}</h1>
        <dl className="mt-4 grid gap-2 text-sm">
          <div><dt className="text-[var(--muted)]">Phone</dt><dd>{customer.phone}</dd></div>
          {customer.email && <div><dt className="text-[var(--muted)]">Email</dt><dd>{customer.email}</dd></div>}
          {customer.birthday && <div><dt className="text-[var(--muted)]">Birthday</dt><dd>{format(new Date(customer.birthday), "d MMM yyyy")}</dd></div>}
          {customer.anniversary && <div><dt className="text-[var(--muted)]">Anniversary</dt><dd>{format(new Date(customer.anniversary), "d MMM yyyy")}</dd></div>}
          {customer.preferredStaffId && <div><dt className="text-[var(--muted)]">Preferred stylist</dt><dd>{customer.preferredStaffId.name}</dd></div>}
          {customer.notes && <div><dt className="text-[var(--muted)]">Notes</dt><dd>{customer.notes}</dd></div>}
        </dl>
      </div>
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="font-medium">Service history</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">No completed visits yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {history.slice(0, 20).map((h) => (
              <li key={h._id} className="flex justify-between text-sm">
                <span>{format(new Date(h.completedAt), "d MMM yyyy")} – {(h.serviceId as { name?: string })?.name ?? "Service"}</span>
                <span>₹{h.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

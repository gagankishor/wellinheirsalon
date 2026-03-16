"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface ServiceRecord {
  _id: string;
  completedAt: string;
  amount: number;
  commissionAmount?: number;
  customerId?: { name: string; phone?: string };
  staffId?: { name: string };
  serviceId?: { name: string; price?: number };
}

export default function ServiceRecordsPage() {
  const { data: session } = useSession();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = () => {
    fetch("/api/service-records")
      .then((r) => r.json())
      .then((d) => setRecords(Array.isArray(d) ? d : []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecord = async (recordId: string) => {
    if (!confirm("Delete this service record? This cannot be undone.")) return;
    const res = await fetch(`/api/service-records/${recordId}`, { method: "DELETE" });
    if (res.ok) fetchRecords();
    else alert("Failed to delete.");
  };

  if (session?.user?.role !== "super_admin") {
    return (
      <div className="p-8">
        <p className="text-[var(--muted)]">Only super admin can view service records.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Service Records</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Completed service history. Deleting a record removes it from reports.
      </p>
      {loading ? (
        <p className="text-[var(--muted)]">Loading…</p>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card-hover)]">
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Staff</th>
                <th className="p-3 font-medium">Service</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-[var(--border)] hover:bg-[var(--card-hover)]">
                  <td className="p-3">{format(new Date(r.completedAt), "d MMM yyyy, HH:mm")}</td>
                  <td className="p-3">{r.customerId?.name ?? "—"} {r.customerId?.phone && `(${r.customerId.phone})`}</td>
                  <td className="p-3">{r.staffId?.name ?? "—"}</td>
                  <td className="p-3">{r.serviceId?.name ?? "—"}</td>
                  <td className="p-3">₹{r.amount}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => deleteRecord(r._id)}
                      className="rounded border border-red-500/50 p-1.5 text-red-500 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && (
            <p className="p-8 text-center text-[var(--muted)]">No service records yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

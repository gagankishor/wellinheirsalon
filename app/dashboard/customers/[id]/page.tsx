"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

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

interface StaffOption {
  _id: string;
  name: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [history, setHistory] = useState<ServiceRecord[]>([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "", birthday: "", anniversary: "", preferredStaffId: "", notes: "" });
  const [staffList, setStaffList] = useState<StaffOption[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((c) => setCustomer(c._id ? c : null))
      .catch(() => setCustomer(null));
  }, [id]);

  useEffect(() => {
    fetch("/api/staff").then((r) => r.json()).then((d) => setStaffList(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    if (customer && editing) {
      setEditForm({
        name: customer.name,
        phone: customer.phone,
        email: customer.email ?? "",
        birthday: customer.birthday ? format(new Date(customer.birthday), "yyyy-MM-dd") : "",
        anniversary: customer.anniversary ? format(new Date(customer.anniversary), "yyyy-MM-dd") : "",
        preferredStaffId: (customer.preferredStaffId as { _id?: string })?._id ?? "",
        notes: customer.notes ?? "",
      });
    }
  }, [customer, editing]);

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

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    const res = await fetch(`/api/customers/${customer._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email || undefined,
        birthday: editForm.birthday ? new Date(editForm.birthday).toISOString() : undefined,
        anniversary: editForm.anniversary ? new Date(editForm.anniversary).toISOString() : undefined,
        preferredStaffId: editForm.preferredStaffId || undefined,
        notes: editForm.notes || undefined,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCustomer(updated);
      setEditing(false);
    }
  };

  const deleteCustomer = async () => {
    if (!customer || !confirm(`Delete "${customer.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/customers/${customer._id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard/customers");
    else alert("Failed to delete.");
  };

  if (!customer) return <div className="p-8">Loading…</div>;

  return (
    <div className="p-8">
      <button type="button" onClick={() => router.back()} className="mb-4 text-sm text-[var(--accent)]">
        ← Back to customers
      </button>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          <div className="flex gap-2">
            {!editing ? (
              <>
                <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--card-hover)]">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button type="button" onClick={deleteCustomer} className="inline-flex items-center gap-1 rounded-lg border border-red-500/50 px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Cancel</button>
            )}
          </div>
        </div>
        {editing ? (
          <form onSubmit={saveEdit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <input type="text" placeholder="Name" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" required />
            <input type="tel" placeholder="Phone" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" required />
            <input type="email" placeholder="Email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
            <input type="date" placeholder="Birthday" value={editForm.birthday} onChange={(e) => setEditForm((f) => ({ ...f, birthday: e.target.value }))} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
            <input type="date" placeholder="Anniversary" value={editForm.anniversary} onChange={(e) => setEditForm((f) => ({ ...f, anniversary: e.target.value }))} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
            <select value={editForm.preferredStaffId} onChange={(e) => setEditForm((f) => ({ ...f, preferredStaffId: e.target.value }))} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2">
              <option value="">No preferred stylist</option>
              {staffList.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            <div className="sm:col-span-2">
              <textarea placeholder="Notes" value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" rows={2} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm text-white">Save</button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 grid gap-2 text-sm">
            <div><dt className="text-[var(--muted)]">Phone</dt><dd>{customer.phone}</dd></div>
            {customer.email && <div><dt className="text-[var(--muted)]">Email</dt><dd>{customer.email}</dd></div>}
            {customer.birthday && <div><dt className="text-[var(--muted)]">Birthday</dt><dd>{format(new Date(customer.birthday), "d MMM yyyy")}</dd></div>}
            {customer.anniversary && <div><dt className="text-[var(--muted)]">Anniversary</dt><dd>{format(new Date(customer.anniversary), "d MMM yyyy")}</dd></div>}
            {customer.preferredStaffId && <div><dt className="text-[var(--muted)]">Preferred stylist</dt><dd>{customer.preferredStaffId.name}</dd></div>}
            {customer.notes && <div><dt className="text-[var(--muted)]">Notes</dt><dd>{customer.notes}</dd></div>}
          </dl>
        )}
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

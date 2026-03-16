"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  commissionPercent: number;
  baseSalary?: number;
  isActive: boolean;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Stylist", commissionPercent: 0, baseSalary: "" });

  const fetchStaff = () => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((d) => setStaff(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const addStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        baseSalary: form.baseSalary ? Number(form.baseSalary) : undefined,
      }),
    });
    setForm({ name: "", email: "", phone: "", role: "Stylist", commissionPercent: 0, baseSalary: "" });
    setShowAdd(false);
    fetchStaff();
  };

  const deleteStaff = async (staffId: string, name: string) => {
    if (!confirm(`Deactivate "${name}"? They will be removed from the list.`)) return;
    const res = await fetch(`/api/staff/${staffId}`, { method: "DELETE" });
    if (res.ok) fetchStaff();
    else alert("Failed to delete.");
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Staff</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" /> Add staff
        </button>
      </div>
      {showAdd && (
        <form onSubmit={addStaff} className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="mb-4 font-medium">New staff</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-lg border px-3 py-2" required />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="rounded-lg border px-3 py-2" required />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="rounded-lg border px-3 py-2" required />
            <input type="text" placeholder="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="rounded-lg border px-3 py-2" />
            <input type="number" placeholder="Commission %" value={form.commissionPercent || ""} onChange={(e) => setForm((f) => ({ ...f, commissionPercent: Number(e.target.value) }))} className="rounded-lg border px-3 py-2" />
            <input type="number" placeholder="Base salary" value={form.baseSalary} onChange={(e) => setForm((f) => ({ ...f, baseSalary: e.target.value }))} className="rounded-lg border px-3 py-2" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white">Save</button>
            <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border px-4 py-2">Cancel</button>
          </div>
        </form>
      )}
      {loading ? (
        <p className="text-[var(--muted)]">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <div
              key={s._id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent)]/30"
            >
              <Link href={`/dashboard/staff/${s._id}`} className="block">
                <h2 className="font-medium">{s.name}</h2>
                <p className="text-sm text-[var(--muted)]">{s.role}</p>
                <p className="mt-2 text-sm">Commission: {s.commissionPercent}%</p>
                {s.baseSalary != null && <p className="text-sm">Base: ₹{s.baseSalary}</p>}
              </Link>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/dashboard/staff/${s._id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--card-hover)]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deleteStaff(s._id, s.name)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-500/50 px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

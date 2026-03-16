"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Service {
  _id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  category?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Service> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchServices = () => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.name || form.durationMinutes == null || form.price == null) return;
    if (editingId) {
      await fetch(`/api/services/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          durationMinutes: Number(form.durationMinutes),
          price: Number(form.price),
          category: form.category,
        }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          durationMinutes: Number(form.durationMinutes),
          price: Number(form.price),
          category: form.category,
        }),
      });
    }
    setForm(null);
    fetchServices();
  };

  const startEdit = (s: Service) => {
    setForm({
      _id: s._id,
      name: s.name,
      description: s.description,
      durationMinutes: s.durationMinutes,
      price: s.price,
      category: s.category,
    });
    setEditingId(s._id);
  };

  const deleteService = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"? It will be removed from the list.`)) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) fetchServices();
    else alert("Failed to delete.");
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Services</h1>
        <button
          type="button"
          onClick={() => setForm({ name: "", durationMinutes: 60, price: 0 })}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          Add service
        </button>
      </div>
      {form && (
        <form onSubmit={submit} className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="mb-4 font-medium">{editingId ? "Edit service" : "New service"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Name"
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg border border-[var(--border)] px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Duration (min)"
              value={form.durationMinutes ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))}
              className="rounded-lg border border-[var(--border)] px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              className="rounded-lg border border-[var(--border)] px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Category (optional)"
              value={form.category ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm text-white">
              Save
            </button>
            <button type="button" onClick={() => { setForm(null); setEditingId(null); }} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <p className="text-[var(--muted)]">Loading…</p>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card-hover)]">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Duration</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-b border-[var(--border)] hover:bg-[var(--card-hover)]">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.durationMinutes} min</td>
                  <td className="p-3">₹{s.price}</td>
                  <td className="p-3 text-[var(--muted)]">{s.category || "—"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(s)} className="rounded border border-[var(--border)] p-1.5 text-[var(--muted)] hover:text-[var(--foreground)]" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => deleteService(s._id, s.name)} className="rounded border border-red-500/50 p-1.5 text-red-500 hover:bg-red-500/10" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  anniversary?: string;
  preferredStaffId?: { name: string };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const fetchCustomers = () => {
    const params = search ? `?q=${encodeURIComponent(search)}` : "";
    fetch(`/api/customers${params}`)
      .then((r) => r.json())
      .then((d) => setCustomers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, phone: newPhone, email: newEmail || undefined }),
    });
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setShowAdd(false);
    fetchCustomers();
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Customers</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" /> Add customer
        </button>
      </div>
      {showAdd && (
        <form onSubmit={addCustomer} className="mb-6 flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-lg border px-3 py-2" required />
          <input type="tel" placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="rounded-lg border px-3 py-2" required />
          <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="rounded-lg border px-3 py-2" />
          <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white">Save</button>
          <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border px-4 py-2">Cancel</button>
        </form>
      )}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] py-2 pl-9 pr-3"
          />
        </div>
      </div>
      {loading ? (
        <p className="text-[var(--muted)]">Loading…</p>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card-hover)]">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Birthday</th>
                <th className="p-3 font-medium">Preferred stylist</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-[var(--border)] hover:bg-[var(--card-hover)]">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3 text-[var(--muted)]">{c.email || "—"}</td>
                  <td className="p-3 text-[var(--muted)]">
                    {c.birthday ? format(new Date(c.birthday), "d MMM") : "—"}
                  </td>
                  <td className="p-3">{c.preferredStaffId?.name ?? "—"}</td>
                  <td className="p-3">
                    <Link href={`/dashboard/customers/${c._id}`} className="text-[var(--accent)] hover:underline">
                      View
                    </Link>
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

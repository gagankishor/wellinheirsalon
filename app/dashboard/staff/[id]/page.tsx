"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, startOfMonth, endOfMonth } from "date-fns";

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  commissionPercent: number;
  baseSalary?: number;
}

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [revenue, setRevenue] = useState(0);
  const [showCreateLogin, setShowCreateLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginCreated, setLoginCreated] = useState(false);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((list) => {
        const s = Array.isArray(list) ? list.find((x: StaffMember) => x._id === id) : null;
        setStaff(s ?? null);
      });
  }, [id]);

  useEffect(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    fetch(`/api/appointments?staffId=${id}&from=${start.toISOString()}&to=${end.toISOString()}&status=completed`)
      .then((r) => r.json())
      .then((apps: { serviceId?: { price?: number } }[]) => {
        const total = apps.reduce((sum, a) => sum + ((a.serviceId as { price?: number })?.price ?? 0), 0);
        setRevenue(total);
      });
  }, [id]);

  if (!staff) return <div className="p-8">Loading…</div>;

  const commission = (revenue * staff.commissionPercent) / 100;
  const salary = (staff.baseSalary ?? 0) + commission;

  return (
    <div className="p-8">
      <button type="button" onClick={() => router.back()} className="mb-4 text-sm text-[var(--accent)]">
        ← Back to staff
      </button>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{staff.name}</h1>
        <dl className="mt-4 grid gap-2 text-sm">
          <div><dt className="text-[var(--muted)]">Role</dt><dd>{staff.role}</dd></div>
          <div><dt className="text-[var(--muted)]">Email</dt><dd>{staff.email}</dd></div>
          <div><dt className="text-[var(--muted)]">Phone</dt><dd>{staff.phone}</dd></div>
          <div><dt className="text-[var(--muted)]">Commission</dt><dd>{staff.commissionPercent}%</dd></div>
          {staff.baseSalary != null && <div><dt className="text-[var(--muted)]">Base salary</dt><dd>₹{staff.baseSalary}</dd></div>}
        </dl>
        <div className="mt-6 border-t border-[var(--border)] pt-4">
          <h2 className="font-medium">This month</h2>
          <p className="text-sm text-[var(--muted)]">Revenue (completed): ₹{revenue}</p>
          <p className="text-sm text-[var(--muted)]">Commission: ₹{commission.toFixed(0)}</p>
          <p className="font-medium">Total salary: ₹{salary.toFixed(0)}</p>
        </div>

        {session?.user?.role === "super_admin" && (
          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <h2 className="font-medium">Staff login</h2>
            <p className="text-sm text-[var(--muted)]">Let this staff sign in to check in/out and see their appointments.</p>
            {loginCreated ? (
              <p className="mt-2 text-sm text-green-600">Login created. Staff can sign in with email: {staff.email}</p>
            ) : (
              <>
                {!showCreateLogin ? (
                  <button type="button" onClick={() => setShowCreateLogin(true)} className="mt-2 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm text-white">
                    Create login
                  </button>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setLoginError("");
                      const res = await fetch("/api/auth/create-staff-login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ staffId: id, password: loginPassword }),
                      });
                      const data = await res.json();
                      if (res.ok) setLoginCreated(true);
                      else setLoginError(data.error || "Failed");
                    }}
                    className="mt-2 flex flex-wrap items-end gap-2"
                  >
                    <div>
                      <label className="block text-xs text-[var(--muted)]">Password (min 6)</label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="rounded border px-2 py-1 text-sm"
                        minLength={6}
                        required
                      />
                    </div>
                    <button type="submit" className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm text-white">Create</button>
                    <button type="button" onClick={() => { setShowCreateLogin(false); setLoginError(""); }} className="text-sm text-[var(--muted)]">Cancel</button>
                    {loginError && <p className="w-full text-sm text-red-600">{loginError}</p>}
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

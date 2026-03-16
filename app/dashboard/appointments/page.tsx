"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";
import CalendarView from "@/components/calendar/CalendarView";

type ViewMode = "day" | "week" | "month";

interface Appointment {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
  customerId: { name: string; phone?: string };
  staffId: { _id?: string; name: string };
  serviceId: { name: string; durationMinutes: number; price: number };
  isWalkIn?: boolean;
}

interface Staff {
  _id: string;
  name: string;
}

export default function AppointmentsPage() {
  const [view, setView] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffFilter, setStaffFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"none" | "walkin" | "detail">("none");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const from = (() => {
    const d = new Date(currentDate);
    if (view === "day") return format(d, "yyyy-MM-dd");
    if (view === "week") {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      return format(start, "yyyy-MM-dd");
    }
    d.setDate(1);
    return format(d, "yyyy-MM-dd");
  })();
  const to = (() => {
    const d = new Date(currentDate);
    if (view === "day") return format(d, "yyyy-MM-dd");
    if (view === "week") {
      const end = new Date(d);
      end.setDate(d.getDate() + (6 - d.getDay()));
      return format(end, "yyyy-MM-dd");
    }
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return format(last, "yyyy-MM-dd");
  })();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ from: from + "T00:00:00", to: to + "T23:59:59" });
      if (staffFilter) params.set("staffId", staffFilter);
      const res = await fetch(`/api/appointments?${params}`);
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [from, to, staffFilter]);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => setStaff(Array.isArray(data) ? data : []))
      .catch(() => setStaff([]));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const goPrev = () => {
    if (view === "day") setCurrentDate((d) => subDays(d, 1));
    if (view === "week") setCurrentDate((d) => subWeeks(d, 1));
    if (view === "month") setCurrentDate((d) => subMonths(d, 1));
  };

  const goNext = () => {
    if (view === "day") setCurrentDate((d) => addDays(d, 1));
    if (view === "week") setCurrentDate((d) => addWeeks(d, 1));
    if (view === "month") setCurrentDate((d) => addMonths(d, 1));
  };

  const handleSelectAppointment = (id: string) => {
    setSelectedId(id);
    setModal("detail");
  };

  const handleSelectSlot = (date: Date) => {
    setSelectedSlot(date);
    setModal("walkin");
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Appointments</h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={staffFilter ?? ""}
            onChange={(e) => setStaffFilter(e.target.value || null)}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]"
          >
            <option value="">All staff</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-0.5">
            {(["day", "week", "month"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
                  view === v ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--card-hover)]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <a
            href="/dashboard/booking"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Online booking
          </a>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center text-[var(--muted)]">
          Loading…
        </div>
      ) : (
        <CalendarView
          view={view}
          currentDate={currentDate}
          appointments={appointments}
          staffFilter={staffFilter}
          onPrev={goPrev}
          onNext={goNext}
          onSelectSlot={view === "day" ? handleSelectSlot : undefined}
          onSelectAppointment={handleSelectAppointment}
        />
      )}

      {modal === "walkin" && selectedSlot && (
        <WalkInModal
          slotStart={selectedSlot}
          onClose={() => { setModal("none"); setSelectedSlot(null); }}
          onSaved={() => { fetchAppointments(); setModal("none"); setSelectedSlot(null); }}
        />
      )}

      {modal === "detail" && selectedId && (
        <AppointmentDetailModal
          id={selectedId}
          staff={staff}
          onClose={() => { setModal("none"); setSelectedId(null); }}
          onUpdated={() => { fetchAppointments(); setModal("none"); setSelectedId(null); }}
        />
      )}
    </div>
  );
}

function WalkInModal({
  slotStart,
  onClose,
  onSaved,
}: {
  slotStart: Date;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [customers, setCustomers] = useState<{ _id: string; name: string; phone: string }[]>([]);
  const [staff, setStaff] = useState<{ _id: string; name: string }[]>([]);
  const [services, setServices] = useState<{ _id: string; name: string; durationMinutes: number }[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/customers").then((r) => r.json()),
      fetch("/api/staff").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json()),
    ]).then(([c, s, sv]) => {
      setCustomers(Array.isArray(c) ? c : []);
      setStaff(Array.isArray(s) ? s : []);
      setServices(Array.isArray(sv) ? sv : []);
      if (Array.isArray(s) && s[0]) setStaffId(s[0]._id);
      if (Array.isArray(sv) && sv[0]) setServiceId(sv[0]._id);
    });
  }, []);

  const duration = services.find((s) => s._id === serviceId)?.durationMinutes ?? 60;
  const endTime = new Date(slotStart);
  endTime.setMinutes(endTime.getMinutes() + duration);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !staffId || !serviceId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          staffId,
          serviceId,
          startTime: slotStart.toISOString(),
          endTime: endTime.toISOString(),
          status: "confirmed",
          isWalkIn: true,
          recurrence: { frequency: "none" },
        }),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-[var(--card)] p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Walk-in appointment</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          {format(slotStart, "HH:mm, d MMM yyyy")}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
              required
            >
              <option value="">Select</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} – {c.phone}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Staff</label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
              required
            >
              {staff.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
              required
            >
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.durationMinutes} min)</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[var(--border)] py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[var(--accent)] py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppointmentDetailModal({
  id,
  staff: staffList,
  onClose,
  onUpdated,
}: {
  id: string;
  staff: Staff[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [app, setApp] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [customers, setCustomers] = useState<{ _id: string; name: string; phone: string }[]>([]);
  const [services, setServices] = useState<{ _id: string; name: string; durationMinutes: number; price: number }[]>([]);
  const [editForm, setEditForm] = useState({ customerId: "", staffId: "", serviceId: "", startTime: "", endTime: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/appointments/${id}`)
      .then((r) => r.json())
      .then(setApp)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (editing) {
      fetch("/api/customers").then((r) => r.json()).then((d) => setCustomers(Array.isArray(d) ? d : []));
      fetch("/api/services").then((r) => r.json()).then((d) => setServices(Array.isArray(d) ? d : []));
    }
  }, [editing]);

  useEffect(() => {
    if (app && editing) {
      const staffId = (app.staffId as { _id?: string })?._id ?? (app.staffId as unknown as string);
      const customerId = (app.customerId as { _id?: string })?._id ?? (app.customerId as unknown as string);
      const serviceId = (app.serviceId as { _id?: string })?._id ?? (app.serviceId as unknown as string);
      setEditForm({
        customerId: typeof customerId === "string" ? customerId : "",
        staffId: typeof staffId === "string" ? staffId : "",
        serviceId: typeof serviceId === "string" ? serviceId : "",
        startTime: app.startTime ? format(new Date(app.startTime), "yyyy-MM-dd'T'HH:mm") : "",
        endTime: app.endTime ? format(new Date(app.endTime), "yyyy-MM-dd'T'HH:mm") : "",
      });
    }
  }, [app, editing]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setApp(data);
      if (status === "cancelled") onUpdated();
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: editForm.customerId,
        staffId: editForm.staffId,
        serviceId: editForm.serviceId,
        startTime: new Date(editForm.startTime).toISOString(),
        endTime: new Date(editForm.endTime).toISOString(),
      }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setApp(data);
      setEditing(false);
      onUpdated();
    }
  };

  if (loading || !app) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="rounded-xl bg-[var(--card)] p-8">Loading…</div>
      </div>
    );
  }

  const customer = app.customerId as { name: string; phone?: string };
  const staff = app.staffId as { name: string };
  const service = app.serviceId as { name: string; durationMinutes: number; price: number };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-[var(--card)] p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Appointment</h2>
        {editing ? (
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Customer</label>
              <select value={editForm.customerId} onChange={(e) => setEditForm((f) => ({ ...f, customerId: e.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" required>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} – {c.phone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Staff</label>
              <select value={editForm.staffId} onChange={(e) => setEditForm((f) => ({ ...f, staffId: e.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" required>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Service</label>
              <select value={editForm.serviceId} onChange={(e) => setEditForm((f) => ({ ...f, serviceId: e.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" required>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.durationMinutes} min)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Start</label>
              <input type="datetime-local" value={editForm.startTime} onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End</label>
              <input type="datetime-local" value={editForm.endTime} onChange={(e) => setEditForm((f) => ({ ...f, endTime: e.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" required />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm text-white disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Time:</span> {format(new Date(app.startTime), "HH:mm, d MMM yyyy")}</p>
              <p><span className="text-[var(--muted)]">Customer:</span> {customer?.name} {customer?.phone && `(${customer.phone})`}</p>
              <p><span className="text-[var(--muted)]">Staff:</span> {staff?.name}</p>
              <p><span className="text-[var(--muted)]">Service:</span> {service?.name} – ₹{service?.price}</p>
              <p><span className="text-[var(--muted)]">Status:</span> {app.status}</p>
              {app.isWalkIn && <p className="text-amber-600">Walk-in</p>}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {!["cancelled", "completed"].includes(app.status) && (
                <>
                  <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">
                    Edit
                  </button>
                  <button type="button" onClick={() => updateStatus("confirmed")} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Confirm</button>
                  <button type="button" onClick={() => updateStatus("completed")} className="rounded-lg border border-green-600 text-green-600 px-3 py-1.5 text-sm">Mark completed</button>
                  <button type="button" onClick={() => updateStatus("cancelled")} className="rounded-lg border border-red-500 text-red-500 px-3 py-1.5 text-sm">Cancel appointment</button>
                </>
              )}
              <button type="button" onClick={onClose} className="ml-auto rounded-lg bg-[var(--border)] px-3 py-1.5 text-sm text-[var(--foreground)]">Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

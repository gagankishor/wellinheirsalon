"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";

interface Service {
  _id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

interface Staff {
  _id: string;
  name: string;
}

export default function PublicBookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [step, setStep] = useState<"service" | "staff" | "date" | "time" | "details">("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<{ time: string; staffId: string; available: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(Array.isArray(d) ? d : []));
    fetch("/api/staff").then((r) => r.json()).then((d) => setStaff(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    if (step !== "date" || !selectedService || !selectedStaff) return;
    const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
    setSelectedDate(dates[0]);
  }, [step, selectedService, selectedStaff]);

  useEffect(() => {
    if (step !== "time" || !selectedDate || !selectedService) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const params = new URLSearchParams({
      date: dateStr,
      duration: String(selectedService.durationMinutes),
    });
    if (selectedStaff) params.set("staffId", selectedStaff._id);
    setLoading(true);
    fetch(`/api/appointments/availability?${params}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots?.filter((s: { available: boolean }) => s.available) ?? []))
      .finally(() => setLoading(false));
  }, [step, selectedDate, selectedService, selectedStaff]);

  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const createCustomerAndBook = async () => {
    if (!selectedService || !selectedStaff || !selectedSlot) return;
    setLoading(true);
    try {
      const customerRes = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      const customer = await customerRes.json();
      if (!customer._id) throw new Error("Failed to create customer");

      const start = new Date(selectedSlot);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + selectedService.durationMinutes);

      const appRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer._id,
          staffId: selectedStaff._id,
          serviceId: selectedService._id,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          status: "scheduled",
          isWalkIn: false,
          recurrence: { frequency: "none" },
        }),
      });
      if (appRes.ok) setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[var(--accent)]">Booking confirmed</h1>
          <p className="mt-2 text-[var(--muted)]">
            We’ll send you a reminder before your appointment.
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Book another
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] py-12 px-4">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-semibold text-center text-[var(--foreground)] mb-2">
          Book online
        </h1>
        <p className="text-center text-[var(--muted)] mb-8">Wellins Hair Salon</p>

        {step === "service" && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="mb-4 font-medium">Choose a service</h2>
            <div className="space-y-2">
              {services.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => { setSelectedService(s); setStep("staff"); }}
                  className="w-full rounded-lg border border-[var(--border)] p-3 text-left hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-2 text-[var(--muted)]">{s.durationMinutes} min</span>
                  <span className="float-right font-medium">₹{s.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "staff" && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <button type="button" onClick={() => setStep("service")} className="text-sm text-[var(--accent)] mb-4">← Back</button>
            <h2 className="mb-4 font-medium">Choose your stylist</h2>
            <div className="space-y-2">
              {staff.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => { setSelectedStaff(s); setStep("date"); }}
                  className="w-full rounded-lg border border-[var(--border)] p-3 text-left hover:border-[var(--accent)]"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "date" && selectedDate && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <button type="button" onClick={() => setStep("staff")} className="text-sm text-[var(--accent)] mb-4">← Back</button>
            <h2 className="mb-4 font-medium">Select date</h2>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((d) => (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`rounded-lg py-2 text-sm ${
                    format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--border)] hover:bg-[var(--card-hover)]"
                  }`}
                >
                  {format(d, "d")}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">{format(selectedDate, "MMMM yyyy")}</p>
            <button
              type="button"
              onClick={() => setStep("time")}
              className="mt-4 w-full rounded-lg bg-[var(--accent)] py-2 text-white font-medium"
            >
              Next: choose time
            </button>
          </div>
        )}

        {step === "time" && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <button type="button" onClick={() => setStep("date")} className="text-sm text-[var(--accent)] mb-4">← Back</button>
            <h2 className="mb-4 font-medium">Available times</h2>
            {loading ? (
              <p className="text-[var(--muted)]">Loading…</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots
                  .filter((s) => !selectedStaff || s.staffId === selectedStaff._id)
                  .slice(0, 24)
                  .map((s) => (
                    <button
                      key={s.time + s.staffId}
                      type="button"
                      onClick={() => { setSelectedSlot(s.time); setStep("details"); }}
                      className="rounded-lg border border-[var(--border)] py-2 text-sm hover:border-[var(--accent)]"
                    >
                      {format(new Date(s.time), "HH:mm")}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {step === "details" && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <button type="button" onClick={() => setStep("time")} className="text-sm text-[var(--accent)] mb-4">← Back</button>
            <h2 className="mb-4 font-medium">Your details</h2>
            <p className="text-sm text-[var(--muted)] mb-4">
              {selectedService?.name} with {selectedStaff?.name} at {selectedSlot && format(new Date(selectedSlot), "HH:mm, d MMM")}
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); createCustomerAndBook(); }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[var(--accent)] py-3 font-medium text-white disabled:opacity-50"
              >
                {loading ? "Booking…" : "Confirm booking"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

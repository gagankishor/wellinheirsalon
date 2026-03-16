"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface Service {
  _id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted)]">
        Loading services…
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted)]">
        No services listed yet. Check back soon or{" "}
        <Link href="/contact" className="text-[var(--accent)] hover:underline">
          get in touch
        </Link>{" "}
        to ask what we offer.
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {services.map((s) => (
        <div
          key={s._id}
          className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">{s.name}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {s.durationMinutes} min
              {s.description ? ` · ${s.description}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-[var(--foreground)]">₹{s.price}</span>
            <Link
              href={`/booking`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <Calendar className="h-4 w-4" />
              Book
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

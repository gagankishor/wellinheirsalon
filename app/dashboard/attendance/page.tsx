"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock, LogIn, LogOut } from "lucide-react";

export default function AttendancePage() {
  const [record, setRecord] = useState<{
    checkIn?: string;
    checkOut?: string;
    date: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchToday = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    fetch(`/api/attendance/me?date=${today}`)
      .then((r) => r.json())
      .then((data) => setRecord(data?.date ? data : null))
      .catch(() => setRecord(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const checkIn = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/attendance/check-in", { method: "POST" });
      const data = await res.json();
      if (res.ok) fetchToday();
      else alert(data.error || "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const checkOut = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/attendance/check-out", { method: "POST" });
      const data = await res.json();
      if (res.ok) fetchToday();
      else alert(data.error || "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-[var(--muted)]">Loading…</p>
      </div>
    );
  }

  const hasCheckedIn = record?.checkIn;
  const hasCheckedOut = record?.checkOut;

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--foreground)]">
        Check In / Out
      </h1>
      <p className="mb-8 text-[var(--muted)]">
        {format(new Date(), "EEEE, d MMMM yyyy")}
      </p>

      <div className="max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex items-center gap-3 text-[var(--muted)] mb-6">
          <Clock className="h-8 w-8 text-[var(--accent)]" />
          <div>
            {hasCheckedIn ? (
              <>
                <p className="font-medium text-[var(--foreground)]">Checked in</p>
                <p className="text-sm">{format(new Date(record.checkIn!), "HH:mm")}</p>
              </>
            ) : (
              <p className="font-medium">Not checked in yet</p>
            )}
            {hasCheckedOut && (
              <>
                <p className="mt-2 font-medium text-[var(--foreground)]">Checked out</p>
                <p className="text-sm">{format(new Date(record.checkOut!), "HH:mm")}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {!hasCheckedIn && (
            <button
              type="button"
              onClick={checkIn}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              <LogIn className="h-5 w-5" />
              Check In
            </button>
          )}
          {hasCheckedIn && !hasCheckedOut && (
            <button
              type="button"
              onClick={checkOut}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              <LogOut className="h-5 w-5" />
              Check Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

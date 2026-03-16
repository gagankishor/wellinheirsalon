"use client";

import React, { useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addWeeks,
  addMonths,
  addDays,
  isSameDay,
  isSameMonth,
  setHours,
  setMinutes,
} from "date-fns";

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

interface CalendarViewProps {
  view: ViewMode;
  currentDate: Date;
  appointments: Appointment[];
  staffFilter: string | null;
  onPrev: () => void;
  onNext: () => void;
  onSelectSlot?: (date: Date, staffId?: string) => void;
  onSelectAppointment?: (id: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8–19

export default function CalendarView({
  view,
  currentDate,
  appointments,
  staffFilter,
  onPrev,
  onNext,
  onSelectSlot,
  onSelectAppointment,
}: CalendarViewProps) {
  const filtered = useMemo(() => {
    if (!staffFilter) return appointments;
    return appointments.filter((a) => String(a.staffId?._id ?? a.staffId) === staffFilter);
  }, [appointments, staffFilter]);

  const dayStart = useMemo(() => setMinutes(setHours(currentDate, 8), 0), [currentDate]);

  if (view === "month") {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card-hover)]"
          >
            ←
          </button>
          <h2 className="font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card-hover)]"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-medium text-[var(--muted)]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="border-b border-[var(--border)] py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-6">
          {days.map((day) => {
            const dayApps = filtered.filter(
              (a) => isSameDay(new Date(a.startTime), day) && !["cancelled"].includes(a.status)
            );
            const isCurrentMonth = isSameMonth(day, currentDate);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 border-b border-r border-[var(--border)] p-1 ${
                  !isCurrentMonth ? "bg-[var(--card-hover)]" : ""
                }`}
              >
                <span className={`text-sm ${!isCurrentMonth ? "text-[var(--muted)]" : ""}`}>
                  {format(day, "d")}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayApps.slice(0, 3).map((a) => (
                    <button
                      key={a._id}
                      type="button"
                      onClick={() => onSelectAppointment?.(a._id)}
                      className="block w-full truncate rounded bg-[var(--accent-light)] px-1 py-0.5 text-left text-xs text-[var(--accent)] hover:bg-amber-200"
                    >
                      {format(new Date(a.startTime), "HH:mm")} {a.customerId?.name}
                    </button>
                  ))}
                  {dayApps.length > 3 && (
                    <span className="text-xs text-[var(--muted)]">+{dayApps.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "week") {
    const weekStart = startOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(currentDate) });

    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 min-w-[800px]">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card-hover)]"
          >
            ←
          </button>
          <h2 className="font-semibold">
            {format(weekStart, "d MMM")} – {format(weekDays[weekDays.length - 1], "d MMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card-hover)]"
          >
            →
          </button>
        </div>
        <div className="grid min-w-[800px]" style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}>
          <div className="border-b border-r border-[var(--border)] p-2" />
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="border-b border-r border-[var(--border)] p-2 text-center text-sm font-medium">
              {format(day, "EEE d")}
            </div>
          ))}
          {HOURS.map((h) => (
            <React.Fragment key={h}>
              <div className="border-b border-r border-[var(--border)] p-1 text-xs text-[var(--muted)]">
                {h}:00
              </div>
              {weekDays.map((day) => {
                const dayApps = filtered.filter((a) => {
                  const start = new Date(a.startTime);
                  return isSameDay(start, day) && start.getHours() === h && !["cancelled"].includes(a.status);
                });
                return (
                  <div
                    key={`${day.toISOString()}-${h}`}
                    className="border-b border-r border-[var(--border)] min-h-12"
                  >
                    {dayApps.map((a) => (
                      <button
                        key={a._id}
                        type="button"
                        onClick={() => onSelectAppointment?.(a._id)}
                        className="w-full truncate rounded bg-[var(--accent-light)] px-1 py-0.5 text-left text-xs text-[var(--accent)]"
                      >
                        {a.customerId?.name} · {a.serviceId?.name}
                      </button>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Day view
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card-hover)]"
        >
          ←
        </button>
        <h2 className="font-semibold">{format(currentDate, "EEEE, d MMMM yyyy")}</h2>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card-hover)]"
        >
          →
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        {HOURS.map((h) => {
          const slotStart = setMinutes(setHours(dayStart, h), 0);
          const hourApps = filtered.filter((a) => {
            const start = new Date(a.startTime);
            return isSameDay(start, currentDate) && start.getHours() === h && !["cancelled"].includes(a.status);
          });
          return (
            <div key={h} className="flex border-b border-[var(--border)]">
              <div className="w-16 shrink-0 border-r border-[var(--border)] p-2 text-xs text-[var(--muted)]">
                {h}:00
              </div>
              <div className="flex-1 p-2">
                {hourApps.length === 0 && onSelectSlot && (
                  <button
                    type="button"
                    onClick={() => onSelectSlot(slotStart)}
                    className="w-full rounded border border-dashed border-[var(--border)] py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
                  >
                    + Add
                  </button>
                )}
                {hourApps.map((a) => (
                  <button
                    key={a._id}
                    type="button"
                    onClick={() => onSelectAppointment?.(a._id)}
                    className="mb-1 w-full rounded-lg bg-[var(--accent-light)] p-2 text-left text-sm text-[var(--accent)] hover:bg-amber-200"
                  >
                    <span className="font-medium">{format(new Date(a.startTime), "HH:mm")}</span>
                    <span className="mx-1">·</span>
                    {a.customerId?.name} – {a.serviceId?.name}
                    {a.staffId?.name && (
                      <span className="block text-xs opacity-80">{a.staffId.name}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

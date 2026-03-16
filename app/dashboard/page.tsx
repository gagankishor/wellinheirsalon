import Link from "next/link";
import { auth } from "@/auth";
import { Calendar, Users, UserCog, TrendingUp, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const isStaff = session?.user?.role === "staff";

  if (isStaff) {
    return (
      <div className="p-8">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--foreground)]">
          Welcome back
        </h1>
        <p className="mb-8 text-[var(--muted)]">
          Check in, check out, and view your appointments
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/attendance"
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow"
          >
            <Clock className="mb-3 h-8 w-8 text-[var(--accent)]" />
            <h2 className="font-medium text-[var(--foreground)]">Check In / Out</h2>
            <p className="text-sm text-[var(--muted)]">Mark your attendance for today</p>
          </Link>
          <Link
            href="/dashboard/my-appointments"
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow"
          >
            <Calendar className="mb-3 h-8 w-8 text-[var(--accent)]" />
            <h2 className="font-medium text-[var(--foreground)]">My Appointments</h2>
            <p className="text-sm text-[var(--muted)]">View your schedule</p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--foreground)]">
        Dashboard
      </h1>
      <p className="mb-8 text-[var(--muted)]">
        Overview of your salon today
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/appointments"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow"
        >
          <Calendar className="mb-3 h-8 w-8 text-[var(--accent)]" />
          <h2 className="font-medium text-[var(--foreground)]">Appointments</h2>
          <p className="text-sm text-[var(--muted)]">Calendar & schedule</p>
        </Link>
        <Link
          href="/dashboard/booking"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow"
        >
          <Calendar className="mb-3 h-8 w-8 text-[var(--accent)]" />
          <h2 className="font-medium text-[var(--foreground)]">Online Booking</h2>
          <p className="text-sm text-[var(--muted)]">Public booking page</p>
        </Link>
        <Link
          href="/dashboard/customers"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow"
        >
          <Users className="mb-3 h-8 w-8 text-[var(--accent)]" />
          <h2 className="font-medium text-[var(--foreground)]">Customers</h2>
          <p className="text-sm text-[var(--muted)]">Profiles & history</p>
        </Link>
        <Link
          href="/dashboard/staff"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow"
        >
          <UserCog className="mb-3 h-8 w-8 text-[var(--accent)]" />
          <h2 className="font-medium text-[var(--foreground)]">Staff</h2>
          <p className="text-sm text-[var(--muted)]">Team & attendance</p>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <TrendingUp className="h-5 w-5" />
          <span>Reports & revenue</span>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          View daily/monthly revenue, top services, and staff performance in{" "}
          <Link href="/dashboard/reports" className="font-medium text-[var(--accent)] hover:underline">
            Reports
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

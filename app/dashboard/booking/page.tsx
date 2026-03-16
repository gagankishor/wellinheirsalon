import Link from "next/link";

export default function BookingDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--foreground)]">
        Online booking
      </h1>
      <p className="mb-6 text-[var(--muted)]">
        Share the booking link with customers for online appointments.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <p className="mb-2 text-sm font-medium text-[var(--muted)]">Public booking URL</p>
        <code className="block rounded-lg bg-[var(--card-hover)] px-3 py-2 text-sm break-all">
          https://your-domain.com/booking
        </code>
        <p className="mt-1 text-xs text-[var(--muted)]">Replace with your actual site URL when deployed.</p>
        <Link
          href="/booking"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          Open booking page
        </Link>
      </div>
    </div>
  );
}

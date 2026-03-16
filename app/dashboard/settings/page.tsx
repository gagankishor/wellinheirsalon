import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-[var(--foreground)]">Settings</h1>
      <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div>
          <h2 className="font-medium">WhatsApp reminders</h2>
          <p className="text-sm text-[var(--muted)]">
            Set WHATSAPP_PHONE_ID and WHATSAPP_ACCESS_TOKEN in .env.local to enable appointment reminders.
            Call POST /api/reminders/send to send due reminders (e.g. via cron).
          </p>
        </div>
        <div>
          <h2 className="font-medium">MongoDB</h2>
          <p className="text-sm text-[var(--muted)]">
            Set MONGODB_URI in .env.local. See .env.local.example for all options.
          </p>
        </div>
      </div>
    </div>
  );
}

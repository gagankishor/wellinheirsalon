"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";

export default function SetupPage() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/setup")
      .then((r) => r.json())
      .then((d) => setNeedsSetup(d.needsSetup === true))
      .catch(() => setNeedsSetup(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Setup failed");
        setLoading(false);
        return;
      }
      router.push("/login");
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  if (needsSetup === null) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!needsSetup) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Scissors className="h-8 w-8 text-[var(--accent)]" />
          <span className="text-xl font-semibold text-[var(--foreground)]">Wellins</span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-center text-[var(--foreground)] mb-2">
            Create super admin
          </h1>
          <p className="text-sm text-center text-[var(--muted)] mb-6">
            First-time setup. This will be your admin account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--muted)]">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--muted)]">Password (min 6)</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]"
                minLength={6}
                required
              />
            </div>
            {error && <p className="text-sm text-amber-400">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--accent)] py-2.5 font-medium text-white disabled:opacity-50">
              {loading ? "Creating…" : "Create admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

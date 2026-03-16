"use client";

import Link from "next/link";
import { Scissors, Calendar, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--foreground)] hover:opacity-90">
          <Scissors className="h-8 w-8 text-[var(--accent)]" />
          <span className="font-display text-xl font-semibold tracking-tight">Wellins Hair Salon</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Calendar className="h-4 w-4" />
            Book online
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Staff login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-[var(--foreground)] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-medium text-[var(--foreground)]"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white"
            >
              <Calendar className="h-4 w-4" />
              Book online
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm text-[var(--muted)]">
              Staff login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

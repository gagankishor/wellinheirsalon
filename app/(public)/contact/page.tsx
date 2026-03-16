import Link from "next/link";
import { MapPin, Clock, Phone, Mail, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Contact | Wellins Hair Salon",
  description: "Get in touch or visit Wellins Hair Salon, Jodhpur. Address, hours, and book online.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Contact us
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl mx-auto">
          Visit us in Sector 8, Jodhpur, or book your appointment online. We’re here to help.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Visit & contact */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[var(--accent)]" />
              Visit us
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <p className="flex items-start gap-3 text-[var(--muted)]">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                  <span>
                    8/C/42, Sector 8, behind Lucky International School,
                    <br />
                    Jodhpur, Rajasthan
                  </span>
                </p>
                <p className="flex items-start gap-3 text-[var(--muted)]">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                  <span>
                    Mon–Sat: 9:00 am – 7:00 pm
                    <br />
                    Sunday: Closed
                  </span>
                </p>
              </div>
              <div className="space-y-4">
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                  <a href="tel:+917791839797" className="text-[var(--foreground)] hover:text-[var(--accent)] transition">
                    +91 77918 39797
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                  <a
                    href="mailto:wellinhairsaloon@gmail.com"
                    className="text-[var(--foreground)] hover:text-[var(--accent)] transition break-all"
                  >
                    wellinhairsaloon@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=8+C+42+Sector+8+behind+Lucky+International+School+Jodhpur"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Owner card + Book online */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)]">
                <User className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">Parkash Sen</h3>
                <p className="text-sm text-[var(--muted)]">Owner · @aariyan_sen</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Founder of Wellins Hair Salon. Get in touch for any queries or to plan your visit.
            </p>
            <a
              href="mailto:wellinhairsaloon@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              <Mail className="h-4 w-4" />
              Email Parkash
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-light)]/20 p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Book online
            </h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              Choose your service, stylist, and time. We’ll send you a reminder before your appointment.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Calendar className="h-4 w-4" />
              Book online
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 sm:p-8 text-center">
        <p className="text-[var(--muted)] max-w-xl mx-auto">
          For questions about services, availability, or group bookings, call us at{" "}
          <a href="tel:+917791839797" className="text-[var(--accent)] hover:underline">+91 77918 39797</a> or drop by—we’re happy to help.
        </p>
      </div>
    </div>
  );
}

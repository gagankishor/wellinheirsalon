import Link from "next/link";
import { Scissors, MapPin, Clock, Phone, Mail } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book online" },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--footer-bg)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-7 w-7 text-[var(--accent)]" />
            <span className="text-lg font-semibold">Wellins Hair Salon</span>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Quick links
            </h3>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm opacity-90 transition hover:opacity-100 hover:text-[var(--accent)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Visit us
            </h3>
            <div className="space-y-2 text-sm opacity-90">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                8/C/42, Sector 8, behind Lucky International School, Jodhpur
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                Mon–Sat 9am–7pm
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <a href="tel:+917791839797" className="transition hover:text-[var(--accent)]">+91 77918 39797</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <a href="mailto:wellinhairsaloon@gmail.com" className="transition hover:text-[var(--accent)]">wellinhairsaloon@gmail.com</a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Book your visit
            </h3>
            <p className="mb-4 text-sm opacity-90">
              Reserve your slot online—quick and easy.
            </p>
            <Link
              href="/booking"
              className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Book online
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Wellins Hair Salon, Jodhpur. Owner: Parkash Sen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

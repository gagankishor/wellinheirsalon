import Link from "next/link";
import { Calendar } from "lucide-react";
import ServicesList from "./ServicesList";

export const metadata = {
  title: "Services | Wellins Hair Salon",
  description: "Haircuts, colour, styling, and treatments at Wellins Hair Salon.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
        Our services
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Cuts, colour, and treatments to suit every style and budget. Sector 8, Jodhpur.
      </p>

      <ServicesList />

      <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center">
        <p className="font-medium text-[var(--foreground)]">
          Not sure what you need? We’re happy to help you choose.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Get in touch
        </Link>
        <div className="mt-6">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <Calendar className="h-4 w-4" />
            Book online
          </Link>
        </div>
      </div>
    </div>
  );
}

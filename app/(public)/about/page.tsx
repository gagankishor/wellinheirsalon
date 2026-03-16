import Link from "next/link";
import Image from "next/image";
import { Scissors, Award, Users, Heart } from "lucide-react";

const SALON_IMAGE = "https://images.unsplash.com/photo-1637777277337-f114350fb088";

export const metadata = {
  title: "About us | Wellins Hair Salon",
  description: "Learn about Wellins Hair Salon—our story, values, and team.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
        About Wellins
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Your neighbourhood salon for cuts, colour, and care in Jodhpur.
      </p>

      <div className="mt-10 relative aspect-[21/9] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <Image
          src={`${SALON_IMAGE}?w=1200&q=80`}
          alt="Wellins Hair Salon interior"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 to-transparent" />
      </div>

      <div className="mt-12 prose prose-invert prose-stone max-w-none">
        <p className="text-[var(--muted)]">
          Wellins Hair Salon was built on a simple idea: everyone deserves to
          leave the chair feeling confident and refreshed. Founded by{" "}
          <span className="text-[var(--foreground)] font-medium">Parkash Sen</span> in Jodhpur,
          we combine professional expertise with a relaxed, welcoming atmosphere so you can
          unwind while we take care of your hair.
        </p>
        <p className="mt-4 text-[var(--muted)]">
          Our team stays current with the latest trends and techniques, from
          classic cuts to modern colour and treatments. Whether you’re in for a
          quick trim or a full transformation, we’re here to listen and deliver
          the look you want. Visit us at 8/C/42, Sector 8, behind Lucky International School, Jodhpur.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {[
          { icon: Award, title: "Quality first", desc: "We use trusted products and methods for lasting results." },
          { icon: Users, title: "Experienced team", desc: "Skilled stylists who keep learning and improving." },
          { icon: Heart, title: "You’re the focus", desc: "Every visit is tailored to your style and schedule." },
          { icon: Scissors, title: "Precision & care", desc: "Attention to detail in every cut and colour." },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <div className="shrink-0 rounded-lg bg-[var(--accent-light)] p-3">
              <Icon className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--accent-light)]/30 p-8 text-center">
        <p className="text-lg font-medium text-[var(--foreground)]">
          We’d love to meet you. Book your first visit online and see why
          clients keep coming back.
        </p>
        <Link
          href="/booking"
          className="mt-4 inline-block rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Book online
        </Link>
      </div>
    </div>
  );
}

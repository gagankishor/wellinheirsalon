import Link from "next/link";
import Image from "next/image";
import {
  Scissors,
  Sparkles,
  Heart,
  Calendar,
  ArrowRight,
  MapPin,
  Star,
  Shield,
  Clock,
  ThumbsUp,
  Quote,
} from "lucide-react";

const UNSPLASH = {
  salonInterior: "https://images.unsplash.com/photo-1637777277337-f114350fb088",
  hairStyling: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
  salonMirror: "https://images.unsplash.com/photo-1521590832167-7acbfdda340e",
};

export default function PublicHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] overflow-hidden bg-[var(--background)] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={`${UNSPLASH.salonInterior}?w=1920&q=80`}
            alt="Wellins Hair Salon interior"
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--background)_30%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--accent-light)_0%,transparent_45%)] opacity-40" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none z-10" />
        <div className="relative z-10 mx-auto max-w-6xl w-full px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/90 px-5 py-2 text-sm font-medium text-[var(--muted)] backdrop-blur">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              Your style, our passion · Jodhpur
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Look good.{" "}
              <span className="bg-gradient-to-r from-[var(--accent)] to-amber-400 bg-clip-text text-transparent">
                Feel great.
              </span>
            </h1>
            <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">
              Expert cuts, colour, and care at Wellins Hair Salon. Book your appointment
              online and step into a relaxed, professional experience in the heart of Sector 8, Jodhpur.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-[var(--accent)]/25 transition hover:opacity-90 hover:shadow-[var(--accent)]/30"
              >
                <Calendar className="h-5 w-5" />
                Book online
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3.5 text-base font-medium text-[var(--foreground)] transition hover:bg-[var(--card-hover)] hover:border-[var(--accent)]/50"
              >
                <MapPin className="h-4 w-4" />
                Find us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-[var(--border)] bg-[var(--card)] py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {[
              { value: "10+", label: "Years experience" },
              { value: "5000+", label: "Happy clients" },
              { value: "15+", label: "Services" },
              { value: "Sector 8", label: "Jodhpur" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-[var(--accent)] sm:text-4xl">{value}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              What we offer
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Cuts, colour, styling, and treatments for every need.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Scissors, title: "Haircuts & styling", desc: "Precision cuts and finishes for men, women, and kids." },
              { icon: Sparkles, title: "Colour & highlights", desc: "Full colour, balayage, and expert colour correction." },
              { icon: Heart, title: "Treatments", desc: "Nourishing treatments and scalp care for healthy hair." },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-[var(--accent)]/5"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[var(--accent-light)] p-3 transition group-hover:scale-105">
                  <Icon className="h-6 w-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-medium text-[var(--accent)] hover:underline"
            >
              See all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-t border-[var(--border)] bg-[var(--card)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              Why choose Wellins
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              We go the extra mile so you leave looking and feeling your best.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Quality products", desc: "We use trusted, professional-grade products for lasting results." },
              { icon: Clock, title: "On-time service", desc: "We respect your time. Book online and avoid the wait." },
              { icon: ThumbsUp, title: "Skilled stylists", desc: "Our team stays updated with the latest trends and techniques." },
              { icon: Heart, title: "Personal care", desc: "Every visit is tailored to your style and preferences." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-light)]">
                  <Icon className="h-7 w-7 text-[var(--accent)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="border-t border-[var(--border)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
                A salon that cares
              </h2>
              <p className="mt-6 text-[var(--muted)] leading-relaxed">
                At Wellins we focus on you—your style, your schedule, and a
                calm, welcoming environment. Founded by Parkash Sen in Jodhpur, our team brings years of experience
                and stays up to date with the latest techniques so you leave
                looking and feeling your best.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 font-medium text-[var(--accent)] hover:underline"
              >
                Our story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <Image
                src={`${UNSPLASH.hairStyling}?w=800&q=80`}
                alt="Hair styling at Wellins Salon"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-[var(--border)] bg-[var(--card)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              What our clients say
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Real experiences from people who trust Wellins.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { quote: "Best haircut I've had in Jodhpur. The team is professional and the salon is always clean and welcoming.", name: "Priya M.", role: "Regular client" },
              { quote: "I get my colour done here every few months. They never disappoint—consistent quality and great advice.", name: "Rahul K.", role: "Client" },
              { quote: "Parkash and the team really listen to what you want. Finally found a salon I can stick with.", name: "Anita S.", role: "Client" },
            ].map(({ quote, name, role }) => (
              <div key={name} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
                <Quote className="h-8 w-8 text-[var(--accent)]/60 mb-4" />
                <p className="text-[var(--muted)] leading-relaxed">&ldquo;{quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">{name}</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find us */}
      <section className="border-t border-[var(--border)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
                  Find us in Jodhpur
                </h2>
                <p className="mt-4 text-[var(--muted)]">
                  We're located in Sector 8, behind Lucky International School. Easy to reach and with a warm welcome waiting.
                </p>
                <div className="mt-6 space-y-3">
                  <p className="flex items-start gap-3 text-[var(--foreground)]">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                    8/C/42, Sector 8, behind Lucky International School, Jodhpur
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-[var(--muted)]">Call or WhatsApp:</span>
                    <a href="tel:+917791839797" className="font-medium text-[var(--accent)] hover:underline">+91 77918 39797</a>
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://maps.google.com/?q=8+C+42+Sector+8+behind+Lucky+International+School+Jodhpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card-hover)]"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Full contact details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl border border-[var(--border)]">
                <Image
                  src={`${UNSPLASH.salonMirror}?w=800&q=80`}
                  alt="Wellins Hair Salon, Jodhpur"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)]/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-sm font-medium text-[var(--foreground)] drop-shadow">
                    Sector 8, Jodhpur · Behind Lucky International School
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-gradient-to-br from-[var(--accent)] to-amber-600 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready for your next appointment?
          </h2>
          <p className="mt-4 text-white/90 text-lg">
            Book in seconds. We'll send a reminder so you never miss a visit.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-medium text-[var(--accent)] shadow-lg transition hover:bg-white/95"
          >
            <Calendar className="h-5 w-5" />
            Book online
          </Link>
        </div>
      </section>
    </>
  );
}

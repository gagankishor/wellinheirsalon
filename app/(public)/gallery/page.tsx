"use client";

import Script from "next/script";
import Link from "next/link";
import { Instagram, ArrowLeft } from "lucide-react";

const REELS = [
  "https://www.instagram.com/reel/DU_JRvbDWSm/",
  "https://www.instagram.com/reel/DVLvIBeEmix/",
  "https://www.instagram.com/reel/DV449yhvxlZ/",
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
          Reels &amp; Gallery
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Follow us on{" "}
          <a
            href="https://www.instagram.com/wellin_hair_saloon/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] hover:underline"
          >
            <Instagram className="h-4 w-4" />
            @wellin_hair_saloon
          </a>
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {REELS.map((url) => (
          <div key={url} className="flex justify-center">
            <blockquote
              className="instagram-media overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] [&_a]:!text-[var(--foreground)]"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ minWidth: 326, maxWidth: 540 }}
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                View this reel on Instagram
              </a>
            </blockquote>
          </div>
        ))}
      </div>

      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && "instgrm" in window) {
            (window as { instgrm?: { Embeds?: { process: () => void } } }).instgrm?.Embeds?.process();
          }
        }}
      />
    </div>
  );
}

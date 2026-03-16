import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Reels",
  description: "Instagram reels and gallery from Wellins Hair Salon, Jodhpur.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

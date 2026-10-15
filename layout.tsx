import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gita Life Coach AI — Wisdom for Everyday Life",
  description: "Explore Bhagavad Gita teachings and turn ancient wisdom into practical daily actions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
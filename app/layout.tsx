import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import IconPatternBackground from "@/components/layout/icon-pattern-background";
import TmdbAttribution from "@/components/layout/tmdb-attribution";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinelytics",
  description: "Analytics without the theatrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <IconPatternBackground />
        <div className="relative z-10 flex min-h-svh flex-col">
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <TmdbAttribution />
          <Analytics />
        </div>
      </body>
    </html>
  );
}

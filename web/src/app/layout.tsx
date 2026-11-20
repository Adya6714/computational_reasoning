import type { Metadata } from "next";
import { Syne, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "RC · Reasoning Computation",
  description:
    "Interactive research programme: paper development protocol, Reasoning Computation programme, and Direction 1 on error propagation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plex.variable} ${plexMono.variable} h-full`}
    >
      <body className="noise-overlay min-h-full flex flex-col grid-bg antialiased">
        <Nav />
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { Rail } from "@/components/Rail";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Reasoning Computation | Adya Srivastava",
  description:
    "Research programme on how language models represent, transform and recover from intermediate computational states — with a paper development protocol and Direction 1 on error propagation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} ${inter.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Rail />
        <div className="site-main">{children}</div>
      </body>
    </html>
  );
}

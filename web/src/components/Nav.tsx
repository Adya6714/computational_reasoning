"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/programme", label: "Programme" },
  { href: "/direction-1", label: "Direction 1" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center border-2 border-ink bg-vermillion text-sm font-bold text-white shadow-[3px_3px_0_#0b0d10]">
            RC
            <span className="pointer-events-none absolute inset-0 group-hover:animate-[pulse-ring_1.2s_ease-out_1]" />
          </span>
          <div className="leading-none">
            <div className="display text-lg font-extrabold tracking-tight">Reasoning Computation</div>
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Research programme
            </div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 border-2 border-ink bg-acid shadow-[2px_2px_0_#0b0d10]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

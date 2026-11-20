"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/pipeline", label: "Research pipeline" },
  { href: "/programme", label: "RC programme" },
  { href: "/direction-1", label: "Direction 1" },
];

export function Rail() {
  const pathname = usePathname();

  return (
    <>
      <nav className="rail" id="rail" aria-label="Section navigation">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "active" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "active" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

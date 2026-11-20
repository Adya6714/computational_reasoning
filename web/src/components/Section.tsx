import type { ReactNode } from "react";

export function PageHero({
  kicker,
  title,
  subtitle,
  accent = "var(--vermillion)",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  accent?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rotate-12 opacity-80"
        style={{ background: accent }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 -translate-x-1/2 opacity-70"
        style={{ background: "var(--teal)" }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mono mb-4 text-xs uppercase tracking-[0.22em] text-muted">
          {kicker}
        </div>
        <h1 className="display max-w-4xl text-5xl font-extrabold sm:text-7xl">{title}</h1>
        <div className="accent-bar mt-6" style={{ background: accent }} />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

export function SectionBlock({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 ${className}`}>
      {eyebrow && (
        <div className="mono mb-3 text-xs uppercase tracking-[0.2em] text-muted">
          {eyebrow}
        </div>
      )}
      <h2 className="display text-3xl font-extrabold sm:text-4xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Marquee } from "@/components/Marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

const journey = [
  {
    href: "/pipeline",
    step: "01",
    title: "Research Pipeline",
    blurb:
      "How any paper should be built: ten stages, seven phases, six readiness gates, and a Research Design Document before a single sentence of manuscript.",
    accent: "var(--vermillion)",
    cta: "Enter the protocol",
  },
  {
    href: "/programme",
    step: "02",
    title: "RC Programme",
    blurb:
      "Reasoning Computation: four pillars, thirteen directions, an evidence ladder, and a clear separation from RvC and RR.",
    accent: "var(--cobalt)",
    cta: "Explore the programme",
  },
  {
    href: "/direction-1",
    step: "03",
    title: "Direction 1",
    blurb:
      "Paper 1 on error propagation — after a model writes a wrong intermediate value, what does the next step actually use: W, S, or P?",
    accent: "var(--teal)",
    cta: "Open Direction 1",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden border-b-2 border-ink">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -left-20 top-24 h-72 w-72"
            style={{ background: "var(--vermillion)" }}
            animate={{ rotate: [0, 8, 0], y: [0, 18, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-10 top-40 h-56 w-56"
            style={{ background: "var(--teal)" }}
            animate={{ rotate: [0, -12, 0], x: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-24 left-1/3 h-40 w-64"
            style={{ background: "var(--acid)" }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-1/4 h-32 w-32"
            style={{ background: "var(--cobalt)" }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mono mb-5 inline-flex items-center gap-2 border-2 border-ink bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] shadow-[3px_3px_0_#0b0d10]">
              <span className="h-2 w-2 animate-pulse bg-vermillion" />
              Adya Srivastava · Nov 2026
            </div>
            <h1 className="display max-w-5xl text-6xl font-extrabold sm:text-8xl lg:text-[7.5rem]">
              Reasoning
              <br />
              Computation
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80 sm:text-xl">
              An interactive map of how research should be done — then the RC programme
              that applies it — then Direction 1, the first causal study of error
              propagation in multi-step LLM computation.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/pipeline"
                className="sharp-btn bg-vermillion px-5 py-3 text-white"
              >
                Start with the pipeline
              </Link>
              <Link href="/direction-1" className="sharp-btn bg-white px-5 py-3">
                Jump to Direction 1
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Marquee
        items={[
          "Question first",
          "Evidence design second",
          "Writing third",
          "Gate before you draft",
          "Natural errors over injected",
          "Causal before computational-role claims",
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="mono text-xs uppercase tracking-[0.2em] text-muted">
            Three layers · one programme
          </div>
          <h2 className="display mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Read it in order. Interact with each layer.
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {journey.map((item, i) => (
            <StaggerItem key={item.href}>
              <Link
                href={item.href}
                className="group relative flex h-full flex-col border-2 border-ink bg-white p-6 shadow-[6px_6px_0_#0b0d10] transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#0b0d10]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-2"
                  style={{ background: item.accent }}
                />
                <div className="mono text-xs text-muted">Layer {item.step}</div>
                <h3 className="display mt-4 text-3xl font-extrabold">{item.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  {item.blurb}
                </p>
                <div className="mt-6 flex items-center justify-between border-t-2 border-ink pt-4 font-bold">
                  <span>{item.cta}</span>
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                  >
                    →
                  </motion.span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t-2 border-ink bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <h2 className="display text-4xl font-extrabold sm:text-5xl">
              The principle behind every paper.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/75">
              Establish the scientific question first. Design the evidence-generation
              process second. Write the paper third. This site is the interactive SOP for
              that discipline — applied to Reasoning Computation.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="border-2 border-paper bg-vermillion p-6 text-white shadow-[8px_8px_0_var(--acid)]">
              <div className="mono text-xs uppercase tracking-[0.18em] text-white/80">
                Paper 1 one-liner
              </div>
              <p className="display mt-3 text-2xl font-extrabold leading-tight">
                After the model writes a wrong intermediate value, what does the next
                dependent step actually use?
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

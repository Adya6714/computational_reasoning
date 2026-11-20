"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHero, SectionBlock } from "@/components/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { EvidenceLadder } from "@/components/programme/EvidenceLadder";
import { DirectionExplorer } from "@/components/programme/DirectionExplorer";
import {
  evidenceChain,
  pillars,
  rcQuestions,
  roadmap,
  strands,
  toolkit,
  whyItMatters,
} from "@/data/programme";

export default function ProgrammePage() {
  return (
    <div>
      <PageHero
        kicker="Layer 02 · Reasoning Computation"
        title="RC Programme"
        subtitle="We lack a sufficiently direct, causally tested account of how LLMs represent, transform, maintain and recover from intermediate computational states during multi-step reasoning."
        accent="var(--cobalt)"
      />

      <SectionBlock eyebrow="Motivation" title="The questions RC asks">
        <Stagger className="grid gap-3">
          {rcQuestions.map((q, i) => (
            <StaggerItem key={q}>
              <motion.div
                whileHover={{ x: 6 }}
                className="flex gap-4 border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#0b0d10]"
              >
                <span className="mono text-sm font-bold text-vermillion">
                  Q{i + 1}
                </span>
                <p className="font-medium leading-relaxed">{q}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionBlock>

      <div className="border-y-2 border-ink bg-ink text-paper">
        <SectionBlock eyebrow="Why it matters" title="Three stakes">
          <div className="grid gap-4 md:grid-cols-3">
            {whyItMatters.map((item) => (
              <Reveal key={item.title}>
                <div
                  className="h-full border-2 border-paper p-5"
                  style={{ borderTopWidth: 8, borderTopColor: item.color }}
                >
                  <h3 className="display text-2xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock eyebrow="Evidence chain" title="From behaviour to mechanism">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-ink sm:left-6" />
          <div className="space-y-4">
            {evidenceChain.map((step, i) => (
              <Reveal key={step} delay={i * 0.04}>
                <div className="relative flex gap-4 pl-0 sm:gap-6">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-teal text-xs font-extrabold sm:h-12 sm:w-12 sm:text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 border-2 border-ink bg-white p-4 shadow-[3px_3px_0_#0b0d10]">
                    {step}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionBlock>

      <div className="border-y-2 border-ink bg-paper-2/70">
        <SectionBlock eyebrow="Separation" title="RC is not RvC or RR">
          <div className="grid gap-4 lg:grid-cols-3">
            {strands.map((s) => (
              <Reveal key={s.id}>
                <div
                  className={`h-full border-2 border-ink bg-white p-5 shadow-[5px_5px_0_#0b0d10] ${
                    s.id === "RC" ? "ring-4 ring-vermillion/40" : ""
                  }`}
                >
                  <div
                    className="inline-block border-2 border-ink px-2 py-0.5 text-xs font-extrabold"
                    style={{ background: s.color }}
                  >
                    {s.id}
                  </div>
                  <h3 className="display mt-3 text-2xl font-extrabold">{s.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{s.question}</p>
                  <p className="mt-4 border-t-2 border-ink pt-3 text-xs font-semibold">
                    {s.relation}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock eyebrow="Claim discipline" title="Evidence ladder">
        <Reveal>
          <EvidenceLadder />
        </Reveal>
      </SectionBlock>

      <div className="border-y-2 border-ink">
        <SectionBlock eyebrow="Four pillars" title="How the programme is organised">
          <div className="mb-10 grid gap-3 sm:grid-cols-2">
            {pillars.map((p) => (
              <Reveal key={p.id}>
                <div
                  className="border-2 border-ink bg-white p-5 shadow-[4px_4px_0_#0b0d10]"
                  style={{ borderLeftWidth: 10, borderLeftColor: p.color }}
                >
                  <div className="mono text-xs uppercase tracking-widest text-muted">
                    Pillar {p.id}
                  </div>
                  <h3 className="display mt-1 text-xl font-extrabold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.question}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.directions.map((d) => (
                      <span
                        key={d}
                        className="border-2 border-ink bg-paper px-2 py-0.5 text-xs font-bold"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <DirectionExplorer />
          </Reveal>
        </SectionBlock>
      </div>

      <SectionBlock eyebrow="Toolkit" title="Five interpretability layers">
        <div className="grid gap-3 lg:grid-cols-5">
          {toolkit.map((t, i) => (
            <Reveal key={t.layer} delay={i * 0.05}>
              <div className="flex h-full flex-col border-2 border-ink bg-white p-4">
                <div className="font-extrabold text-vermillion">{t.layer}</div>
                <p className="mt-2 text-sm font-semibold">{t.job}</p>
                <p className="mt-2 flex-1 text-xs text-muted">{t.methods}</p>
                <p className="mt-3 border-t-2 border-ink pt-2 text-[11px] font-bold text-cobalt">
                  {t.caveat}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      <div className="border-t-2 border-ink bg-teal/20">
        <SectionBlock eyebrow="Roadmap" title="Phases 0 → 3">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((r) => (
              <Reveal key={r.phase}>
                <div className="h-full border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#0b0d10]">
                  <div className="display text-4xl font-extrabold text-cobalt">{r.phase}</div>
                  <h3 className="mt-2 font-extrabold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted">{r.goal}</p>
                  <p className="mt-3 text-xs font-semibold">{r.outputs}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionBlock>
      </div>

      <section className="border-t-2 border-ink bg-vermillion text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="mono text-xs uppercase tracking-[0.2em] text-white/70">
              Next layer
            </div>
            <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
              Direction 1 · error propagation
            </h2>
            <p className="mt-2 max-w-xl text-white/85">
              The first study sits where representation, computation, state use, error
              genesis, recovery and causal reliability meet.
            </p>
          </div>
          <Link href="/direction-1" className="sharp-btn bg-acid px-5 py-3 font-bold text-ink">
            Open Direction 1 →
          </Link>
        </div>
      </section>
    </div>
  );
}

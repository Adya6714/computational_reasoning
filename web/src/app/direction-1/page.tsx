"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHero, SectionBlock } from "@/components/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { InterventionPlayground } from "@/components/direction1/InterventionPlayground";
import { ExplanationGrid } from "@/components/direction1/ExplanationGrid";
import {
  contribution,
  gapPoints,
  groundRules,
  oneLiner,
  paper1Behaviours,
  phaseMap,
  researchQuestions,
  testPlan,
} from "@/data/direction1";

export default function Direction1Page() {
  return (
    <div>
      <PageHero
        kicker="Layer 03 · Paper 1 · Research Direction 1"
        title="Error propagation"
        subtitle={oneLiner}
        accent="var(--teal)"
      />

      <section className="border-b-2 border-ink bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Reveal>
            <div className="mono text-xs uppercase tracking-[0.2em] text-paper/60">
              Research question
            </div>
            <p className="display mt-3 max-w-4xl text-2xl font-extrabold leading-snug sm:text-3xl">
              How do incorrect intermediate values causally influence subsequent
              computation in language models, and what determines whether those errors
              are propagated or corrected?
            </p>
          </Reveal>
        </div>
      </section>

      <SectionBlock eyebrow="Problem" title="Same outputs, different computations">
        <p className="mb-6 max-w-3xl text-muted">
          When a model generates an incorrect intermediate value and later consumes it,
          several behaviours are possible. They can produce similar outputs while implying
          very different internal computations — and they are not mutually exclusive.
        </p>
        <Stagger className="grid gap-3 sm:grid-cols-2">
          {paper1Behaviours.map((b, i) => (
            <StaggerItem key={b}>
              <div className="flex items-start gap-3 border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#0b0d10]">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink text-sm font-extrabold"
                  style={{
                    background: ["var(--vermillion)", "var(--cobalt)", "var(--teal)", "var(--acid)"][
                      i
                    ],
                  }}
                >
                  {i + 1}
                </span>
                <p className="font-semibold leading-snug">{b}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionBlock>

      <div className="border-y-2 border-ink bg-paper-2/60">
        <SectionBlock eyebrow="W · S · P" title="Intervention playground">
          <Reveal>
            <InterventionPlayground />
          </Reveal>
        </SectionBlock>
      </div>

      <SectionBlock eyebrow="RQs" title="Research questions">
        <div className="grid gap-3">
          {researchQuestions.map((rq, i) => (
            <Reveal key={rq.id} delay={i * 0.04}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="grid gap-3 border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#0b0d10] sm:grid-cols-[120px_1fr_160px]"
              >
                <div className="display text-3xl font-extrabold text-vermillion">{rq.id}</div>
                <p className="font-medium leading-relaxed">{rq.q}</p>
                <div className="border-2 border-ink bg-acid px-2 py-1 text-center text-xs font-extrabold uppercase tracking-wide self-start">
                  {rq.role}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      <div className="border-y-2 border-ink bg-cobalt text-white">
        <SectionBlock eyebrow="Gap (candidate)" title="What is still insufficiently characterized">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {gapPoints.map((g) => (
              <Reveal key={g.title}>
                <div className="h-full border-2 border-paper/40 bg-ink/30 p-4 backdrop-blur-sm">
                  <h3 className="font-extrabold text-acid">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock
        eyebrow="Competing explanations"
        title="Flip a card — claim vs Paper 1 prediction"
      >
        <Reveal>
          <ExplanationGrid />
        </Reveal>
        <p className="mt-4 text-sm text-muted">
          These are not mutually exclusive. The objective is to identify which information
          causally affects downstream computation under stated conditions.
        </p>
      </SectionBlock>

      <div className="border-y-2 border-ink">
        <SectionBlock eyebrow="Contribution boundary" title="What Paper 1 can claim — if supported">
          <Reveal>
            <div className="border-2 border-ink bg-white p-6 shadow-[6px_6px_0_#0b0d10]">
              <p className="text-lg font-semibold leading-relaxed">{contribution.proposed}</p>
            </div>
          </Reveal>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {contribution.hierarchy.map((h) => (
              <Reveal key={h.tier}>
                <div className="border-2 border-ink bg-paper p-4">
                  <div className="mono text-[10px] uppercase tracking-widest text-vermillion">
                    {h.tier}
                  </div>
                  <p className="mt-2 text-sm font-medium">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock eyebrow="How it will be tested" title="Design summary">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {testPlan.map((t) => (
            <Reveal key={t.title}>
              <div className="h-full border-2 border-ink bg-white p-4 shadow-[3px_3px_0_#0b0d10]">
                <div className="display text-xl font-extrabold">{t.title}</div>
                <p className="mt-2 text-sm text-muted">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      <div className="border-y-2 border-ink bg-teal/15">
        <SectionBlock eyebrow="Implementation" title="Phase map 0 → 3">
          <div className="grid gap-4 lg:grid-cols-4">
            {phaseMap.map((p, i) => (
              <Reveal key={p.phase} delay={i * 0.05}>
                <div className="relative h-full border-2 border-ink bg-white p-5 shadow-[5px_5px_0_#0b0d10]">
                  <div className="display text-5xl font-extrabold text-teal">{p.phase}</div>
                  <h3 className="mt-2 text-lg font-extrabold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.goal}</p>
                  <p className="mt-3 border-t-2 border-ink pt-3 text-xs font-semibold">
                    {p.outputs}
                  </p>
                  <p className="mt-2 mono text-[10px] uppercase tracking-widest text-muted">
                    {p.who}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock eyebrow="Ground rules" title="What may happen now">
        <div className="grid gap-2">
          {groundRules.map((rule) => (
            <Reveal key={rule}>
              <div className="border-l-4 border-vermillion bg-white px-4 py-3 text-sm font-medium shadow-[2px_2px_0_#0b0d10]">
                {rule}
              </div>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      <section className="border-t-2 border-ink bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="mono text-xs uppercase tracking-[0.2em] text-paper/60">
              Full loop
            </div>
            <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
              Pipeline → Programme → Direction 1
            </h2>
            <p className="mt-2 max-w-xl text-paper/75">
              Revisit the SOP, or return home to walk the three layers again.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pipeline" className="sharp-btn bg-vermillion px-5 py-3 font-bold text-white">
              Pipeline
            </Link>
            <Link href="/programme" className="sharp-btn bg-cobalt px-5 py-3 font-bold text-white">
              Programme
            </Link>
            <Link href="/" className="sharp-btn bg-acid px-5 py-3 font-bold text-ink">
              Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

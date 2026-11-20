"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Panel, Kicker } from "@/components/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { ModelInternals } from "@/components/ModelInternals";

const layers = [
  {
    href: "/pipeline",
    n: "01",
    title: "Research pipeline",
    blurb:
      "How any paper should be built: ten stages, readiness gates, and a Research Design Document before a single sentence of manuscript.",
  },
  {
    href: "/programme",
    n: "02",
    title: "RC programme",
    blurb:
      "Reasoning Computation: four pillars, thirteen directions, an evidence ladder, and a clear separation from RvC and RR.",
  },
  {
    href: "/direction-1",
    n: "03",
    title: "Direction 1",
    blurb:
      "Paper 1 on error propagation — after a model writes a wrong intermediate value, what does the next step actually use: W, S, or P?",
  },
];

const floats = [
  { label: "Gate 1–6", top: "18%", left: "72%", delay: 0 },
  { label: "Pillars I–IV", top: "42%", left: "78%", delay: 0.4 },
  { label: "W / S / P", top: "64%", left: "70%", delay: 0.8 },
  { label: "RQ1–RQ4", top: "28%", left: "8%", delay: 0.2 },
  { label: "A–M", top: "58%", left: "6%", delay: 0.6 },
];

export default function HomePage() {
  return (
    <div>
      <Panel id="overview" center className="!justify-center overflow-hidden">
        <div className="lattice" aria-hidden />
        <motion.div
          className="ambient"
          style={{
            width: 320,
            height: 320,
            top: "12%",
            right: "8%",
            background: "var(--accent)",
          }}
          animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="ambient"
          style={{
            width: 240,
            height: 240,
            bottom: "18%",
            left: "6%",
            background: "var(--teal)",
            opacity: 0.14,
          }}
          animate={{ x: [0, -14, 0], y: [0, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        {floats.map((f) => (
          <motion.span
            key={f.label}
            className="node-float"
            style={{ top: f.top, left: f.left }}
            animate={{ y: [0, -6, 0], opacity: [0.35, 0.7, 0.35] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              delay: f.delay,
              ease: "easeInOut",
            }}
          >
            {f.label}
          </motion.span>
        ))}

        <div className="relative z-[2]">
          <Kicker>Reasoning Computation · research programme</Kicker>
          <h1>
            How do language models compute — and what happens when an intermediate step goes
            wrong?
          </h1>
          <p className="hero-author mt-3 !mb-0 text-[0.95rem]">
            Adya Srivastava. Companion programme to{" "}
            <a
              href="https://adya6714.github.io/retrieval-vs-computation/"
              target="_blank"
              rel="noreferrer"
            >
              Retrieval vs Computation
            </a>
            .
          </p>
          <p className="lede mt-5">
            Benchmarks tell you whether a model got the answer right. They do not tell you
            how the computation was performed, or why an error sometimes propagates and
            sometimes does not. This site is the interactive map of the RC programme: first
            the paper-development protocol, then the programme, then Direction 1.
          </p>

          <div className="epistemic">
            <p>
              <strong className="text-[var(--ink)]">Why this is hard.</strong> A correct
              final answer can come from systematic computation, retrieval, templates, or
              shortcuts. A wrong answer does not reveal where the computation broke.
            </p>
            <p>
              <strong className="text-[var(--ink)]">What this programme adds.</strong> A
              causally tested account of intermediate computational state — representation,
              updating, failure, recovery — starting with a sharply bounded first study.
            </p>
          </div>

          <div className="status-strip">
            <strong className="text-[var(--ink)]">Status, November 2026.</strong> Programme
            foundation and Direction 1 design in progress. Nothing has been run. GPU use
            needs explicit PI authorization.{" "}
            <Link href="/pipeline">Start with the pipeline ↓</Link>
          </div>
        </div>
      </Panel>

      <Panel id="layers">
        <Reveal>
          <Kicker>Three layers · one programme</Kicker>
          <h2>Read it in order. Interact with each layer.</h2>
          <p className="lede">
            The same visual language as the RvC site — calm, precise, interactive — applied
            to the broader Reasoning Computation programme.
          </p>
        </Reveal>

        <Stagger className="mt-8 grid gap-3 md:grid-cols-3">
          {layers.map((item) => (
            <StaggerItem key={item.href}>
              <Link
                href={item.href}
                className="card group block !no-underline hover:!no-underline"
              >
                <div className="tag">Layer {item.n}</div>
                <h3 className="mt-2 group-hover:text-[var(--accent)]">{item.title}</h3>
                <p className="!mb-0 text-[0.9rem] text-[var(--muted)]">{item.blurb}</p>
                <div className="mt-4 text-[0.85rem] font-medium text-[var(--accent)]">
                  Open →
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Panel>

      <Panel id="internals-preview">
        <Reveal>
          <Kicker>Play with the insides</Kicker>
          <h2>Hypotheses that move layers, circuits, and neurons</h2>
          <p className="lede">
            A quiet sketch of how different stories about error propagation would light up a
            network. Soften the sliders. Switch the claim. Watch it rearrange.
          </p>
          <ModelInternals />
        </Reveal>
      </Panel>

      <Panel id="principle">
        <Reveal>
          <Kicker>Operating principle</Kicker>
          <h2>Question first. Evidence design second. Writing third.</h2>
          <p className="lede">
            Establish the scientific question first, design the evidence-generation process
            second, and write the paper third. That discipline is the pipeline. RC is where
            it is applied. Direction 1 is the first study.
          </p>
          <div className="mt-8 max-w-[62ch] rounded-2xl border border-[var(--rule)] bg-[var(--tint)] p-5">
            <div className="tag">Paper 1 one-liner</div>
            <p
              className="mt-2 !mb-0 text-[1.25rem] leading-snug"
              style={{ fontFamily: "var(--serif)" }}
            >
              After the model itself writes a wrong intermediate value, what does the next
              dependent step actually use?
            </p>
            <Link href="/direction-1" className="mt-4 inline-block text-[0.9rem]">
              Open Direction 1 →
            </Link>
          </div>
        </Reveal>
      </Panel>
    </div>
  );
}

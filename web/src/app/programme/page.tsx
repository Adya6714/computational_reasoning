"use client";

import Link from "next/link";
import { Panel, Kicker } from "@/components/Section";
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
      <Panel id="programme-hero" center>
        <div className="lattice" aria-hidden />
        <div className="relative z-[2]">
          <Kicker>Layer 02 · Reasoning Computation</Kicker>
          <h1>RC programme</h1>
          <p className="lede">
            We lack a sufficiently direct, causally tested account of how LLMs represent,
            transform, maintain and recover from intermediate computational states during
            multi-step reasoning.
          </p>
          <div className="status-strip">
            Directions are research territory, not promised papers. Nothing here is a
            completed experiment unless cited as published work.
          </div>
        </div>
      </Panel>

      <Panel id="questions">
        <Reveal>
          <Kicker>Motivation</Kicker>
          <h2>The questions RC asks</h2>
        </Reveal>
        <Stagger className="mt-6 grid gap-2">
          {rcQuestions.map((q, i) => (
            <StaggerItem key={q}>
              <div className="card flex gap-4">
                <span className="tag shrink-0">Q{i + 1}</span>
                <p className="!mb-0 font-medium">{q}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Panel>

      <Panel id="stakes">
        <Reveal>
          <Kicker>Why it matters</Kicker>
          <h2>Three stakes</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {whyItMatters.map((item) => (
            <Reveal key={item.title}>
              <div className="card h-full">
                <h3>{item.title}</h3>
                <p className="!mb-0 text-[0.9rem] text-[var(--muted)]">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="chain">
        <Reveal>
          <Kicker>Evidence chain</Kicker>
          <h2>From behaviour to mechanism</h2>
        </Reveal>
        <div className="mt-6 space-y-3">
          {evidenceChain.map((step, i) => (
            <Reveal key={step} delay={i * 0.03}>
              <div className="flex gap-4">
                <div className="tag mt-1 shrink-0 tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                <div className="card flex-1 !py-3">
                  <p className="!mb-0 text-[0.92rem]">{step}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="strands">
        <Reveal>
          <Kicker>Separation</Kicker>
          <h2>RC is not RvC or RR</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {strands.map((s) => (
            <Reveal key={s.id}>
              <div className={`card h-full ${s.id === "RC" ? "hl" : ""}`}>
                <div className="tag">{s.id}</div>
                <h3 className="mt-2">{s.name}</h3>
                <p className="text-[0.9rem] text-[var(--muted)]">{s.question}</p>
                <p className="!mb-0 border-t border-[var(--rule)] pt-3 text-[0.8rem]">
                  {s.relation}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="caption">
          Sibling site:{" "}
          <a
            href="https://adya6714.github.io/retrieval-vs-computation/"
            target="_blank"
            rel="noreferrer"
          >
            Retrieval vs Computation
          </a>
          .
        </p>
      </Panel>

      <Panel id="ladder">
        <Reveal>
          <Kicker>Claim discipline</Kicker>
          <h2>Evidence ladder</h2>
          <EvidenceLadder />
        </Reveal>
      </Panel>

      <Panel id="pillars">
        <Reveal>
          <Kicker>Four pillars · thirteen directions</Kicker>
          <h2>How the programme is organised</h2>
        </Reveal>
        <div className="mt-6 mb-8 grid gap-3 sm:grid-cols-2">
          {pillars.map((p) => (
            <Reveal key={p.id}>
              <div className="card">
                <div className="tag">Pillar {p.id}</div>
                <h3 className="mt-1">{p.title}</h3>
                <p className="text-[0.9rem] text-[var(--muted)]">{p.question}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.directions.map((d) => (
                    <span key={d} className="chip !cursor-default !py-1 !px-2 text-[0.75rem]">
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
      </Panel>

      <Panel id="toolkit">
        <Reveal>
          <Kicker>Interpretability toolkit</Kicker>
          <h2>Five layers</h2>
        </Reveal>
        <div className="mt-6 grid gap-2 lg:grid-cols-5">
          {toolkit.map((t) => (
            <Reveal key={t.layer}>
              <div className="card h-full">
                <div className="tag">{t.layer}</div>
                <p className="mt-2 !mb-1 text-[0.9rem] font-medium">{t.job}</p>
                <p className="!mb-2 text-[0.78rem] text-[var(--muted)]">{t.methods}</p>
                <p className="!mb-0 border-t border-[var(--rule)] pt-2 text-[0.72rem] text-[var(--amber)]">
                  {t.caveat}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="roadmap">
        <Reveal>
          <Kicker>Roadmap</Kicker>
          <h2>Phases 0 → 3</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r) => (
            <Reveal key={r.phase}>
              <div className="card h-full">
                <div
                  className="text-3xl text-[var(--accent)]"
                  style={{ fontFamily: "var(--serif)" }}
                >
                  {r.phase}
                </div>
                <h3 className="mt-1">{r.title}</h3>
                <p className="text-[0.88rem] text-[var(--muted)]">{r.goal}</p>
                <p className="!mb-0 text-[0.78rem] font-medium">{r.outputs}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link href="/direction-1" className="btn primary mt-8 inline-block !no-underline">
          Open Direction 1 →
        </Link>
      </Panel>
    </div>
  );
}

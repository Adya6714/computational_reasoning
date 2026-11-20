"use client";

import Link from "next/link";
import { Panel, Kicker } from "@/components/Section";
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
      <Panel id="d1-hero" center>
        <div className="lattice" aria-hidden />
        <div className="relative z-[2]">
          <Kicker>Layer 03 · Paper 1 · Research Direction 1</Kicker>
          <h1>Error propagation</h1>
          <p
            className="mt-2 max-w-[54ch] text-[1.15rem] text-[var(--muted)]"
            style={{ fontFamily: "var(--serif)" }}
          >
            {oneLiner}
          </p>
          <div className="status-strip">
            <strong className="text-[var(--ink)]">Research question.</strong> How do
            incorrect intermediate values causally influence subsequent computation in
            language models, and what determines whether those errors are propagated or
            corrected?
          </div>
        </div>
      </Panel>

      <Panel id="problem">
        <Reveal>
          <Kicker>Problem</Kicker>
          <h2>Same outputs, different computations</h2>
          <p className="lede">
            When a model generates an incorrect intermediate value and later consumes it,
            several behaviours are possible. They can produce similar outputs while implying
            very different internal computations — and they are not mutually exclusive.
          </p>
        </Reveal>
        <Stagger className="mt-6 grid gap-2 sm:grid-cols-2">
          {paper1Behaviours.map((b, i) => (
            <StaggerItem key={b}>
              <div className="card flex gap-3">
                <span className="tag shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="!mb-0 font-medium">{b}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Panel>

      <Panel id="interventions">
        <Reveal>
          <Kicker>W · S · P</Kicker>
          <h2>Intervention playground</h2>
          <InterventionPlayground />
        </Reveal>
      </Panel>

      <Panel id="rqs">
        <Reveal>
          <Kicker>Research questions</Kicker>
          <h2>What Direction 1 asks</h2>
        </Reveal>
        <div className="mt-6 grid gap-2">
          {researchQuestions.map((rq) => (
            <Reveal key={rq.id}>
              <div className="card grid gap-2 sm:grid-cols-[5rem_1fr_auto] sm:items-start">
                <div
                  className="text-2xl text-[var(--accent)]"
                  style={{ fontFamily: "var(--serif)" }}
                >
                  {rq.id}
                </div>
                <p className="!mb-0 font-medium">{rq.q}</p>
                <span className="chip !cursor-default self-start text-[0.72rem]">
                  {rq.role}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="gap">
        <Reveal>
          <Kicker>Gap (candidate, not novelty-validated)</Kicker>
          <h2>What is still insufficiently characterized</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {gapPoints.map((g) => (
            <Reveal key={g.title}>
              <div className="card h-full">
                <h3 className="!text-[1.05rem]">{g.title}</h3>
                <p className="!mb-0 text-[0.88rem] text-[var(--muted)]">{g.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="explanations">
        <Reveal>
          <Kicker>Competing explanations</Kicker>
          <h2>Flip a card — claim vs Paper 1 prediction</h2>
          <ExplanationGrid />
          <p className="caption">
            These are not mutually exclusive. The objective is to identify which information
            causally affects downstream computation under stated conditions.
          </p>
        </Reveal>
      </Panel>

      <Panel id="contribution">
        <Reveal>
          <Kicker>Contribution boundary</Kicker>
          <h2>What Paper 1 can claim — if supported</h2>
          <div className="card !bg-[var(--paper)]">
            <p className="!mb-0 text-[1.05rem] leading-relaxed">{contribution.proposed}</p>
          </div>
        </Reveal>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {contribution.hierarchy.map((h) => (
            <Reveal key={h.tier}>
              <div className="card">
                <div className="tag">{h.tier}</div>
                <p className="mt-2 !mb-0 text-[0.9rem]">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="test-plan">
        <Reveal>
          <Kicker>How it will be tested</Kicker>
          <h2>Design summary</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {testPlan.map((t) => (
            <Reveal key={t.title}>
              <div className="card h-full">
                <h3>{t.title}</h3>
                <p className="!mb-0 text-[0.88rem] text-[var(--muted)]">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="phases">
        <Reveal>
          <Kicker>Implementation</Kicker>
          <h2>Phase map 0 → 3</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 lg:grid-cols-4">
          {phaseMap.map((p) => (
            <Reveal key={p.phase}>
              <div className="card h-full">
                <div
                  className="text-4xl text-[var(--accent)]"
                  style={{ fontFamily: "var(--serif)" }}
                >
                  {p.phase}
                </div>
                <h3 className="mt-1">{p.title}</h3>
                <p className="text-[0.88rem] text-[var(--muted)]">{p.goal}</p>
                <p className="!mb-1 border-t border-[var(--rule)] pt-3 text-[0.8rem] font-medium">
                  {p.outputs}
                </p>
                <p className="!mb-0 text-[0.72rem] text-[var(--muted)]">{p.who}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="rules">
        <Reveal>
          <Kicker>Ground rules</Kicker>
          <h2>What may happen now</h2>
        </Reveal>
        <div className="mt-6 grid gap-2">
          {groundRules.map((rule) => (
            <Reveal key={rule}>
              <div className="status-strip !mt-0">{rule}</div>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel id="loop">
        <Reveal>
          <Kicker>Full loop</Kicker>
          <h2>Pipeline → Programme → Direction 1</h2>
          <p className="lede">
            Revisit the SOP, or return home to walk the three layers again.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/pipeline" className="btn !no-underline">
              Pipeline
            </Link>
            <Link href="/programme" className="btn !no-underline">
              Programme
            </Link>
            <Link href="/" className="btn primary !no-underline">
              Overview
            </Link>
          </div>
        </Reveal>
      </Panel>
    </div>
  );
}

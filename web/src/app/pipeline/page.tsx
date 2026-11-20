"use client";

import Link from "next/link";
import { PageHero, SectionBlock } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { LifecycleExplorer } from "@/components/pipeline/LifecycleExplorer";
import { PhaseTabs } from "@/components/pipeline/PhaseTabs";
import { GateSystem } from "@/components/pipeline/GateSystem";
import { Marquee } from "@/components/Marquee";

export default function PipelinePage() {
  return (
    <div>
      <PageHero
        kicker="Layer 01 · Standard operating procedure"
        title="Research Pipeline"
        subtitle="A gate-based protocol for building papers: establish what you are investigating, why it matters, what is missing, and how you will know your conclusions are valid — before you write the Introduction."
        accent="var(--vermillion)"
      />

      <Marquee
        items={[
          "Problem → Literature → Gap → RQs → Novelty → Method → Run → Analyse → Draft → Submit",
        ]}
      />

      <SectionBlock
        eyebrow="10 stages"
        title="The research lifecycle — click any stage"
      >
        <Reveal>
          <LifecycleExplorer />
        </Reveal>
      </SectionBlock>

      <div className="border-y-2 border-ink bg-paper-2/60">
        <SectionBlock
          eyebrow="Phases 1–7 + RDD"
          title="What to establish at each phase"
        >
          <Reveal>
            <PhaseTabs />
          </Reveal>
        </SectionBlock>
      </div>

      <SectionBlock
        eyebrow="Approvals, not a writing checklist"
        title="Research readiness gates"
      >
        <Reveal>
          <GateSystem />
        </Reveal>
      </SectionBlock>

      <section className="border-t-2 border-ink bg-cobalt text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="mono text-xs uppercase tracking-[0.2em] text-white/70">
              Next layer
            </div>
            <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
              Apply the pipeline to RC
            </h2>
            <p className="mt-2 max-w-xl text-white/80">
              The programme turns this SOP into four pillars, thirteen directions, and an
              evidence ladder for mechanistic work on LLM reasoning.
            </p>
          </div>
          <Link
            href="/programme"
            className="sharp-btn bg-acid px-5 py-3 font-bold text-ink"
          >
            Open the programme →
          </Link>
        </div>
      </section>
    </div>
  );
}

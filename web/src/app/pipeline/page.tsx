"use client";

import Link from "next/link";
import { Panel, Kicker } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { LifecycleExplorer } from "@/components/pipeline/LifecycleExplorer";
import { PhaseTabs } from "@/components/pipeline/PhaseTabs";
import { GateSystem } from "@/components/pipeline/GateSystem";

export default function PipelinePage() {
  return (
    <div>
      <Panel id="pipeline-hero" center>
        <div className="lattice" aria-hidden />
        <div className="relative z-[2]">
          <Kicker>Layer 01 · Standard operating procedure</Kicker>
          <h1>Research pipeline</h1>
          <p className="lede">
            You should not begin by opening a document and writing the Introduction. First
            establish what you are investigating, why it matters, what is missing, what you
            intend to demonstrate, and how you will know your conclusions are valid.
          </p>
          <div className="status-strip">
            Think of research-paper development as a sequence of gates. Each stage produces
            a concrete artifact that you verify before moving to the next.
          </div>
        </div>
      </Panel>

      <Panel id="lifecycle">
        <Reveal>
          <Kicker>10 stages</Kicker>
          <h2>The research lifecycle</h2>
          <p className="caption !mt-0">
            From an initial idea to submission. Click any stage, or step through with Prev /
            Next.
          </p>
          <LifecycleExplorer />
        </Reveal>
      </Panel>

      <Panel id="phases">
        <Reveal>
          <Kicker>Phases 1–7 + RDD</Kicker>
          <h2>What to establish at each phase</h2>
          <PhaseTabs />
        </Reveal>
      </Panel>

      <Panel id="gates">
        <Reveal>
          <Kicker>Approvals, not a writing checklist</Kicker>
          <h2>Research readiness gates</h2>
          <GateSystem />
        </Reveal>
      </Panel>

      <Panel id="next">
        <Reveal>
          <Kicker>Next layer</Kicker>
          <h2>Apply the pipeline to RC</h2>
          <p className="lede">
            The programme turns this SOP into four pillars, thirteen directions, and an
            evidence ladder for mechanistic work on LLM reasoning.
          </p>
          <Link href="/programme" className="btn primary inline-block !no-underline mt-2">
            Open the programme →
          </Link>
        </Reveal>
      </Panel>
    </div>
  );
}

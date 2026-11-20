"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { LeftSidebar } from "./LeftSidebar";
import { RightPanel } from "./RightPanel";
import { BottomPanel } from "./BottomPanel";
import { CircuitGraph } from "./CircuitGraph";
import { ExperimentExplorer } from "./ExperimentExplorer";
import { getModel } from "../data/models";
import { DEMO_CIRCUITS } from "../data/circuits.demo";
import { DEMO_EXPERIMENTS } from "../data/experiments.demo";
import { useAtlasStore } from "../store";

const ModelScene = dynamic(
  () => import("./ModelScene").then((m) => m.ModelScene),
  {
    ssr: false,
    loading: () => (
      <div className="atlas-empty">
        <p>Loading 3D atlas…</p>
      </div>
    ),
  },
);

export function AtlasShell() {
  const modelId = useAtlasStore((s) => s.modelId);
  const view = useAtlasStore((s) => s.view);
  const circuitId = useAtlasStore((s) => s.circuitId);
  const experimentId = useAtlasStore((s) => s.experimentId);
  const model = getModel(modelId);
  const circuit = DEMO_CIRCUITS.find((c) => c.id === circuitId) ?? DEMO_CIRCUITS[0];
  const experiment =
    DEMO_EXPERIMENTS.find((e) => e.id === experimentId) ?? DEMO_EXPERIMENTS[0];

  return (
    <div className="atlas-root">
      <header className="atlas-topbar">
        <Link href="/" className="atlas-back">
          ← RC site
        </Link>
        <div className="atlas-top-title">
          The Model Atlas · Explore the internal anatomy of a language model
        </div>
        <div className="atlas-top-meta">
          {model.name} · {view}
        </div>
      </header>

      <div className="atlas-body">
        <LeftSidebar />

        <main className="atlas-workspace">
          {view === "architecture" && <ModelScene model={model} />}
          {view === "circuit" && (
            <div className="atlas-workspace-pane">
              <h2>{circuit.title}</h2>
              <p className="atlas-muted">{circuit.summary}</p>
              <CircuitGraph circuit={circuit} />
            </div>
          )}
          {view === "experiment" && (
            <div className="atlas-workspace-pane">
              <h2>{experiment.title}</h2>
              <ExperimentExplorer experiment={experiment} />
            </div>
          )}
        </main>

        <RightPanel />
      </div>

      <BottomPanel />
    </div>
  );
}

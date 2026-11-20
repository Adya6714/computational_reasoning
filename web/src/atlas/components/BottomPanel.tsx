"use client";

import { getModel } from "../data/models";
import { DEMO_EXPERIMENTS } from "../data/experiments.demo";
import { useAtlasStore } from "../store";

export function BottomPanel() {
  const modelId = useAtlasStore((s) => s.modelId);
  const view = useAtlasStore((s) => s.view);
  const enteredBlock = useAtlasStore((s) => s.enteredBlock);
  const experimentId = useAtlasStore((s) => s.experimentId);
  const experimentStep = useAtlasStore((s) => s.experimentStep);
  const setExperimentStep = useAtlasStore((s) => s.setExperimentStep);
  const enterBlock = useAtlasStore((s) => s.enterBlock);
  const model = getModel(modelId);
  const exp = DEMO_EXPERIMENTS.find((e) => e.id === experimentId);

  return (
    <footer className="atlas-bottom">
      <div className="atlas-bottom-row">
        <div>
          <div className="atlas-kicker">Layer scrubber</div>
          {model.status === "verified_config" ? (
            <input
              type="range"
              min={0}
              max={model.numLayers - 1}
              value={enteredBlock ?? 0}
              onChange={(e) => enterBlock(Number(e.target.value))}
              className="atlas-range"
            />
          ) : (
            <span className="atlas-muted">Unavailable for candidate models</span>
          )}
          <span className="atlas-muted atlas-tiny">
            Focus L{enteredBlock ?? "—"} / {model.numLayers || "—"}
          </span>
        </div>

        {view === "experiment" && exp && (
          <div>
            <div className="atlas-kicker">Experiment progression</div>
            <input
              type="range"
              min={0}
              max={exp.steps.length - 1}
              value={experimentStep}
              onChange={(e) => setExperimentStep(Number(e.target.value))}
              className="atlas-range"
            />
            <span className="atlas-muted atlas-tiny">
              Step {experimentStep + 1}: {exp.steps[experimentStep]?.label}
            </span>
          </div>
        )}

        <div>
          <div className="atlas-kicker">Integrity</div>
          <p className="atlas-muted atlas-tiny" style={{ margin: 0, maxWidth: 360 }}>
            Architecture metadata for Qwen3-8B is verified from Hugging Face config.json.
            Neurons, circuits, and the 17+28 experiment are demonstration fixtures.
          </p>
        </div>
      </div>
    </footer>
  );
}

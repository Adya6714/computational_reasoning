"use client";

import type { ExperimentRecord } from "../types";
import { useAtlasStore } from "../store";

export function ExperimentExplorer({ experiment }: { experiment: ExperimentRecord }) {
  const step = useAtlasStore((s) => s.experimentStep);
  const setStep = useAtlasStore((s) => s.setExperimentStep);
  const condition = useAtlasStore((s) => s.experimentCondition);
  const setCondition = useAtlasStore((s) => s.setExperimentCondition);
  const select = useAtlasStore((s) => s.select);
  const setView = useAtlasStore((s) => s.setView);
  const enterBlock = useAtlasStore((s) => s.enterBlock);

  const current = experiment.steps[step] ?? experiment.steps[0];
  const cond = experiment.conditions.find((c) => c.id === condition);

  return (
    <div className="atlas-experiment">
      <div className="atlas-banner-demo">
        DEMONSTRATION MODE — no measured activations or intervention logs are attached.
      </div>

      <div className="atlas-exp-grid">
        <div>
          <div className="atlas-kicker">Prompt</div>
          <pre className="atlas-code">{experiment.prompt}</pre>
          <div className="atlas-kicker">Generated trace (demo)</div>
          <ol className="atlas-trace">
            {experiment.trace.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>

        <div>
          <div className="atlas-kicker">Tokens</div>
          <div className="atlas-token-row">
            {experiment.tokens.map((tok, i) => (
              <button
                key={`${tok}-${i}`}
                type="button"
                className="atlas-token"
                onClick={() =>
                  select({
                    kind: "token",
                    id: `tok-${i}`,
                    label: `Token “${tok}”`,
                  })
                }
              >
                {tok}
              </button>
            ))}
          </div>

          <div className="atlas-kicker" style={{ marginTop: "1rem" }}>
            Condition
          </div>
          <div className="atlas-chip-row">
            {experiment.conditions.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`atlas-chip ${condition === c.id ? "active" : ""}`}
                onClick={() => setCondition(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {cond && (
            <p className="atlas-muted">
              Outcome: <strong>{cond.outcome}</strong> — {cond.note}
            </p>
          )}
        </div>
      </div>

      <div className="atlas-kicker">Layer timeline</div>
      <div className="atlas-timeline">
        {experiment.steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`atlas-timeline-step ${step === i ? "active" : ""}`}
            onClick={() => {
              setStep(i);
              select({
                kind: "block",
                id: `exp-step-${s.id}`,
                layer: s.layerHint,
                label: s.label,
              });
            }}
          >
            <span className="n">{i + 1}</span>
            <span>
              <strong>{s.label}</strong>
              {typeof s.layerHint === "number" && (
                <em> · L{s.layerHint}</em>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="atlas-card">
        <strong>{current.label}</strong>
        <p className="atlas-muted">{current.note}</p>
        {typeof current.layerHint === "number" && (
          <button
            type="button"
            className="atlas-btn primary"
            onClick={() => {
              setView("architecture");
              enterBlock(current.layerHint!);
            }}
          >
            Open L{current.layerHint} in 3D atlas
          </button>
        )}
      </div>
    </div>
  );
}

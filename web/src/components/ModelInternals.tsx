"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type HypothesisId =
  | "copy"
  | "recompute"
  | "latent"
  | "routing"
  | "verify";

const hypotheses: {
  id: HypothesisId;
  label: string;
  claim: string;
  paths: { from: string; to: string; w: number }[];
  layers: number[];
  neurons: number[];
}[] = [
  {
    id: "copy",
    label: "Copy written value",
    claim: "Later steps read the most recent written token (W).",
    paths: [
      { from: "W", to: "attn", w: 0.95 },
      { from: "attn", to: "out", w: 0.9 },
      { from: "S", to: "attn", w: 0.15 },
      { from: "P", to: "mlp", w: 0.2 },
    ],
    layers: [0.2, 0.25, 0.35, 0.55, 0.8, 0.92, 0.85, 0.7],
    neurons: [0.1, 0.2, 0.85, 0.9, 0.3, 0.15, 0.7, 0.8, 0.2, 0.1, 0.4, 0.75],
  },
  {
    id: "recompute",
    label: "Recompute from source",
    claim: "The model rebuilds the value from original facts (S).",
    paths: [
      { from: "S", to: "mlp", w: 0.92 },
      { from: "mlp", to: "out", w: 0.88 },
      { from: "W", to: "attn", w: 0.2 },
      { from: "P", to: "attn", w: 0.35 },
    ],
    layers: [0.7, 0.75, 0.8, 0.65, 0.45, 0.35, 0.4, 0.55],
    neurons: [0.8, 0.75, 0.2, 0.15, 0.85, 0.7, 0.2, 0.25, 0.9, 0.6, 0.3, 0.2],
  },
  {
    id: "latent",
    label: "Pre-write latent state",
    claim: "Internal state formed before writing (P) drives the next step.",
    paths: [
      { from: "P", to: "mlp", w: 0.9 },
      { from: "P", to: "attn", w: 0.7 },
      { from: "attn", to: "out", w: 0.75 },
      { from: "mlp", to: "out", w: 0.8 },
      { from: "W", to: "attn", w: 0.25 },
    ],
    layers: [0.85, 0.9, 0.88, 0.7, 0.5, 0.35, 0.3, 0.25],
    neurons: [0.3, 0.85, 0.9, 0.4, 0.2, 0.8, 0.75, 0.3, 0.2, 0.7, 0.85, 0.4],
  },
  {
    id: "routing",
    label: "Routing / selection",
    claim: "Correct value is present; the wrong channel is selected.",
    paths: [
      { from: "W", to: "attn", w: 0.6 },
      { from: "S", to: "attn", w: 0.6 },
      { from: "P", to: "attn", w: 0.55 },
      { from: "attn", to: "out", w: 0.85 },
      { from: "mlp", to: "out", w: 0.3 },
    ],
    layers: [0.4, 0.5, 0.65, 0.8, 0.75, 0.6, 0.55, 0.5],
    neurons: [0.5, 0.55, 0.6, 0.65, 0.5, 0.45, 0.7, 0.55, 0.5, 0.6, 0.55, 0.5],
  },
  {
    id: "verify",
    label: "Correctness gating",
    claim: "A correctness signal modulates whether W is trusted.",
    paths: [
      { from: "W", to: "attn", w: 0.5 },
      { from: "P", to: "mlp", w: 0.7 },
      { from: "mlp", to: "attn", w: 0.65 },
      { from: "attn", to: "out", w: 0.7 },
      { from: "S", to: "mlp", w: 0.4 },
    ],
    layers: [0.35, 0.4, 0.55, 0.7, 0.85, 0.8, 0.6, 0.45],
    neurons: [0.4, 0.35, 0.7, 0.75, 0.45, 0.8, 0.3, 0.35, 0.65, 0.7, 0.4, 0.55],
  },
];

const nodePos: Record<string, { x: number; y: number }> = {
  W: { x: 70, y: 40 },
  S: { x: 70, y: 120 },
  P: { x: 70, y: 200 },
  attn: { x: 260, y: 80 },
  mlp: { x: 260, y: 180 },
  out: { x: 450, y: 130 },
};

export function ModelInternals() {
  const [hyp, setHyp] = useState<HypothesisId>("copy");
  const [strength, setStrength] = useState(0.75);
  const [focusLayer, setFocusLayer] = useState(4);

  const active = hypotheses.find((h) => h.id === hyp)!;

  const scaledPaths = useMemo(
    () =>
      active.paths.map((p) => ({
        ...p,
        w: Math.min(1, p.w * (0.35 + strength * 0.9)),
      })),
    [active, strength],
  );

  const layerHeights = useMemo(
    () =>
      active.layers.map((v, i) => {
        const dist = Math.abs(i - focusLayer);
        const boost = dist === 0 ? 1.15 : dist === 1 ? 1.05 : 1;
        return Math.min(1, v * strength * boost);
      }),
    [active, strength, focusLayer],
  );

  const neurons = useMemo(
    () =>
      active.neurons.map((v, i) => {
        const layerBias = 1 - Math.abs((i % 8) - focusLayer) / 8;
        return Math.min(1, v * strength * (0.55 + layerBias * 0.55));
      }),
    [active, strength, focusLayer],
  );

  return (
    <div className="internals">
      <div className="internals-head">
        <div>
          <div className="kicker" style={{ marginBottom: "0.4rem" }}>
            Interactive · model internals sketch
          </div>
          <h3 style={{ marginBottom: "0.35rem" }}>What lights up under each hypothesis</h3>
          <p className="caption" style={{ marginTop: 0 }}>
            Pick a hypothesis. Watch residual layers, a tiny circuit graph, and neuron
            activations rearrange. This is a teaching sketch — not a real model run.
          </p>
        </div>
      </div>

      <div className="hyp-row">
        {hypotheses.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`hyp-chip ${hyp === h.id ? "active" : ""}`}
            onClick={() => setHyp(h.id)}
          >
            {h.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={hyp}
          className="hyp-claim"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {active.claim}
        </motion.p>
      </AnimatePresence>

      <div className="ctrl-row">
        <label className="ctrl">
          <span>Intervention strength</span>
          <input
            type="range"
            min={0.15}
            max={1}
            step={0.01}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
          />
          <em>{Math.round(strength * 100)}%</em>
        </label>
        <label className="ctrl">
          <span>Focus layer</span>
          <input
            type="range"
            min={0}
            max={7}
            step={1}
            value={focusLayer}
            onChange={(e) => setFocusLayer(Number(e.target.value))}
          />
          <em>L{focusLayer}</em>
        </label>
      </div>

      <div className="internals-grid">
        {/* Layer stack */}
        <div className="panel-soft">
          <div className="tag">Residual stream</div>
          <div className="layer-stack">
            {layerHeights.map((h, i) => (
              <button
                key={i}
                type="button"
                className={`layer-row ${focusLayer === i ? "focused" : ""}`}
                onClick={() => setFocusLayer(i)}
              >
                <span className="layer-id">L{i}</span>
                <span className="layer-track">
                  <motion.span
                    className="layer-fill"
                    animate={{ scaleX: h, opacity: 0.35 + h * 0.65 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  />
                </span>
                <span className="layer-val">{h.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Circuit graph */}
        <div className="panel-soft">
          <div className="tag">Circuit graph</div>
          <svg viewBox="0 0 520 250" className="circuit">
            {scaledPaths.map((p) => {
              const a = nodePos[p.from];
              const b = nodePos[p.to];
              return (
                <motion.line
                  key={`${p.from}-${p.to}`}
                  x1={a.x + 28}
                  y1={a.y + 16}
                  x2={b.x}
                  y2={b.y + 16}
                  stroke="var(--accent)"
                  strokeLinecap="round"
                  initial={false}
                  animate={{
                    strokeWidth: 1 + p.w * 4,
                    opacity: 0.15 + p.w * 0.75,
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
            {Object.entries(nodePos).map(([id, pos]) => {
              const involved = scaledPaths.some(
                (p) => p.from === id || p.to === id,
              );
              const glow = involved
                ? Math.max(
                    ...scaledPaths
                      .filter((p) => p.from === id || p.to === id)
                      .map((p) => p.w),
                    0.2,
                  )
                : 0.15;
              return (
                <g key={id}>
                  <motion.rect
                    x={pos.x}
                    y={pos.y}
                    width={56}
                    height={32}
                    rx={10}
                    fill="var(--paper)"
                    stroke="var(--accent)"
                    initial={false}
                    animate={{
                      strokeWidth: 1 + glow,
                      opacity: 0.55 + glow * 0.45,
                    }}
                  />
                  <text
                    x={pos.x + 28}
                    y={pos.y + 20}
                    textAnchor="middle"
                    fill="var(--ink)"
                    fontSize="11"
                    fontFamily="var(--sans)"
                  >
                    {id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Neurons */}
        <div className="panel-soft neurons-panel">
          <div className="tag">Neuron activations</div>
          <div className="neuron-grid">
            {neurons.map((v, i) => (
              <motion.div
                key={i}
                className="neuron"
                title={`n${i}: ${v.toFixed(2)}`}
                animate={{
                  scale: 0.7 + v * 0.55,
                  opacity: 0.25 + v * 0.75,
                  backgroundColor:
                    v > 0.65
                      ? "var(--accent)"
                      : v > 0.4
                        ? "color-mix(in srgb, var(--accent) 55%, var(--teal))"
                        : "var(--rule)",
                }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
              />
            ))}
          </div>
          <p className="caption" style={{ marginBottom: 0 }}>
            Brighter cells = stronger hypothetical activation under the selected story.
          </p>
        </div>
      </div>
    </div>
  );
}

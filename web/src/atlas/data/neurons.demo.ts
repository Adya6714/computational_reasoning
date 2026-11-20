import type { NeuronRecord } from "../types";

const demoProv = {
  class: "demonstration" as const,
  source: "atlas/demo",
  method: "synthetic teaching artifact",
  note: "NOT measured activations. Illustrates the inspection UI only.",
  checkedAt: "2026-11-20",
};

/** Sparse demo subset — never claim these are real Qwen3-8B neurons. */
export const DEMO_NEURONS: NeuronRecord[] = [
  {
    id: "L12.mlp.n2048",
    layer: 12,
    component: "mlp",
    index: 2048,
    activationDemo: 0.82,
    topTokensDemo: [
      { token: "45", score: 0.71 },
      { token: "sum", score: 0.44 },
      { token: "+", score: 0.38 },
    ],
    saeFeatureId: "demo-sae-L12-091",
    explanation: "Auto placeholder: may fire on numeric carry-like tokens.",
    explanationStatus: "auto_unvalidated",
    provenance: demoProv,
  },
  {
    id: "L18.mlp.n512",
    layer: 18,
    component: "mlp",
    index: 512,
    activationDemo: 0.61,
    topTokensDemo: [
      { token: "wrong", score: 0.52 },
      { token: "error", score: 0.41 },
      { token: "recompute", score: 0.29 },
    ],
    explanationStatus: "none",
    provenance: demoProv,
  },
  {
    id: "L24.attn.h3",
    layer: 24,
    component: "attn",
    index: 3,
    activationDemo: 0.74,
    topTokensDemo: [
      { token: "17", score: 0.66 },
      { token: "28", score: 0.63 },
      { token: "=", score: 0.31 },
    ],
    saeFeatureId: "demo-sae-L24-003",
    explanation: "Auto placeholder: attend to operand span in toy arithmetic prompts.",
    explanationStatus: "auto_unvalidated",
    provenance: demoProv,
  },
  {
    id: "L30.mlp.n100",
    layer: 30,
    component: "mlp",
    index: 100,
    activationDemo: 0.39,
    topTokensDemo: [
      { token: "45", score: 0.55 },
      { token: "answer", score: 0.33 },
    ],
    explanationStatus: "none",
    provenance: demoProv,
  },
  {
    id: "L6.mlp.n777",
    layer: 6,
    component: "mlp",
    index: 777,
    activationDemo: 0.28,
    topTokensDemo: [
      { token: "the", score: 0.22 },
      { token: "a", score: 0.19 },
    ],
    explanationStatus: "none",
    provenance: demoProv,
  },
];

import type { ExperimentRecord } from "../types";

export const DEMO_EXPERIMENTS: ExperimentRecord[] = [
  {
    id: "exp-17-28-demo",
    title: "17 + 28 · demonstration trace",
    prompt: "Solve step by step. 17 + 28 = ?",
    answer: "45",
    mode: "demonstration",
    tokens: ["Solve", "step", "by", "step", ".", "17", "+", "28", "=", "?"],
    trace: [
      "17 + 28",
      "7 + 8 = 15, write 5 carry 1",
      "1 + 2 + 1 = 4",
      "answer 45",
    ],
    steps: [
      {
        id: "s0",
        label: "Embed operands",
        layerHint: 0,
        note: "Demo: embedding / early residual carries token identity.",
      },
      {
        id: "s1",
        label: "Form intermediate sum features",
        layerHint: 12,
        note: "Demo: mid-layer MLP units in the teaching sketch light up.",
      },
      {
        id: "s2",
        label: "Bind written intermediate",
        layerHint: 18,
        note: "Demo stand-in for a written value W in a CoT trace.",
      },
      {
        id: "s3",
        label: "Next-step consumption",
        layerHint: 24,
        note: "Demo: attention head sketch reads W / S / P channels.",
      },
      {
        id: "s4",
        label: "Final answer logits",
        layerHint: 35,
        note: "Demo: LM head prefers token 45 in the correct condition.",
      },
    ],
    conditions: [
      {
        id: "correct",
        label: "Correct computation",
        outcome: "45",
        note: "Demonstration narrative only — no cached activations.",
      },
      {
        id: "wrong_w",
        label: "Incorrect written value (W←44)",
        outcome: "44 or 45 (depends on story)",
        note: "Illustrates Direction 1 W intervention conceptually.",
      },
      {
        id: "patch_s",
        label: "Source edit (S) with W fixed",
        outcome: "exploratory",
        note: "Shows where a real patching result would be attached.",
      },
      {
        id: "recover",
        label: "Corrected / recovered trace",
        outcome: "45",
        note: "Placeholder for free-running recovery comparison.",
      },
    ],
    provenance: {
      class: "demonstration",
      source: "atlas/demo",
      method: "synthetic experiment UI fixture",
      note: "No GPU run. No TransformerLens cache. Labels the interface for future RC pilots.",
      checkedAt: "2026-11-20",
    },
  },
];

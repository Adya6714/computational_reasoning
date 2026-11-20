"use client";

import { create } from "zustand";
import type { AtlasSelection, AtlasView } from "./types";
import { MODELS } from "./data/models";
import { DEMO_CIRCUITS } from "./data/circuits.demo";
import { DEMO_EXPERIMENTS } from "./data/experiments.demo";

type AtlasState = {
  modelId: string;
  view: AtlasView;
  selected: AtlasSelection | null;
  enteredBlock: number | null;
  selectedHead: number | null;
  circuitId: string;
  experimentId: string;
  experimentStep: number;
  experimentCondition: string;
  neuronQuery: string;
  highlightedNodeId: string | null;
  cameraResetKey: number;
  setModelId: (id: string) => void;
  setView: (v: AtlasView) => void;
  select: (s: AtlasSelection | null) => void;
  enterBlock: (layer: number | null) => void;
  setSelectedHead: (h: number | null) => void;
  setCircuitId: (id: string) => void;
  setExperimentId: (id: string) => void;
  setExperimentStep: (n: number) => void;
  setExperimentCondition: (id: string) => void;
  setNeuronQuery: (q: string) => void;
  setHighlightedNodeId: (id: string | null) => void;
  resetCamera: () => void;
};

export const useAtlasStore = create<AtlasState>((set) => ({
  modelId: MODELS[0].id,
  view: "architecture",
  selected: {
    kind: "model",
    id: MODELS[0].id,
    label: MODELS[0].name,
  },
  enteredBlock: null,
  selectedHead: null,
  circuitId: DEMO_CIRCUITS[0].id,
  experimentId: DEMO_EXPERIMENTS[0].id,
  experimentStep: 0,
  experimentCondition: DEMO_EXPERIMENTS[0].conditions[0].id,
  neuronQuery: "",
  highlightedNodeId: null,
  cameraResetKey: 0,
  setModelId: (id) => {
    const m = MODELS.find((x) => x.id === id);
    set({
      modelId: id,
      enteredBlock: null,
      selectedHead: null,
      selected: m
        ? { kind: "model", id: m.id, label: m.name }
        : null,
    });
  },
  setView: (view) => set({ view }),
  select: (selected) => set({ selected }),
  enterBlock: (enteredBlock) =>
    set({
      enteredBlock,
      selectedHead: null,
      selected:
        enteredBlock === null
          ? null
          : {
              kind: "block",
              id: `block-${enteredBlock}`,
              layer: enteredBlock,
              label: `Transformer block L${enteredBlock}`,
            },
    }),
  setSelectedHead: (selectedHead) => set({ selectedHead }),
  setCircuitId: (circuitId) => set({ circuitId }),
  setExperimentId: (experimentId) => set({ experimentId, experimentStep: 0 }),
  setExperimentStep: (experimentStep) => set({ experimentStep }),
  setExperimentCondition: (experimentCondition) => set({ experimentCondition }),
  setNeuronQuery: (neuronQuery) => set({ neuronQuery }),
  setHighlightedNodeId: (highlightedNodeId) => set({ highlightedNodeId }),
  resetCamera: () =>
    set((s) => ({ cameraResetKey: s.cameraResetKey + 1, enteredBlock: null })),
}));

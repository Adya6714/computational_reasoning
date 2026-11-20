"use client";

import { MODELS, getModel } from "../data/models";
import { DEMO_NEURONS } from "../data/neurons.demo";
import { DEMO_CIRCUITS } from "../data/circuits.demo";
import { DEMO_EXPERIMENTS } from "../data/experiments.demo";
import { useAtlasStore } from "../store";

export function LeftSidebar() {
  const modelId = useAtlasStore((s) => s.modelId);
  const setModelId = useAtlasStore((s) => s.setModelId);
  const view = useAtlasStore((s) => s.view);
  const setView = useAtlasStore((s) => s.setView);
  const enterBlock = useAtlasStore((s) => s.enterBlock);
  const select = useAtlasStore((s) => s.select);
  const neuronQuery = useAtlasStore((s) => s.neuronQuery);
  const setNeuronQuery = useAtlasStore((s) => s.setNeuronQuery);
  const circuitId = useAtlasStore((s) => s.circuitId);
  const setCircuitId = useAtlasStore((s) => s.setCircuitId);
  const experimentId = useAtlasStore((s) => s.experimentId);
  const setExperimentId = useAtlasStore((s) => s.setExperimentId);
  const resetCamera = useAtlasStore((s) => s.resetCamera);

  const model = getModel(modelId);
  const neurons = DEMO_NEURONS.filter((n) =>
    n.id.toLowerCase().includes(neuronQuery.toLowerCase()),
  );

  return (
    <aside className="atlas-side atlas-side-left">
      <div className="atlas-brand">
        <div className="atlas-kicker">Model Atlas</div>
        <h1>Internal anatomy</h1>
        <p className="atlas-muted atlas-tiny">
          Explorable map of architecture, demo neurons, candidate circuits, and toy
          experiments.
        </p>
      </div>

      <label className="atlas-field">
        <span>Model</span>
        <select
          className="atlas-select"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} · {m.status}
            </option>
          ))}
        </select>
      </label>

      <div className="atlas-chip-row">
        {(
          [
            ["architecture", "Architecture"],
            ["circuit", "Circuits"],
            ["experiment", "Experiments"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`atlas-chip ${view === id ? "active" : ""}`}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <button type="button" className="atlas-btn" onClick={resetCamera}>
        Reset camera / exit block
      </button>

      {model.status === "verified_config" && (
        <div className="atlas-section">
          <div className="atlas-kicker">Architecture tree</div>
          <button
            type="button"
            className="atlas-tree-item"
            onClick={() =>
              select({
                kind: "embedding",
                id: "embed",
                label: "Token embeddings",
              })
            }
          >
            Embeddings
          </button>
          <div className="atlas-layer-scroll">
            {Array.from({ length: model.numLayers }).map((_, i) => (
              <button
                key={i}
                type="button"
                className="atlas-tree-item"
                onClick={() => enterBlock(i)}
              >
                L{i} · block
              </button>
            ))}
          </div>
          <button
            type="button"
            className="atlas-tree-item"
            onClick={() =>
              select({ kind: "lm_head", id: "lm_head", label: "LM head" })
            }
          >
            LM head
          </button>
        </div>
      )}

      <div className="atlas-section">
        <div className="atlas-kicker">Neuron / feature search · demo</div>
        <input
          className="atlas-input"
          placeholder="e.g. L12.mlp"
          value={neuronQuery}
          onChange={(e) => setNeuronQuery(e.target.value)}
        />
        <div className="atlas-layer-scroll short">
          {neurons.map((n) => (
            <button
              key={n.id}
              type="button"
              className="atlas-tree-item"
              onClick={() => {
                setView("architecture");
                enterBlock(n.layer);
                select({
                  kind: "neuron",
                  id: n.id,
                  layer: n.layer,
                  label: n.id,
                });
              }}
            >
              {n.id}
            </button>
          ))}
        </div>
      </div>

      <div className="atlas-section">
        <div className="atlas-kicker">Circuit library · demo</div>
        {DEMO_CIRCUITS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`atlas-tree-item ${circuitId === c.id ? "on" : ""}`}
            onClick={() => {
              setCircuitId(c.id);
              setView("circuit");
            }}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="atlas-section">
        <div className="atlas-kicker">Experiment library · demo</div>
        {DEMO_EXPERIMENTS.map((e) => (
          <button
            key={e.id}
            type="button"
            className={`atlas-tree-item ${experimentId === e.id ? "on" : ""}`}
            onClick={() => {
              setExperimentId(e.id);
              setView("experiment");
            }}
          >
            {e.title}
          </button>
        ))}
      </div>
    </aside>
  );
}

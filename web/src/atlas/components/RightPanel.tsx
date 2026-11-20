"use client";

import { DEMO_NEURONS } from "../data/neurons.demo";
import { DEMO_CIRCUITS } from "../data/circuits.demo";
import { getModel } from "../data/models";
import { useAtlasStore } from "../store";

export function RightPanel() {
  const modelId = useAtlasStore((s) => s.modelId);
  const selected = useAtlasStore((s) => s.selected);
  const enteredBlock = useAtlasStore((s) => s.enteredBlock);
  const selectedHead = useAtlasStore((s) => s.selectedHead);
  const circuitId = useAtlasStore((s) => s.circuitId);
  const model = getModel(modelId);
  const neuron = DEMO_NEURONS.find((n) => n.id === selected?.id);
  const circuit = DEMO_CIRCUITS.find((c) => c.id === circuitId);
  const edge = circuit?.edges.find((e) => e.id === selected?.id);

  return (
    <aside className="atlas-side atlas-side-right">
      <div className="atlas-kicker">Inspection</div>
      <h2>{selected?.label ?? "Nothing selected"}</h2>

      {!selected && (
        <p className="atlas-muted">
          Click a block in the 3D view, a circuit node, or a neuron in the left search.
          Double-click a block to enter it.
        </p>
      )}

      {selected?.kind === "model" && (
        <div className="atlas-meta">
          <Row k="Checkpoint" v={model.checkpoint} />
          <Row k="Status" v={model.status} />
          <Row k="Layers" v={String(model.numLayers)} />
          <Row k="Hidden" v={String(model.hiddenSize)} />
          <Row k="MLP intermediate" v={String(model.intermediateSize)} />
          <Row k="Heads / KV" v={`${model.numAttentionHeads} / ${model.numKeyValueHeads}`} />
          <Row k="Head dim" v={String(model.headDim)} />
          <Row k="Vocab" v={String(model.vocabSize)} />
          <Row k="Act" v={model.hiddenAct} />
          <ProvenanceBox
            title="Provenance"
            text={`${model.provenance.source} · ${model.provenance.class}`}
            note={model.provenance.note}
          />
        </div>
      )}

      {(selected?.kind === "block" || enteredBlock !== null) && !neuron && !edge && (
        <div className="atlas-meta">
          <Row
            k="Layer"
            v={String(selected?.layer ?? enteredBlock ?? "—")}
          />
          <Row k="Attention" v={`${model.numAttentionHeads} heads · GQA ${model.numKeyValueHeads} KV`} />
          <Row k="MLP" v={`${model.hiddenSize} → ${model.intermediateSize} → ${model.hiddenSize}`} />
          <Row k="Norm" v={`RMSNorm eps=${model.rmsNormEps}`} />
          <Row k="Selected head" v={selectedHead === null ? "none" : String(selectedHead)} />
          <p className="atlas-muted atlas-tiny">
            Structure from verified config. No live activations.
          </p>
        </div>
      )}

      {selected?.kind === "attn_head" && (
        <div className="atlas-meta">
          <Row k="Type" v="Attention head" />
          <Row k="Layer" v={String(selected.layer)} />
          <Row k="Head dim" v={String(model.headDim)} />
          <ProvenanceBox
            title="Evidence"
            text="architecture only"
            note="Attention patterns are not loaded. Head geometry is structural."
          />
        </div>
      )}

      {neuron && (
        <div className="atlas-meta">
          <div className="atlas-banner-demo">DEMO NEURON — not a measured unit</div>
          <Row k="ID" v={neuron.id} />
          <Row k="Layer" v={String(neuron.layer)} />
          <Row k="Component" v={neuron.component} />
          <Row k="Demo activation" v={neuron.activationDemo.toFixed(2)} />
          <Row k="SAE feature" v={neuron.saeFeatureId ?? "—"} />
          <Row k="Explanation status" v={neuron.explanationStatus} />
          {neuron.explanation && (
            <p className="atlas-muted">{neuron.explanation}</p>
          )}
          <div className="atlas-kicker">Top tokens (demo)</div>
          <ul className="atlas-list">
            {neuron.topTokensDemo.map((t) => (
              <li key={t.token}>
                <code>{t.token}</code> · {t.score.toFixed(2)}
              </li>
            ))}
          </ul>
          <ProvenanceBox
            title="Provenance"
            text={neuron.provenance.class}
            note={neuron.provenance.note}
          />
        </div>
      )}

      {edge && (
        <div className="atlas-meta">
          <div className="atlas-banner-demo">EDGE INSPECTION</div>
          <Row k="Source" v={edge.source} />
          <Row k="Target" v={edge.target} />
          <Row k="Weight (demo)" v={edge.weight.toFixed(2)} />
          <Row k="Evidence class" v={edge.evidence} />
          <Row k="Method" v={edge.method} />
          <p className="atlas-muted">{edge.note}</p>
          <ProvenanceBox
            title="Provenance"
            text={edge.provenance.class}
            note={edge.provenance.note}
          />
        </div>
      )}

      {(selected?.kind === "embedding" || selected?.kind === "lm_head") && (
        <div className="atlas-meta">
          <Row k="Hidden size" v={String(model.hiddenSize)} />
          <Row k="Vocab" v={String(model.vocabSize)} />
          <Row k="Tie embeddings" v={String(model.tieWordEmbeddings)} />
        </div>
      )}
    </aside>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="atlas-row">
      <span>{k}</span>
      <strong>{v}</strong>
    </div>
  );
}

function ProvenanceBox({
  title,
  text,
  note,
}: {
  title: string;
  text: string;
  note?: string;
}) {
  return (
    <div className="atlas-prov">
      <div className="atlas-kicker">{title}</div>
      <div>{text}</div>
      {note && <p className="atlas-muted atlas-tiny">{note}</p>}
    </div>
  );
}

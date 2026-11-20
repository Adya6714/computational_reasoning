"use client";

import { useMemo, useState } from "react";
import type { CircuitRecord, EvidenceClass } from "../types";
import { useAtlasStore } from "../store";

const EVIDENCE_COLOR: Record<EvidenceClass, string> = {
  observed_activation: "#4da3ff",
  statistical_association: "#94a3b8",
  attribution: "#ffb020",
  intervention: "#3ddc97",
  validated_causal: "#ff6b4a",
  demonstration: "#6b7c93",
};

export function CircuitGraph({ circuit }: { circuit: CircuitRecord }) {
  const [filter, setFilter] = useState<"all" | EvidenceClass>("all");
  const highlighted = useAtlasStore((s) => s.highlightedNodeId);
  const setHighlighted = useAtlasStore((s) => s.setHighlightedNodeId);
  const select = useAtlasStore((s) => s.select);
  const setView = useAtlasStore((s) => s.setView);
  const enterBlock = useAtlasStore((s) => s.enterBlock);

  const edges = useMemo(
    () =>
      circuit.edges.filter((e) => filter === "all" || e.evidence === filter),
    [circuit.edges, filter],
  );

  const nodeMap = useMemo(
    () => Object.fromEntries(circuit.nodes.map((n) => [n.id, n])),
    [circuit.nodes],
  );

  const selectedEdge = useAtlasStore((s) =>
    s.selected?.kind === "circuit" ? s.selected.id : null,
  );

  return (
    <div className="atlas-circuit">
      <div className="atlas-circuit-toolbar">
        <span className="atlas-pill atlas-pill-warn">{circuit.status.replace("_", " ")}</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="atlas-select"
        >
          <option value="all">All edge types</option>
          {(Object.keys(EVIDENCE_COLOR) as EvidenceClass[]).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="atlas-btn"
          onClick={() => setHighlighted(null)}
        >
          Clear highlight
        </button>
      </div>

      <svg viewBox="0 0 720 300" className="atlas-circuit-svg">
        {edges.map((e) => {
          const a = nodeMap[e.source];
          const b = nodeMap[e.target];
          if (!a || !b) return null;
          const dim =
            highlighted &&
            highlighted !== e.source &&
            highlighted !== e.target;
          const active = selectedEdge === e.id;
          return (
            <g key={e.id}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={EVIDENCE_COLOR[e.evidence]}
                strokeWidth={1 + e.weight * 3}
                strokeOpacity={dim ? 0.15 : active ? 1 : 0.7}
                markerEnd="url(#arrow)"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  select({
                    kind: "circuit",
                    id: e.id,
                    label: `${e.source} → ${e.target}`,
                  })
                }
              />
            </g>
          );
        })}
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#8aa0b8" />
          </marker>
        </defs>
        {circuit.nodes.map((n) => {
          const dim = highlighted && highlighted !== n.id;
          const on = highlighted === n.id;
          return (
            <g
              key={n.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setHighlighted(n.id);
                select({
                  kind: n.kind,
                  id: n.id,
                  layer: n.layer,
                  label: n.label,
                });
              }}
              onDoubleClick={() => {
                if (typeof n.layer === "number") {
                  setView("architecture");
                  enterBlock(n.layer);
                }
              }}
            >
              <rect
                x={n.x - 48}
                y={n.y - 16}
                width={96}
                height={32}
                rx={8}
                fill={on ? "#1e3a5f" : "#121821"}
                stroke={on ? "#4da3ff" : "#2a3548"}
                strokeWidth={on ? 2 : 1}
                opacity={dim ? 0.25 : 1}
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                fill="#e8eef7"
                fontSize="11"
                fontFamily="IBM Plex Sans, system-ui, sans-serif"
                opacity={dim ? 0.25 : 1}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="atlas-legend">
        {(Object.entries(EVIDENCE_COLOR) as [EvidenceClass, string][]).map(
          ([k, c]) => (
            <span key={k} className="atlas-legend-item">
              <i style={{ background: c }} />
              {k}
            </span>
          ),
        )}
      </div>
      <p className="atlas-muted atlas-tiny">
        Double-click a layered node to jump into the 3D architecture. Edge styles encode
        evidence class — demonstration edges are not causal claims.
      </p>
    </div>
  );
}

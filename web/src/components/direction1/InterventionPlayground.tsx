"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { interventions } from "@/data/direction1";

type Mode = "W" | "S" | "P" | "combo";

export function InterventionPlayground() {
  const [mode, setMode] = useState<Mode>("W");
  const [written, setWritten] = useState(20);
  const [source, setSource] = useState(7);
  const [prewrite, setPrewrite] = useState(14);

  const nextStep = useMemo(() => {
    if (mode === "W") return written + 3;
    if (mode === "S") return source * 2;
    if (mode === "P") return prewrite + 1;
    return Math.round(written * 0.5 + source * 0.3 + prewrite * 0.2);
  }, [mode, written, source, prewrite]);

  const active = interventions.find((i) => i.id === mode) ?? interventions[0];

  return (
    <div className="shell">
      <div className="shell-top">
        <div className="flex flex-wrap gap-2">
          {([...interventions.map((i) => i.id), "combo"] as Mode[]).map((id) => (
            <button
              key={id}
              type="button"
              className={`chip ${mode === id ? "active" : ""}`}
              onClick={() => setMode(id)}
            >
              {id === "combo" ? "W + S + P" : `Intervene on ${id}`}
            </button>
          ))}
        </div>
        <div className="text-right">
          <div className="tag">Next-step output</div>
          <motion.div
            key={nextStep}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl tabular-nums"
            style={{ fontFamily: "var(--serif)" }}
          >
            {nextStep}
          </motion.div>
        </div>
      </div>

      <div className="shell-canvas space-y-5">
        <p className="caption !mt-0">
          Toy illustration of the W / S / P intervention design. Toggle which signal the
          next dependent step listens to, then scrub the values.
        </p>

        <div className="grid gap-4 lg:grid-cols-3">
          <Slider
            label="W · written value"
            value={written}
            onChange={setWritten}
            active={mode === "W" || mode === "combo"}
          />
          <Slider
            label="S · source fact"
            value={source}
            onChange={setSource}
            active={mode === "S" || mode === "combo"}
          />
          <Slider
            label="P · pre-write state"
            value={prewrite}
            onChange={setPrewrite}
            active={mode === "P" || mode === "combo"}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="status-strip !mt-0"
          >
            {mode === "combo" ? (
              <>
                Real experiments use factorial / path-specific interventions with matched
                controls. Dependence measures (D_W, D_S, D_P) estimate how much each channel
                moves the next step — then ask whether those measures predict free-running
                propagation or recovery.
              </>
            ) : (
              <>
                <strong className="text-[var(--ink)]">{active.name}.</strong> {active.detail}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <svg viewBox="0 0 640 140" className="w-full border border-[var(--rule)] bg-[var(--tint)]">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" className="text-[var(--ink)]" />
            </marker>
          </defs>
          {[
            { id: "W", x: 70, val: written },
            { id: "S", x: 230, val: source },
            { id: "P", x: 390, val: prewrite },
          ].map((node) => {
            const lit = mode === "combo" || mode === node.id;
            return (
              <g key={node.id} opacity={lit ? 1 : 0.28}>
                <rect
                  x={node.x}
                  y={40}
                  width={72}
                  height={48}
                  fill="var(--accent-soft)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
                <text
                  x={node.x + 36}
                  y={60}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize="15"
                  fontFamily="var(--serif)"
                >
                  {node.id}
                </text>
                <text
                  x={node.x + 36}
                  y={76}
                  textAnchor="middle"
                  fill="var(--muted)"
                  fontSize="11"
                >
                  {node.val}
                </text>
                <line
                  x1={node.x + 72}
                  y1={64}
                  x2={530}
                  y2={64}
                  stroke={lit ? "var(--accent)" : "var(--rule)"}
                  strokeWidth={lit ? 2 : 1}
                  markerEnd="url(#arrow)"
                />
              </g>
            );
          })}
          <rect
            x={535}
            y={40}
            width={72}
            height={48}
            fill="var(--tint2)"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
          <text
            x={571}
            y={60}
            textAnchor="middle"
            fill="var(--ink)"
            fontSize="12"
            fontFamily="var(--serif)"
          >
            NEXT
          </text>
          <text
            x={571}
            y={76}
            textAnchor="middle"
            fill="var(--accent)"
            fontSize="14"
            fontWeight="600"
          >
            {nextStep}
          </text>
        </svg>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  active,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  active: boolean;
}) {
  return (
    <div
      className={`border border-[var(--rule)] bg-[var(--paper)] p-3 ${
        active ? "border-[var(--accent)]" : "opacity-55"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[0.85rem] font-medium">{label}</span>
        <span className="tabular-nums text-[0.85rem] text-[var(--accent)]">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={40}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--accent)]"
      />
    </div>
  );
}

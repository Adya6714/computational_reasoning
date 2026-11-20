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
    // combo: weighted blend for illustration
    return Math.round(written * 0.5 + source * 0.3 + prewrite * 0.2);
  }, [mode, written, source, prewrite]);

  const active = interventions.find((i) => i.id === mode) ?? interventions[0];

  return (
    <div className="border-2 border-ink bg-white p-5 shadow-[7px_7px_0_#0b0d10] sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono text-xs uppercase tracking-[0.18em] text-muted">
            Interactive causal sketch
          </div>
          <h3 className="display mt-1 text-2xl font-extrabold sm:text-3xl">
            What drives the next step?
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Toy illustration of the W / S / P intervention design. Toggle which signal the
            next dependent step listens to, then scrub the values.
          </p>
        </div>
        <div className="border-2 border-ink bg-acid px-4 py-3 text-center">
          <div className="mono text-[10px] uppercase tracking-widest">Next-step output</div>
          <motion.div
            key={nextStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="display text-4xl font-extrabold"
          >
            {nextStep}
          </motion.div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {([...interventions.map((i) => i.id), "combo"] as Mode[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`border-2 border-ink px-4 py-2 text-sm font-bold ${
              mode === id ? "shadow-[3px_3px_0_#0b0d10]" : "bg-paper"
            }`}
            style={{
              background:
                mode === id
                  ? id === "combo"
                    ? "var(--acid)"
                    : interventions.find((x) => x.id === id)?.color
                  : undefined,
            }}
          >
            {id === "combo" ? "W + S + P" : `Intervene on ${id}`}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Slider
          label="W · written value"
          value={written}
          onChange={setWritten}
          accent="var(--vermillion)"
          active={mode === "W" || mode === "combo"}
        />
        <Slider
          label="S · source fact"
          value={source}
          onChange={setSource}
          accent="var(--cobalt)"
          active={mode === "S" || mode === "combo"}
        />
        <Slider
          label="P · pre-write state"
          value={prewrite}
          onChange={setPrewrite}
          accent="var(--teal)"
          active={mode === "P" || mode === "combo"}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-6 border-2 border-ink bg-paper p-4"
        >
          {mode === "combo" ? (
            <p className="text-sm leading-relaxed text-muted">
              Real experiments use factorial / path-specific interventions with matched
              controls. Dependence measures (D_W, D_S, D_P) estimate how much each channel
              moves the next step — then ask whether those measures predict free-running
              propagation or recovery.
            </p>
          ) : (
            <>
              <div className="font-bold">{active.name}</div>
              <p className="mt-1 text-sm text-muted">{active.detail}</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 overflow-hidden border-2 border-ink">
        <svg viewBox="0 0 640 160" className="h-auto w-full bg-ink">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f4f6f1" />
            </marker>
          </defs>
          {[
            { id: "W", x: 80, color: "#ff2d1a", val: written },
            { id: "S", x: 240, color: "#1a5cff", val: source },
            { id: "P", x: 400, color: "#00c9a7", val: prewrite },
          ].map((node) => {
            const lit = mode === "combo" || mode === node.id;
            return (
              <g key={node.id} opacity={lit ? 1 : 0.25}>
                <rect
                  x={node.x}
                  y={40}
                  width={70}
                  height={50}
                  fill={node.color}
                  stroke="#f4f6f1"
                  strokeWidth="2"
                />
                <text
                  x={node.x + 35}
                  y={62}
                  textAnchor="middle"
                  fill="#0b0d10"
                  fontSize="16"
                  fontWeight="800"
                >
                  {node.id}
                </text>
                <text
                  x={node.x + 35}
                  y={78}
                  textAnchor="middle"
                  fill="#0b0d10"
                  fontSize="11"
                >
                  {node.val}
                </text>
                <line
                  x1={node.x + 70}
                  y1={65}
                  x2={540}
                  y2={65}
                  stroke={lit ? node.color : "#5a6358"}
                  strokeWidth={lit ? 3 : 1}
                  markerEnd="url(#arrow)"
                />
              </g>
            );
          })}
          <rect x={545} y={40} width={70} height={50} fill="#f0e100" stroke="#f4f6f1" strokeWidth="2" />
          <text x={580} y={62} textAnchor="middle" fill="#0b0d10" fontSize="12" fontWeight="800">
            NEXT
          </text>
          <text x={580} y={78} textAnchor="middle" fill="#0b0d10" fontSize="14" fontWeight="700">
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
  accent,
  active,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  accent: string;
  active: boolean;
}) {
  return (
    <div
      className={`border-2 border-ink p-4 transition ${
        active ? "bg-white shadow-[4px_4px_0_#0b0d10]" : "bg-paper-2 opacity-60"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold">{label}</span>
        <span
          className="mono border-2 border-ink px-2 py-0.5 text-sm font-bold"
          style={{ background: accent }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={40}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--ink)]"
        disabled={!active && false}
      />
    </div>
  );
}

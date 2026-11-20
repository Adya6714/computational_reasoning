"use client";

import { useMemo, useState } from "react";
import { readinessGates } from "@/data/pipeline";

export function GateSystem() {
  const [approved, setApproved] = useState<Record<number, boolean>>({});

  const unlocked = useMemo(() => {
    let max = 1;
    for (const g of readinessGates) {
      if (approved[g.id]) max = g.id + 1;
      else break;
    }
    return max;
  }, [approved]);

  const progress =
    (Object.values(approved).filter(Boolean).length / readinessGates.length) * 100;

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <p className="caption !mt-0">
          Approve gates in order. Later gates stay locked until earlier ones pass —
          the same discipline before writing a manuscript.
        </p>
        <div className="shrink-0 text-[0.85rem] font-medium tabular-nums">
          {Math.round(progress)}% ready
        </div>
      </div>

      <div className="progress-track mb-5">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid gap-2">
        {readinessGates.map((gate) => {
          const isOpen = gate.id <= unlocked;
          const isDone = !!approved[gate.id];
          return (
            <button
              key={gate.id}
              type="button"
              disabled={!isOpen}
              onClick={() =>
                setApproved((prev) => {
                  if (!prev[gate.id]) return { ...prev, [gate.id]: true };
                  const next: Record<number, boolean> = {};
                  for (const g of readinessGates) {
                    if (g.id < gate.id && prev[g.id]) next[g.id] = true;
                  }
                  return next;
                })
              }
              className={`card flex w-full items-start gap-3 text-left ${
                isDone ? "hl" : ""
              } ${!isOpen ? "opacity-45" : ""}`}
            >
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border text-[0.78rem] font-semibold"
                style={{
                  borderColor: "var(--rule)",
                  background: isDone ? "var(--accent)" : "var(--paper)",
                  color: isDone ? "#fff" : "var(--ink)",
                }}
              >
                {isDone ? "✓" : gate.id}
              </span>
              <span>
                <span
                  className="block text-[1.05rem]"
                  style={{ fontFamily: "var(--serif)" }}
                >
                  {gate.name}
                </span>
                <span className="mt-1 block text-[0.88rem] text-[var(--muted)]">
                  {gate.check}
                </span>
                {!isOpen && (
                  <span className="tag mt-2 inline-block">
                    Locked — approve gate {gate.id - 1} first
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

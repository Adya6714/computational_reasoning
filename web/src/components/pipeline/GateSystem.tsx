"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="mono text-xs uppercase tracking-[0.18em] text-muted">
            Interactive gate checklist
          </div>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Approve gates in order. Later gates stay locked until earlier ones pass —
            the same discipline the programme uses before writing.
          </p>
        </div>
        <div className="mono text-right text-sm font-semibold">
          {Math.round(progress)}% ready
        </div>
      </div>

      <div className="mb-8 h-3 w-full border-2 border-ink bg-paper-2">
        <motion.div
          className="h-full bg-vermillion"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="grid gap-3">
        {readinessGates.map((gate) => {
          const isOpen = gate.id <= unlocked;
          const isDone = !!approved[gate.id];
          return (
            <motion.button
              key={gate.id}
              type="button"
              disabled={!isOpen}
              onClick={() =>
                setApproved((prev) => {
                  if (!prev[gate.id]) return { ...prev, [gate.id]: true };
                  // un-approving clears later gates
                  const next: Record<number, boolean> = {};
                  for (const g of readinessGates) {
                    if (g.id < gate.id && prev[g.id]) next[g.id] = true;
                  }
                  return next;
                })
              }
              whileTap={isOpen ? { scale: 0.985 } : undefined}
              className={`flex items-start gap-4 border-2 border-ink p-4 text-left transition-all ${
                !isOpen
                  ? "cursor-not-allowed bg-paper-2 opacity-45"
                  : isDone
                    ? "bg-teal/30 shadow-[4px_4px_0_#0b0d10]"
                    : "bg-white hover:shadow-[4px_4px_0_#0b0d10]"
              }`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink font-bold ${
                  isDone ? "bg-ink text-acid" : "bg-white"
                }`}
              >
                {isDone ? "✓" : gate.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block text-xl font-extrabold">{gate.name}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">
                  {gate.check}
                </span>
                {!isOpen && (
                  <span className="mono mt-2 inline-block text-[10px] uppercase tracking-widest text-vermillion">
                    Locked — approve gate {gate.id - 1} first
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

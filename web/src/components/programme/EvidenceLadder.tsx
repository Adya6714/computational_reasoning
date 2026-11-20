"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { evidenceLadder } from "@/data/programme";

export function EvidenceLadder() {
  const [rung, setRung] = useState(0);
  const item = evidenceLadder[rung];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2">
        {evidenceLadder.map((level, i) => {
          const active = i === rung;
          const climbed = i <= rung;
          return (
            <button
              key={level.level}
              type="button"
              onClick={() => setRung(i)}
              className={`relative flex items-center gap-4 border-2 border-ink px-4 py-3 text-left transition-all ${
                active
                  ? "bg-ink text-paper shadow-[5px_5px_0_var(--teal)]"
                  : climbed
                    ? "bg-teal/20 hover:shadow-[3px_3px_0_#0b0d10]"
                    : "bg-white hover:shadow-[3px_3px_0_#0b0d10]"
              }`}
              style={{ marginLeft: `${i * 12}px`, maxWidth: `calc(100% - ${i * 12}px)` }}
            >
              <span
                className={`mono flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink text-xs font-bold ${
                  active ? "bg-acid text-ink" : "bg-white text-ink"
                }`}
              >
                L{i + 1}
              </span>
              <span className="font-bold">{level.level}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.level}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid gap-4 border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#0b0d10] sm:grid-cols-3"
        >
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-muted">Example</div>
            <p className="mt-2 font-semibold">{item.example}</p>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-muted">
              Typical evidence
            </div>
            <p className="mt-2 text-sm text-muted">{item.evidence}</p>
          </div>
          <div className="border-2 border-vermillion bg-vermillion/10 p-3">
            <div className="mono text-[10px] uppercase tracking-widest text-vermillion">
              Does not establish
            </div>
            <p className="mt-2 text-sm font-medium">{item.not}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-sm text-muted">
        Direction 1&apos;s written-value interventions sit on the behavioural rung. Only
        pre-write activation interventions reach causal involvement. Paper 1 does not claim
        the computational-role rung.
      </p>
    </div>
  );
}

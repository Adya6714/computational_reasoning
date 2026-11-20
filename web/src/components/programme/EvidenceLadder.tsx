"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { evidenceLadder } from "@/data/programme";

export function EvidenceLadder() {
  const [rung, setRung] = useState(0);
  const item = evidenceLadder[rung];

  return (
    <div className="shell">
      <div className="shell-body !min-h-0">
        <div className="shell-rail">
          {evidenceLadder.map((level, i) => (
            <button
              key={level.level}
              type="button"
              className={i === rung ? "active" : undefined}
              onClick={() => setRung(i)}
            >
              <span className="n">L{i + 1}</span>
              <span>{level.level}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={item.level}
            className="shell-canvas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="tag">Example</div>
                <p className="mt-2 !mb-0 font-medium">{item.example}</p>
              </div>
              <div>
                <div className="tag">Typical evidence</div>
                <p className="mt-2 !mb-0 text-[0.9rem] text-[var(--muted)]">
                  {item.evidence}
                </p>
              </div>
              <div className="border border-[var(--amber)] bg-[var(--amber-soft)] p-3">
                <div className="tag !text-[var(--amber)]">Does not establish</div>
                <p className="mt-2 !mb-0 text-[0.9rem]">{item.not}</p>
              </div>
            </div>
            <p className="caption">
              Direction 1&apos;s written-value interventions sit on the behavioural rung.
              Only pre-write activation interventions reach causal involvement. Paper 1 does
              not claim the computational-role rung.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

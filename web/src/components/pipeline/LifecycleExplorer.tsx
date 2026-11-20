"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lifecycleStages } from "@/data/pipeline";

export function LifecycleExplorer() {
  const [active, setActive] = useState(0);
  const stage = lifecycleStages[active];

  return (
    <div className="shell">
      <div className="shell-top">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.72rem] text-[var(--muted)]">Stage</span>
          {lifecycleStages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`chip ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {String(s.id).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn"
            disabled={active === 0}
            onClick={() => setActive((v) => Math.max(0, v - 1))}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn primary"
            disabled={active === lifecycleStages.length - 1}
            onClick={() => setActive((v) => Math.min(lifecycleStages.length - 1, v + 1))}
          >
            Next
          </button>
        </div>
      </div>

      <div className="shell-body">
        <div className="shell-rail">
          {lifecycleStages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={active === i ? "active" : undefined}
              onClick={() => setActive(i)}
            >
              <span className="n">{s.id}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            className="shell-canvas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="tag">Output artifact</div>
            <div className="mt-1 text-[0.92rem] font-medium">{stage.output}</div>
            <h3 className="mt-4" style={{ fontFamily: "var(--serif)" }}>
              {stage.title}
            </h3>
            <p className="caption !mt-2 !max-w-none">{stage.goal}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

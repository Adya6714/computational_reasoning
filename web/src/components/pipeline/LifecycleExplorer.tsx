"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lifecycleStages } from "@/data/pipeline";

export function LifecycleExplorer() {
  const [active, setActive] = useState(0);
  const stage = lifecycleStages[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {lifecycleStages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            className={`group relative border-2 border-ink p-3 text-left transition-all ${
              active === i
                ? "bg-ink text-paper shadow-[4px_4px_0_var(--vermillion)]"
                : "bg-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0b0d10]"
            }`}
          >
            <div
              className="mb-2 h-1.5 w-full"
              style={{ background: s.color, opacity: active === i ? 1 : 0.55 }}
            />
            <div className="mono text-[10px] uppercase tracking-widest opacity-70">
              Stage {s.id}
            </div>
            <div className="mt-1 text-xs font-bold leading-snug sm:text-sm">
              {s.title}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.35 }}
          className="border-2 border-ink bg-white p-6 shadow-[6px_6px_0_#0b0d10]"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center border-2 border-ink text-xl font-extrabold text-ink"
              style={{ background: stage.color }}
            >
              {stage.id}
            </span>
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Output artifact
              </div>
              <div className="font-bold">{stage.output}</div>
            </div>
          </div>
          <h3 className="display mt-6 text-2xl font-extrabold">{stage.title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{stage.goal}</p>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="sharp-btn bg-paper px-3 py-1.5 text-sm disabled:opacity-40"
              disabled={active === 0}
              onClick={() => setActive((v) => Math.max(0, v - 1))}
            >
              Prev
            </button>
            <button
              type="button"
              className="sharp-btn bg-teal px-3 py-1.5 text-sm disabled:opacity-40"
              disabled={active === lifecycleStages.length - 1}
              onClick={() => setActive((v) => Math.min(lifecycleStages.length - 1, v + 1))}
            >
              Next stage
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

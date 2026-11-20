"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { competingExplanations } from "@/data/direction1";

export function ExplanationGrid() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {competingExplanations.map((item, i) => {
        const isFlipped = !!flipped[i];
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => setFlipped((p) => ({ ...p, [i]: !p[i] }))}
            className="perspective-[1000px] h-44 text-left"
          >
            <motion.div
              className="relative h-full w-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.45 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#0b0d10]"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="mono text-[10px] uppercase tracking-widest text-muted">
                  Click to flip · claim
                </div>
                <div className="display mt-2 text-xl font-extrabold leading-tight">{item.name}</div>
                <p className="mt-3 text-sm text-muted">{item.claim}</p>
              </div>
              <div
                className="absolute inset-0 border-2 border-ink bg-cobalt p-4 text-white shadow-[4px_4px_0_#0b0d10]"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="mono text-[10px] uppercase tracking-widest text-acid">
                  Prediction in Paper 1 terms
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed">{item.prediction}</p>
              </div>
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}

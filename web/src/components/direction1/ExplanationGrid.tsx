"use client";

import { useState } from "react";
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
            className={`flip-card ${isFlipped ? "flipped" : ""}`}
            onClick={() => setFlipped((p) => ({ ...p, [i]: !p[i] }))}
          >
            <div className="flip-inner">
              <div className="flip-face">
                <div className="tag">Click to flip · claim</div>
                <div
                  className="mt-2 text-[1.05rem] leading-snug"
                  style={{ fontFamily: "var(--serif)" }}
                >
                  {item.name}
                </div>
                <p className="mt-2 !mb-0 text-[0.85rem] text-[var(--muted)]">
                  {item.claim}
                </p>
              </div>
              <div className="flip-face flip-back">
                <div className="tag">Prediction in Paper 1 terms</div>
                <p className="mt-3 !mb-0 text-[0.88rem] font-medium leading-relaxed">
                  {item.prediction}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

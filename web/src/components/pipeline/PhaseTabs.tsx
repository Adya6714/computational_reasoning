"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  foundationQuestions,
  literatureTypes,
  methodComponents,
  paperStructure,
  qaChecklist,
  rddItems,
} from "@/data/pipeline";

const tabs = [
  { id: "foundation", label: "Foundation" },
  { id: "literature", label: "Literature" },
  { id: "method", label: "Methodology" },
  { id: "writing", label: "Writing" },
  { id: "qa", label: "QA" },
  { id: "rdd", label: "RDD" },
] as const;

export function PhaseTabs() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("foundation");

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="shell"
        >
          <div className="shell-canvas !bg-[var(--tint)]">
            {tab === "foundation" && (
              <div>
                <p className="caption !mt-0 !mb-4">
                  Before reading hundreds of papers or writing anything, answer these. A
                  research gap must be a meaningful unresolved problem — not merely an
                  under-attended area.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {foundationQuestions.map((item) => (
                    <div key={item.q} className="card !bg-[var(--paper)]">
                      <div className="font-medium">{item.q}</div>
                      <div className="mt-1 text-[0.88rem] text-[var(--muted)]">
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "literature" && (
              <div>
                <p className="caption !mt-0 !mb-4">
                  Do not just summarise. Synthesise: Paper A establishes X → Paper B
                  challenges X → none investigate Y under Z → that becomes the gap.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {literatureTypes.map((item) => (
                    <div key={item.label} className="card !bg-[var(--paper)]">
                      <div className="tag">{item.label}</div>
                      <p className="mt-2 !mb-0 text-[0.88rem] text-[var(--muted)]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "method" && (
              <div>
                <div className="status-strip !mt-0 !mb-4">
                  Critical rule: design experiments that could prove your hypothesis wrong —
                  not only ones that could confirm it.
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {methodComponents.map((c) => (
                    <div
                      key={c.name}
                      className="border-l-2 border-[var(--accent)] bg-[var(--paper)] py-2 pl-3"
                    >
                      <div className="text-[0.85rem] font-semibold text-[var(--accent)]">
                        {c.name}
                      </div>
                      <div className="text-[0.85rem] text-[var(--muted)]">{c.q}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "writing" && (
              <div>
                <p className="caption !mt-0 !mb-4">
                  Draft Methodology and Results first, then Related Work and Introduction,
                  and finally Abstract and Conclusion.
                </p>
                <div className="space-y-1">
                  {paperStructure.map((s, i) => (
                    <details
                      key={s.section}
                      className="border border-[var(--rule)] bg-[var(--paper)] open:bg-[var(--tint)]"
                    >
                      <summary className="cursor-pointer px-3 py-2.5 font-medium">
                        <span className="mr-2 text-[0.72rem] text-[var(--accent)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.section}
                      </summary>
                      <ul className="space-y-1 border-t border-[var(--rule)] px-4 py-3 text-[0.88rem] text-[var(--muted)]">
                        {s.points.map((p) => (
                          <li key={p}>→ {p}</li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {tab === "qa" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {qaChecklist.map((item) => (
                  <label
                    key={item.dim}
                    className="card flex cursor-pointer items-start gap-3 !bg-[var(--paper)] has-[:checked]:hl"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--accent)]"
                    />
                    <span>
                      <span className="block font-medium">{item.dim}</span>
                      <span className="text-[0.85rem] text-[var(--muted)]">
                        {item.check}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            {tab === "rdd" && (
              <div>
                <p className="caption !mt-0 !mb-4">
                  The Research Design Document exists before the manuscript. Question first,
                  evidence design second, writing third.
                </p>
                <div className="flex flex-wrap gap-2">
                  {rddItems.map((item) => (
                    <span
                      key={item}
                      className="border border-[var(--rule)] bg-[var(--paper)] px-2.5 py-1 text-[0.82rem]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

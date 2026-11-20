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
  { id: "foundation", label: "Foundation", color: "var(--vermillion)" },
  { id: "literature", label: "Literature", color: "var(--cobalt)" },
  { id: "method", label: "Methodology", color: "var(--teal)" },
  { id: "writing", label: "Writing", color: "var(--acid)" },
  { id: "qa", label: "QA", color: "var(--vermillion)" },
  { id: "rdd", label: "RDD", color: "var(--cobalt)" },
] as const;

export function PhaseTabs() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("foundation");
  const active = tabs.find((t) => t.id === tab)!;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-2 border-ink px-3 py-2 text-sm font-bold transition-all ${
              tab === t.id
                ? "text-ink shadow-[3px_3px_0_#0b0d10]"
                : "bg-white text-muted hover:text-ink"
            }`}
            style={{ background: tab === t.id ? t.color : undefined }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-2 border-ink bg-white p-5 shadow-[5px_5px_0_#0b0d10] sm:p-7"
          style={{ borderTop: `6px solid ${active.color}` }}
        >
          {tab === "foundation" && (
            <div>
              <p className="mb-4 text-sm text-muted">
                Before reading hundreds of papers or writing anything, answer these.
                A research gap must be a meaningful unresolved problem — not merely an
                under-attended area.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {foundationQuestions.map((item) => (
                  <div
                    key={item.q}
                    className="border-2 border-ink bg-paper p-3 transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0b0d10]"
                  >
                    <div className="font-bold">{item.q}</div>
                    <div className="mt-1 text-sm text-muted">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "literature" && (
            <div>
              <p className="mb-4 text-sm text-muted">
                Do not just summarise. Synthesise: Paper A establishes X → Paper B
                challenges X → none investigate Y under Z → that becomes the gap.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {literatureTypes.map((item) => (
                  <div key={item.label} className="border-2 border-ink p-4">
                    <div
                      className="mb-2 inline-block border-2 border-ink px-2 py-0.5 text-xs font-bold"
                      style={{ background: active.color }}
                    >
                      {item.label}
                    </div>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "method" && (
            <div>
              <p className="mb-4 text-sm font-semibold text-ink">
                Critical rule: design experiments that could prove your hypothesis wrong —
                not only ones that could confirm it.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {methodComponents.map((c) => (
                  <div key={c.name} className="flex gap-3 border-l-4 border-ink bg-paper p-3">
                    <div className="font-bold text-teal">{c.name}</div>
                    <div className="text-sm text-muted">{c.q}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "writing" && (
            <div>
              <p className="mb-4 text-sm text-muted">
                Draft Methodology and Results first, then Related Work and Introduction,
                and finally Abstract and Conclusion. Writing order ≠ presentation order.
              </p>
              <div className="space-y-2">
                {paperStructure.map((s, i) => (
                  <details
                    key={s.section}
                    className="group border-2 border-ink bg-paper open:bg-white open:shadow-[3px_3px_0_#0b0d10]"
                  >
                    <summary className="cursor-pointer list-none px-4 py-3 font-bold marker:content-none">
                      <span className="mono mr-3 text-xs text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.section}
                    </summary>
                    <ul className="space-y-1 border-t-2 border-ink px-4 py-3 text-sm text-muted">
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
                  className="flex cursor-pointer items-start gap-3 border-2 border-ink p-3 has-[:checked]:bg-acid/40"
                >
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--vermillion)]" />
                  <span>
                    <span className="block font-bold">{item.dim}</span>
                    <span className="text-sm text-muted">{item.check}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {tab === "rdd" && (
            <div>
              <p className="mb-4 text-sm text-muted">
                The Research Design Document exists before the manuscript. Question first,
                evidence design second, writing third.
              </p>
              <div className="flex flex-wrap gap-2">
                {rddItems.map((item, i) => (
                  <span
                    key={item}
                    className="border-2 border-ink bg-paper px-3 py-1.5 text-sm font-medium transition hover:bg-cobalt hover:text-white"
                    style={{ transitionDelay: `${i * 10}ms` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

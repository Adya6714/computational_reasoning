"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  feasibilityBands,
  toyExperiments,
  toyPrompt,
  toySolver,
  toySteps,
  type FeasibilityBandId,
  type ToyStepId,
} from "@/data/toyTask";

const bands = [
  { id: "all" as const, label: "All thirteen" },
  ...feasibilityBands.map((band) => ({ id: band.id, label: band.label })),
];

type BandFilter = "all" | FeasibilityBandId;

export function ToyTaskExplorer() {
  const [band, setBand] = useState<BandFilter>("all");
  const [selected, setSelected] = useState<string>("A");

  const filtered = useMemo(() => {
    if (band === "all") return toyExperiments;
    return toyExperiments.filter((item) => item.band === band);
  }, [band]);

  const active = filtered.find((item) => item.id === selected) ?? filtered[0];
  const activeBand = feasibilityBands.find((item) => item.id === active.band);

  function selectBand(next: BandFilter) {
    setBand(next);
    const visible =
      next === "all" ? toyExperiments : toyExperiments.filter((item) => item.band === next);
    if (!visible.some((item) => item.id === selected) && visible[0]) {
      setSelected(visible[0].id);
    }
  }

  const highlighted = new Set<ToyStepId>(active.highlight);

  return (
    <div className="mt-6">
      <p className="prompt-line">{toyPrompt}</p>
      <p className="caption !mt-2">
        Correct trace: y = 12, z = 24, w = 21. {toySolver}
      </p>

      <ol className="chain">
        {toySteps.map((step) => {
          const on = highlighted.has(step.id);
          return (
            <li key={step.id} className={`chain-step ${on ? "on" : ""}`}>
              <div className="tag">{step.role}</div>
              <div className="chain-line">{step.line}</div>
              <div className="chain-val">{step.value}</div>
            </li>
          );
        })}
      </ol>
      <p className="caption !mt-2">{active.looksAt}</p>

      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Feasibility">
        {bands.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${band === item.id ? "active" : ""}`}
            aria-pressed={band === item.id}
            onClick={() => selectBand(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="shell !mt-0">
        <div className="shell-top">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Directions">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip ${active.id === item.id ? "active" : ""}`}
                aria-pressed={active.id === item.id}
                onClick={() => setSelected(item.id)}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="shell-canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-3xl text-[var(--accent)]"
                style={{ fontFamily: "var(--serif)" }}
              >
                {active.id}
              </span>
              <span className="chip !cursor-default">{active.name}</span>
              <span className="chip !cursor-default">Pillar {active.pillar}</span>
              <span className="chip !cursor-default">{activeBand?.label}</span>
              {active.sweep ? (
                <span className="chip !cursor-default">In the proposed sweep</span>
              ) : null}
            </div>

            <h3 className="mt-3">Question</h3>
            <p className="text-[1.05rem] font-medium">{active.question}</p>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="card static">
                <div className="tag">
                  {active.procedureFromQuestion ? "Do, from the question" : "Do"}
                </div>
                <p className="mt-2 !mb-0 text-[0.9rem]">{active.procedure}</p>
              </div>
              <div className="card static">
                <div className="tag">
                  {active.reachesFromMethod
                    ? "Evidence this can reach"
                    : "Reaches"}
                </div>
                <p className="mt-2 !mb-0 text-[0.9rem]">{active.reaches}</p>
                {active.reachesFromMethod ? (
                  <p className="caption !mb-0">
                    Read off the method. Not a separate result.
                  </p>
                ) : null}
              </div>
              <div className="card static">
                <div className="tag">Feasibility</div>
                <p className="mt-2 !mb-0 text-[0.9rem]">{active.feasibility}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="tag">The item</div>
              <p className="mt-1 !mb-0 text-[0.92rem]">{active.item}</p>
            </div>

            {active.catch ? (
              <div className="mt-3 border border-[var(--amber)] bg-[var(--amber-soft)] p-3">
                <div className="tag !text-[var(--amber)]">Catch</div>
                <p className="mt-2 !mb-0 text-[0.9rem]">{active.catch}</p>
              </div>
            ) : null}

            {active.relation ? (
              <div className="status-strip">{active.relation}</div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

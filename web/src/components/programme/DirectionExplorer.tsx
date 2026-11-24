"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { directions, pillars } from "@/data/programme";
import { toyExperiments } from "@/data/toyTask";

const priorities = [
  { id: 0, label: "All" },
  { id: 1, label: "First wave" },
  { id: 2, label: "Second wave" },
  { id: 3, label: "Third wave" },
] as const;

export function DirectionExplorer() {
  const [pillar, setPillar] = useState<string>("all");
  const [priority, setPriority] = useState(0);
  const [selected, setSelected] = useState("F");

  const filtered = useMemo(() => {
    return directions.filter((d) => {
      const pillarOk = pillar === "all" || d.pillar === pillar;
      const priorityOk = priority === 0 || d.priority === priority;
      return pillarOk && priorityOk;
    });
  }, [pillar, priority]);

  const active = directions.find((d) => d.id === selected) ?? filtered[0];
  const toy = toyExperiments.find((item) => item.id === active?.id);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={`chip ${pillar === "all" ? "active" : ""}`}
          onClick={() => setPillar("all")}
        >
          All pillars
        </button>
        {pillars.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`chip ${pillar === p.id ? "active" : ""}`}
            onClick={() => setPillar(p.id)}
          >
            Pillar {p.id}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {priorities.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`chip ${priority === p.id ? "active" : ""}`}
            onClick={() => setPriority(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="shell">
        <div className="shell-top">
          <div className="flex flex-wrap gap-1.5">
            {filtered.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`chip ${selected === d.id ? "active" : ""}`}
                onClick={() => setSelected(d.id)}
              >
                {d.id}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {active && (
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
                <span className="chip !cursor-default">Pillar {active.pillar}</span>
                <span className="chip !cursor-default">
                  Priority wave {active.priority}
                </span>
              </div>
              <h3 className="mt-3">{active.title}</h3>
              <p className="text-[var(--muted)]">{active.question}</p>
              <div className="status-strip">
                <strong className="text-[var(--ink)]">What we could learn.</strong>{" "}
                {active.learn}
              </div>
              {toy ? (
                <div className="mt-4 border-t border-[var(--rule)] pt-3">
                  <div className="tag">On the shared toy task</div>
                  <p className="mt-2 !mb-1 font-medium">{toy.question}</p>
                  <p className="!mb-0 text-[0.88rem] text-[var(--muted)]">{toy.procedure}</p>
                  <a href="#toy-task" className="mt-2 inline-block text-[0.85rem]">
                    Open the full illustration →
                  </a>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

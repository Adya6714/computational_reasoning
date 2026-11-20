"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { directions, pillars } from "@/data/programme";

const priorities = [
  { id: 0, label: "All" },
  { id: 1, label: "First wave" },
  { id: 2, label: "Second wave" },
  { id: 3, label: "Third wave" },
] as const;

export function DirectionExplorer() {
  const [pillar, setPillar] = useState<string>("all");
  const [priority, setPriority] = useState(0);
  const [selected, setSelected] = useState<string>("F");

  const filtered = useMemo(() => {
    return directions.filter((d) => {
      const pillarOk = pillar === "all" || d.pillar === pillar;
      const priorityOk = priority === 0 || d.priority === priority;
      return pillarOk && priorityOk;
    });
  }, [pillar, priority]);

  const active = directions.find((d) => d.id === selected) ?? filtered[0];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPillar("all")}
          className={`border-2 border-ink px-3 py-1.5 text-sm font-bold ${
            pillar === "all" ? "bg-ink text-paper" : "bg-white"
          }`}
        >
          All pillars
        </button>
        {pillars.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPillar(p.id)}
            className={`border-2 border-ink px-3 py-1.5 text-sm font-bold ${
              pillar === p.id ? "text-ink shadow-[3px_3px_0_#0b0d10]" : "bg-white"
            }`}
            style={{ background: pillar === p.id ? p.color : undefined }}
          >
            Pillar {p.id}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {priorities.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPriority(p.id)}
            className={`border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
              priority === p.id ? "bg-acid" : "bg-paper"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {filtered.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              className={`aspect-square border-2 border-ink text-2xl font-extrabold transition-all ${
                selected === d.id
                  ? "bg-vermillion text-white shadow-[4px_4px_0_#0b0d10]"
                  : "bg-white hover:-translate-y-1 hover:shadow-[3px_3px_0_#0b0d10]"
              }`}
            >
              {d.id}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border-2 border-ink bg-white p-6 shadow-[6px_6px_0_#0b0d10]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="display text-4xl font-extrabold text-vermillion">{active.id}</span>
                <span className="border-2 border-ink bg-paper px-2 py-0.5 text-xs font-bold">
                  Pillar {active.pillar}
                </span>
                <span className="border-2 border-ink bg-acid px-2 py-0.5 text-xs font-bold">
                  Priority wave {active.priority}
                </span>
              </div>
              <h3 className="display mt-4 text-2xl font-extrabold">{active.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{active.question}</p>
              <div className="mt-5 border-2 border-teal bg-teal/15 p-3">
                <div className="mono text-[10px] uppercase tracking-widest">What we could learn</div>
                <p className="mt-1 font-semibold">{active.learn}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

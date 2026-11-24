"use client";

import { useState } from "react";
import { validitySources } from "@/data/validity";

export function ValiditySources() {
  const [selected, setSelected] = useState(0);
  const item = validitySources[selected];

  return (
    <div className="shell">
      <div className="shell-top">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Late-2026 sources">
          {validitySources.map((source, i) => (
            <button
              key={source.id}
              type="button"
              className={`chip ${i === selected ? "active" : ""}`}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
            >
              {source.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shell-canvas" key={item.id}>
        <div className="tag">{item.check}</div>
        <h3 className="mt-2">{item.title}</h3>
        <p className="!mb-2 text-[0.85rem] text-[var(--muted)]">{item.cite}</p>
        <p className="text-[0.95rem]">{item.body}</p>
        <div className="status-strip !mt-0">{item.bears}</div>
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-[0.85rem]"
        >
          Open the source →
        </a>
      </div>
    </div>
  );
}

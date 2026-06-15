"use client";

import { useState } from "react";

export function IconPicker({
  name,
  selected,
  options,
}: {
  name: string;
  selected: string[];
  options: { path: string; label: string }[];
}) {
  const [chosen, setChosen] = useState<Set<string>>(new Set(selected));
  const toggle = (path: string) => {
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[11px] text-slate-500">
          {chosen.size} selected
        </span>
        <button
          type="button"
          onClick={() => setChosen(new Set(options.map((o) => o.path)))}
          className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 hover:border-sky-500 hover:text-sky-400 transition"
        >
          Select all
        </button>
        <button
          type="button"
          onClick={() => setChosen(new Set())}
          className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400 transition"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
        {options.map((opt) => {
          const isOn = chosen.has(opt.path);
          return (
            <label
              key={opt.path}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded border cursor-pointer transition select-none ${
                isOn
                  ? "border-sky-500 bg-sky-500/10"
                  : "border-slate-700 bg-slate-900/40 hover:border-slate-500"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={opt.path}
                checked={isOn}
                onChange={() => toggle(opt.path)}
                className="sr-only"
              />
              <img
                src={opt.path}
                alt={opt.label}
                className="w-6 h-6 object-contain"
              />
              <span className="text-[10px] text-slate-300 leading-tight text-center">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

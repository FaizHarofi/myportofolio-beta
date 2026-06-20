"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconPicker({
  name,
  selected,
  options,
}: {
  name: string;
  selected: string[];
  options: { path: string; label: string }[];
}) {
  const [chosen, setChosen] = useState<Set<string>>(
    () => new Set(selected)
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  function toggle(path: string) {
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter icons..."
            className="w-full h-8 pl-8 pr-7 rounded-md border border-white/10 bg-slate-900/60 text-xs text-white placeholder:text-slate-500 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 transition"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-5 w-5 rounded text-slate-500 hover:text-white hover:bg-slate-950/5 transition"
              aria-label="Clear filter"
            >
              <X size={12} />
            </button>
          ) : null}
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {chosen.size} selected
        </span>
        <button
          type="button"
          onClick={() => setChosen(new Set(options.map((o) => o.path)))}
          className="text-[10px] font-medium px-2 py-1 rounded-md border border-white/10 text-slate-300 hover:border-violet-400/40 hover:text-white hover:bg-violet-500/10 transition"
        >
          Select all
        </button>
        <button
          type="button"
          onClick={() => setChosen(new Set())}
          className="text-[10px] font-medium px-2 py-1 rounded-md border border-white/10 text-slate-300 hover:border-rose-400/40 hover:text-rose-300 hover:bg-rose-500/10 transition"
        >
          Clear
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-white/10 rounded-lg">
          No icons match &quot;{query}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {filtered.map((opt) => {
            const isOn = chosen.has(opt.path);
            return (
              <label
                key={opt.path}
                className={cn(
                  "group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-all select-none",
                  isOn
                    ? "border-violet-400/60 bg-violet-500/10 shadow shadow-violet-500/10"
                    : "border-white/10 bg-slate-900/40 hover:border-white/15 hover:bg-slate-900/70"
                )}
              >
                <input
                  type="checkbox"
                  name={name}
                  value={opt.path}
                  checked={isOn}
                  onChange={() => toggle(opt.path)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "h-10 w-10 rounded-md flex items-center justify-center transition",
                    isOn
                      ? "bg-slate-950/60"
                      : "bg-slate-950/40 group-hover:bg-slate-950/60"
                  )}
                >
                  <img
                    src={opt.path}
                    alt={opt.label}
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <span className="text-[10px] leading-tight text-center text-slate-300 truncate w-full">
                  {opt.label}
                </span>
                {isOn ? (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow">
                    <Check size={10} strokeWidth={3} />
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

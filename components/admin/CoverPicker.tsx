"use client";

import { useEffect, useState } from "react";
import {
  FolderSearch,
  ImageIcon,
  X,
  Check,
  Image as ImgIcon,
} from "lucide-react";
import { EditModal } from "./EditModal";
import { cn } from "@/lib/utils";

export type CoverOption = {
  path: string;
  label: string;
};

export function CoverPicker({
  name,
  value,
  options,
}: {
  name: string;
  value?: string;
  options: CoverOption[];
}) {
  const [chosen, setChosen] = useState<string>(value ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setChosen(value ?? "");
  }, [value]);

  const filtered = query.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.path.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  const current = options.find((o) => o.path === chosen);

  return (
    <div>
      <input type="hidden" name={name} value={chosen} />

      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/60 p-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-slate-950">
          {current ? (
            <img
              src={current.path}
              alt={current.label}
              className="h-full w-full object-contain p-1"
            />
          ) : chosen ? (
            <img
              src={chosen}
              alt="selected"
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <ImageIcon size={18} className="text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white">
            {current?.label || (chosen ? "Custom path" : "No cover selected")}
          </p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-slate-500">
            {chosen ? chosen.split("/").pop() : "—"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/40 bg-violet-500/10 px-2.5 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-500/20 transition"
          >
            <FolderSearch size={13} />
            Browse
          </button>
          {chosen ? (
            <button
              type="button"
              onClick={() => setChosen("")}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-slate-950/30 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-400/30 transition"
              aria-label="Clear selection"
            >
              <X size={13} />
            </button>
          ) : null}
        </div>
      </div>

      <EditModal
        open={open}
        onOpenChange={setOpen}
        title="Pick from cover library"
        description="Select an existing cover image to use its path."
        size="xl"
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <FolderSearch
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by label or path..."
              className="w-full h-9 pl-8 pr-3 rounded-md border border-white/10 bg-slate-900/60 text-xs text-white placeholder:text-slate-500 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {filtered.length} {filtered.length === 1 ? "cover" : "covers"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/30 px-4 py-10 text-center">
            <ImgIcon size={28} className="mx-auto text-slate-400" />
            <p className="mt-2 text-sm text-slate-300">
              {options.length === 0
                ? "No cover images yet."
                : "No covers match your search."}
            </p>
            {options.length === 0 ? (
              <p className="mt-1 text-[11px] text-slate-500">
                Upload a cover from{" "}
                <a
                  href="/admin/assets"
                  className="text-violet-300 underline underline-offset-2 hover:text-violet-200"
                >
                  /admin/assets
                </a>{" "}
                first.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.map((opt) => {
              const isSelected = chosen === opt.path;
              return (
                <button
                  key={opt.path}
                  type="button"
                  onClick={() => {
                    setChosen(opt.path);
                    setOpen(false);
                  }}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-lg border bg-slate-900/30 transition",
                    isSelected
                      ? "border-violet-400 ring-2 ring-violet-500/40"
                      : "border-white/10 hover:border-white/30 hover:bg-slate-900"
                  )}
                >
                  <img
                    src={opt.path}
                    alt={opt.label}
                    className="h-full w-full object-contain p-2"
                  />
                  {isSelected ? (
                    <span className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : null}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 py-1 text-[10px] text-white">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </EditModal>
    </div>
  );
}

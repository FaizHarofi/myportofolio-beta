"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl" | "full";

const sizeConfig: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "w-[min(960px,95vw)]",
};

export function EditModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: Size;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const handler = () => onOpenChange(false);
    dlg.addEventListener("close", handler);
    return () => dlg.removeEventListener("close", handler);
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "m-auto rounded-2xl border border-white/10 bg-slate-950 p-0 text-slate-100 w-full",
        "backdrop:bg-slate-900/30 backdrop:backdrop-blur-md",
        "shadow-2xl shadow-black/60",
        sizeConfig[size]
      )}
      onClick={(e) => {
        if (e.target === dialogRef.current) onOpenChange(false);
      }}
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-t-2xl"
        />
        <div className="relative flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-white/10">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight truncate">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-slate-400">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-400 hover:text-white hover:bg-slate-950/5 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative px-6 py-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </dialog>
  );
}

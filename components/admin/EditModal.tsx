"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl" | "full";

const sizeConfig: Record<
  Size,
  { dialog: string; body: string; header: string; title: string }
> = {
  sm: {
    dialog: "max-w-sm",
    body: "px-4 py-3 max-h-[80vh] overflow-y-auto",
    header: "px-4 py-2.5",
    title: "text-base",
  },
  md: {
    dialog: "max-w-md",
    body: "px-4 py-3 max-h-[80vh] overflow-y-auto",
    header: "px-4 py-2.5",
    title: "text-base",
  },
  lg: {
    dialog: "max-w-2xl",
    body: "px-5 py-4 max-h-[80vh] overflow-y-auto",
    header: "px-5 py-3",
    title: "text-base",
  },
  xl: {
    dialog: "max-w-4xl",
    body: "px-5 py-4 max-h-[80vh] overflow-y-auto",
    header: "px-5 py-3",
    title: "text-base",
  },
  full: {
    dialog: "w-[90vw] max-w-4xl",
    body: "px-6 py-5 max-h-[85vh] overflow-y-auto",
    header: "px-6 py-3",
    title: "text-lg",
  },
};

export function EditModal({
  open,
  onOpenChange,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  size?: Size;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cfg = sizeConfig[size];

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`${cfg.dialog} rounded-xl border border-slate-800 bg-slate-950 p-0 backdrop:bg-slate-950/80 max-w-[95vw] w-full m-auto`}
      onClose={() => onOpenChange(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) onOpenChange(false);
      }}
    >
      <div className="flex flex-col">
        <div
          className={`${cfg.header} flex items-center justify-between border-b border-slate-800 shrink-0`}
        >
          <h2 className={`${cfg.title} font-semibold text-white`}>{title}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-9 h-9 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className={cfg.body}>{children}</div>
      </div>
    </dialog>
  );
}

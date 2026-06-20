import type { ReactNode } from "react";

export function Surface({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={
        "relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl shadow-black/20 " +
        (padded ? "p-5 sm:p-6 " : "") +
        className
      }
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  count,
  action,
}: {
  title: string;
  description?: string;
  count?: number | string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            {title}
          </h3>
          {count !== undefined ? (
            <span className="inline-flex items-center rounded-md bg-slate-950/5 border border-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
              {count}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

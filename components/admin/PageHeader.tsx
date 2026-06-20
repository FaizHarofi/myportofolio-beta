import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  icon,
  badge,
  actions,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 lg:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4 min-w-0">
        {icon ? (
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 blur-lg opacity-70" />
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-white/10 flex items-center justify-center text-violet-300">
              {icon}
            </div>
          </div>
        ) : null}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>
            {badge ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[11px] font-medium text-violet-300">
                {badge}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}

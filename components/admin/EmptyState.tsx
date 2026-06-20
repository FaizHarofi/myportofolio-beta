import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "violet",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "violet" | "indigo" | "fuchsia" | "sky";
}) {
  const toneClass = {
    violet: "from-violet-500/15 to-fuchsia-500/10 text-violet-300",
    indigo: "from-indigo-500/15 to-violet-500/10 text-indigo-300",
    fuchsia: "from-fuchsia-500/15 to-rose-500/10 text-fuchsia-300",
    sky: "from-sky-500/15 to-indigo-500/10 text-sky-300",
  }[tone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-10 text-center">
      <div className="mx-auto inline-flex items-center justify-center">
        <div
          className={
            "h-14 w-14 rounded-2xl bg-gradient-to-br border border-white/10 flex items-center justify-center " +
            toneClass
          }
        >
          <Icon size={26} />
        </div>
      </div>
      <h4 className="mt-4 text-base font-semibold text-white">{title}</h4>
      {description ? (
        <p className="mt-1.5 text-sm text-slate-400 max-w-sm mx-auto">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

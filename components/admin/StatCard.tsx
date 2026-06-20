import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "violet" | "indigo" | "fuchsia" | "sky" | "emerald" | "amber" | "rose";

const toneStyles: Record<
  Tone,
  { ring: string; iconBg: string; iconText: string; glow: string }
> = {
  violet: {
    ring: "from-violet-500/40 via-violet-500/0",
    iconBg: "bg-violet-500/15",
    iconText: "text-violet-300",
    glow: "bg-violet-500/20",
  },
  indigo: {
    ring: "from-indigo-500/40 via-indigo-500/0",
    iconBg: "bg-indigo-500/15",
    iconText: "text-indigo-300",
    glow: "bg-indigo-500/20",
  },
  fuchsia: {
    ring: "from-fuchsia-500/40 via-fuchsia-500/0",
    iconBg: "bg-fuchsia-500/15",
    iconText: "text-fuchsia-300",
    glow: "bg-fuchsia-500/20",
  },
  sky: {
    ring: "from-sky-500/40 via-sky-500/0",
    iconBg: "bg-sky-500/15",
    iconText: "text-sky-300",
    glow: "bg-sky-500/20",
  },
  emerald: {
    ring: "from-emerald-500/40 via-emerald-500/0",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-300",
    glow: "bg-emerald-500/20",
  },
  amber: {
    ring: "from-amber-500/40 via-amber-500/0",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-300",
    glow: "bg-amber-500/20",
  },
  rose: {
    ring: "from-rose-500/40 via-rose-500/0",
    iconBg: "bg-rose-500/15",
    iconText: "text-rose-300",
    glow: "bg-rose-500/20",
  },
};

export function StatCard({
  href,
  label,
  value,
  icon: Icon,
  tone = "violet",
  hint,
}: {
  href: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}) {
  const t = toneStyles[tone];

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 transition-all hover:border-white/10 hover:bg-slate-900/60 hover:-translate-y-0.5"
    >
      <div
        className={cn(
          "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity",
          t.glow
        )}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center border border-white/10",
            t.iconBg,
            t.iconText
          )}
        >
          <Icon size={20} />
        </div>
        <ArrowUpRight
          size={16}
          className="text-slate-400 group-hover:text-slate-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
        />
      </div>

      <div className="relative">
        <p className="text-3xl font-bold tracking-tight text-white">
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-400">{label}</p>
        {hint ? (
          <p className="mt-2 text-[11px] text-slate-500">{hint}</p>
        ) : null}
      </div>
    </Link>
  );
}

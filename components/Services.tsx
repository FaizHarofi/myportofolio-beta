import {
  Palette,
  Code2,
  Layout as LayoutIcon,
  Smartphone,
  Film,
  Printer,
  Sparkles,
  Image as ImageIcon,
  Globe,
  Zap,
  Camera,
  Music,
  Pen,
  Brush,
  Wand,
  ArrowUpRight,
} from "lucide-react";
import { getServices, type Service } from "@/lib/data";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Palette,
  Code2,
  Layout: LayoutIcon,
  Smartphone,
  Film,
  Printer,
  Sparkles,
  Image: ImageIcon,
  Globe,
  Zap,
  Camera,
  Music,
  Pen,
  Brush,
  Wand,
};

type Tone =
  | "violet"
  | "fuchsia"
  | "indigo"
  | "sky"
  | "emerald"
  | "amber"
  | "rose";

const toneStyles: Record<Tone, { card: string; icon: string; hover: string }> =
  {
    violet: {
      card: "from-violet-500/15 via-violet-500/5 border-violet-400/25",
      icon: "bg-violet-500/20 text-violet-300 border-violet-400/30",
      hover: "group-hover:border-violet-400/50",
    },
    fuchsia: {
      card: "from-fuchsia-500/15 via-fuchsia-500/5 border-fuchsia-400/25",
      icon: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30",
      hover: "group-hover:border-fuchsia-400/50",
    },
    indigo: {
      card: "from-indigo-500/15 via-indigo-500/5 border-indigo-400/25",
      icon: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
      hover: "group-hover:border-indigo-400/50",
    },
    sky: {
      card: "from-sky-500/15 via-sky-500/5 border-sky-400/25",
      icon: "bg-sky-500/20 text-sky-300 border-sky-400/30",
      hover: "group-hover:border-sky-400/50",
    },
    emerald: {
      card: "from-emerald-500/15 via-emerald-500/5 border-emerald-400/25",
      icon: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      hover: "group-hover:border-emerald-400/50",
    },
    amber: {
      card: "from-amber-500/15 via-amber-500/5 border-amber-400/25",
      icon: "bg-amber-500/20 text-amber-300 border-amber-400/30",
      hover: "group-hover:border-amber-400/50",
    },
    rose: {
      card: "from-rose-500/15 via-rose-500/5 border-rose-400/25",
      icon: "bg-rose-500/20 text-rose-300 border-rose-400/30",
      hover: "group-hover:border-rose-400/50",
    },
  };

function toneFor(s: string): Tone {
  if (s in toneStyles) return s as Tone;
  return "violet";
}

function iconFor(s: string) {
  return ICON_MAP[s] ?? Sparkles;
}

export default async function Services() {
  const services = await getServices();

  return (
    <section id="services" className="py-20">
      <div className="mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
          <span className="h-1 w-6 rounded-full bg-sky-400/60" />
          Services
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          What I can do for you.
        </h2>
        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          From first sketch to final deploy — full-stack creative services for
          brands and individuals who want to stand out.
        </p>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-14 text-center text-sm text-slate-400">
          No services yet — add them from{" "}
          <a
            href="/admin/services"
            className="font-medium text-violet-300 hover:text-violet-200 underline underline-offset-2"
          >
            /admin/services
          </a>
          .
        </div>
      )}

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/30 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="text-sm font-medium text-white">
            Need something custom?
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Got a project that doesn&apos;t fit a category? Let&apos;s talk — I
            love a good challenge.
          </p>
        </div>
        <a
          href="mailto:faizsjawa@gmail.com"
          className="inline-flex items-center gap-2 rounded-lg border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
        >
          Start a project
          <ArrowUpRight size={13} />
        </a>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const tone = toneFor(service.tone);
  const t = toneStyles[tone];
  const Icon = iconFor(service.icon);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30 ${t.card} ${t.hover}`}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-950/5 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${t.icon}`}
          >
            <Icon size={22} />
          </span>
          <ArrowUpRight
            size={18}
            className="text-slate-400 transition-all group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>

        <h3 className="mt-5 text-lg font-bold text-white">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {service.description}
        </p>
      </div>
    </article>
  );
}

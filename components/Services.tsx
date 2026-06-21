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
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = iconFor(service.icon);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-violet-500/5 to-fuchsia-500/10 p-6 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-violet-400/40 hover:shadow-2xl hover:shadow-violet-500/10">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-950/5 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/20 text-violet-200">
            <Icon size={22} />
          </span>
          <ArrowUpRight
            size={18}
            className="text-slate-400 transition-all group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>

        <h3 className="mt-5 text-lg font-bold text-white">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {service.description}
        </p>
      </div>
    </article>
  );
}

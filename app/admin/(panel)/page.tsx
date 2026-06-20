import Link from "next/link";
import {
  LayoutGrid,
  FolderKanban,
  Sparkles,
  Quote,
  Building2,
  Briefcase,
  Share2,
  Link2,
  ArrowRight,
  Zap,
  Layers,
  Activity,
  Clock,
  Database,
} from "lucide-react";
import {
  getCompanies,
  getGridItems,
  getNavItems,
  getProjects,
  getServices,
  getSkills,
  getSocials,
  getTestimonials,
} from "@/lib/data";
import { getTechIcons } from "@/lib/icons-data";
import { StatCard } from "@/components/admin/StatCard";
import { Surface } from "@/components/admin/Surface";
import { ButtonLink } from "@/components/admin/Button";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Working late";
}

function getToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default async function AdminDashboard() {
  const [
    nav,
    grid,
    projects,
    testimonials,
    companies,
    services,
    socials,
    techIcons,
  ] = await Promise.all([
    getNavItems(),
    getGridItems(),
    getProjects(),
    getTestimonials(),
    getCompanies(),
    getServices(),
    getSocials(),
    getTechIcons(),
  ]);

  const total =
    nav.length +
    grid.length +
    projects.length +
    testimonials.length +
    companies.length +
    services.length +
    socials.length +
    techIcons.length;

  const stats = [
    {
      label: "Projects",
      count: projects.length,
      href: "/admin/projects",
      icon: FolderKanban,
      tone: "violet" as const,
      hint: "Featured work cards",
    },
    {
      label: "Grid Items",
      count: grid.length,
      href: "/admin/grid-items",
      icon: LayoutGrid,
      tone: "indigo" as const,
      hint: "Bento grid layouts",
    },
    {
      label: "Assets",
      count: techIcons.length,
      href: "/admin/assets",
      icon: Layers,
      tone: "fuchsia" as const,
      hint: "Tech icons + cover images",
    },
    {
      label: "Testimonials",
      count: testimonials.length,
      href: "/admin/testimonials",
      icon: Quote,
      tone: "amber" as const,
      hint: "Quotes from clients",
    },
    {
      label: "Companies",
      count: companies.length,
      href: "/admin/companies",
      icon: Building2,
      tone: "sky" as const,
      hint: "Trusted-by logos",
    },
    {
      label: "Services",
      count: services.length,
      href: "/admin/services",
      icon: Briefcase,
      tone: "emerald" as const,
      hint: "What you offer",
    },
    {
      label: "Social Media",
      count: socials.length,
      href: "/admin/social",
      icon: Share2,
      tone: "rose" as const,
      hint: "Social icons",
    },
    {
      label: "Nav Items",
      count: nav.length,
      href: "/admin/nav",
      icon: Link2,
      tone: "violet" as const,
      hint: "Floating nav links",
    },
  ];

  const recent = projects.slice(-3).reverse();

  return (
    <div className="space-y-8">
      <Surface className="overflow-hidden" padded={false}>
        <div className="relative px-6 sm:px-8 py-7 sm:py-9">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 80% at 0% 0%, rgba(139,92,246,0.20), transparent 60%), radial-gradient(50% 70% at 100% 100%, rgba(99,102,241,0.18), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-200">
                <Activity size={12} />
                All systems operational
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {getGreeting()},{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  Admin
                </span>
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">
                {getToday()} · {total} total entries across all sections
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink
                href="/admin/projects"
                variant="primary"
                size="md"
                prefetch={false}
              >
                <FolderKanban size={15} />
                Manage Projects
                <ArrowRight size={14} />
              </ButtonLink>
              <ButtonLink
                href="/admin/assets"
                variant="secondary"
                size="md"
                prefetch={false}
              >
                <Layers size={15} />
                Upload Assets
              </ButtonLink>
            </div>
          </div>
        </div>
      </Surface>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Content overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <StatCard
              key={s.href}
              href={s.href}
              label={s.label}
              value={s.count}
              icon={s.icon}
              tone={s.tone}
              hint={s.hint}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Surface className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Recent projects
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest entries from the projects table
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200 transition"
            >
              View all
              <ArrowRight size={12} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 rounded-xl border border-dashed border-white/10 bg-slate-950/20">
              <Zap size={28} className="text-violet-300 mb-2" />
              <p className="text-sm text-slate-300 font-medium">
                No projects yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Create your first project to see it here.
              </p>
              <div className="mt-4">
                <ButtonLink
                  href="/admin/projects"
                  variant="secondary"
                  size="sm"
                >
                  Open projects
                </ButtonLink>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {recent.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-white/10">
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {p.des || "No description"}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-950/5 border border-white/10 px-1.5 py-0.5 rounded">
                    <Clock size={10} />
                    #{p.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Surface>

        <Surface>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-white/10 flex items-center justify-center text-violet-300">
              <Database size={16} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Quick start</h3>
              <p className="text-[11px] text-slate-400">
                Common admin tasks
              </p>
            </div>
          </div>

          <ul className="space-y-1.5">
            {[
              {
                href: "/admin/projects",
                label: "Add a new project",
                icon: FolderKanban,
                tone: "text-violet-300 bg-violet-500/10 border-violet-500/20",
              },
              {
                href: "/admin/grid-items",
                label: "Edit bento grid",
                icon: LayoutGrid,
                tone: "text-indigo-300 bg-indigo-500/10 border-indigo-500/20",
              },
              {
                href: "/admin/assets",
                label: "Upload asset",
                icon: Layers,
                tone: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20",
              },
              {
                href: "/admin/testimonials",
                label: "Add testimonial",
                icon: Quote,
                tone: "text-amber-300 bg-amber-500/10 border-amber-500/20",
              },
              {
                href: "/admin/experience",
                label: "Update experience",
                icon: Briefcase,
                tone: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
              },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <li key={q.href}>
                  <Link
                    href={q.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 -mx-3 hover:bg-slate-950/10 transition"
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${q.tone}`}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                      {q.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-slate-400 group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">
              Tip
            </p>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Changes you make here are saved instantly and reflected on the
              public site on the next request.
            </p>
          </div>
        </Surface>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  LayoutGrid,
  Sparkles,
  Quote,
  Building2,
  Briefcase,
  Share2,
  Link2,
  ArrowUpRight,
  GraduationCap,
  Layers,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  exact?: boolean;
};

const links: NavLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Profile", icon: UserCircle2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/grid-items", label: "Grid Items", icon: LayoutGrid },
  { href: "/admin/assets", label: "Assets", icon: Layers },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/educations", label: "Education", icon: GraduationCap },
  { href: "/admin/social", label: "Social Media", icon: Share2 },
  { href: "/admin/nav", label: "Nav Items", icon: Link2 },
];

function isActive(pathname: string, link: NavLink) {
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(link.href + "/");
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 shrink-0",
          "border-r border-white/10 bg-slate-900/60 backdrop-blur-2xl",
          "flex flex-col transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-6 pt-6 pb-5 border-b border-white/10">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 blur-md opacity-60 group-hover:opacity-100 transition" />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-white font-black text-lg">P</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white tracking-tight">
                Portfolio
              </p>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Content
          </p>
          <ul className="space-y-1">
            {links.map((l) => {
              const active = isActive(pathname, l);
              const Icon = l.icon;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-950/5"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gradient-to-b from-violet-400 to-fuchsia-500" />
                    )}
                    {active && (
                      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-transparent" />
                    )}
                    <Icon
                      size={18}
                      className={cn(
                        "relative shrink-0 transition-colors",
                        active
                          ? "text-violet-300"
                          : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    <span className="relative truncate">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-5 border-t border-white/10">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-950/5 transition"
            >
              <ArrowUpRight size={18} className="text-slate-500" />
              <span>View live site</span>
            </Link>
          </div>
        </nav>

        <SidebarFooter />
      </aside>
    </>
  );
}

function SidebarFooter() {
  const pathname = usePathname();
  const pageLabel = useMemo(() => {
    const link = links.find((l) => isActive(pathname, l));
    return link?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <div className="px-4 py-4 border-t border-white/10">
      <div className="rounded-xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border border-white/10 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300/80">
          Current
        </p>
        <p className="mt-1 text-sm font-semibold text-white truncate">
          {pageLabel}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400 truncate">
          {pathname}
        </p>
      </div>
    </div>
  );
}

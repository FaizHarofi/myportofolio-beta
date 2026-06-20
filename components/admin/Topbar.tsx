"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, ChevronRight, LogOut, User, ExternalLink } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const crumbs: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/profile": "Profile",
  "/admin/projects": "Projects",
  "/admin/grid-items": "Grid Items",
  "/admin/assets": "Assets",
  "/admin/skills": "Skills",
  "/admin/testimonials": "Testimonials",
  "/admin/companies": "Companies",
  "/admin/services": "Services",
  "/admin/educations": "Education",
  "/admin/social": "Social Media",
  "/admin/nav": "Nav Items",
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const title = crumbs[pathname] ?? "Admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/30 backdrop-blur-2xl">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-950/5 transition"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Admin
          </span>
          <ChevronRight
            size={14}
            className="hidden sm:inline text-slate-400"
          />
          <h1 className="text-base sm:text-lg font-semibold text-white truncate">
            {title}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/10 bg-slate-950/30 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-950/5 transition"
          >
            <ExternalLink size={14} />
            View site
          </Link>

          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-lg border transition",
                menuOpen
                  ? "border-violet-500/50 bg-violet-500/10"
                  : "border-white/10 bg-slate-950/30 hover:bg-slate-950/5"
              )}
              aria-label="User menu"
            >
              <span className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow shadow-violet-500/30">
                <span className="text-white text-xs font-bold">A</span>
              </span>
              <span className="hidden sm:inline text-xs font-medium text-slate-200">
                Admin
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">Administrator</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Signed in
                  </p>
                </div>
                <div className="p-1">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-400">
                    <User size={14} />
                    admin
                  </div>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-rose-300 hover:bg-rose-500/10 transition text-left"
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

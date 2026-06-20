"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[36rem] w-[36rem] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="flex min-h-screen">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

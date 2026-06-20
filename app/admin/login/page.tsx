import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutDashboard, Sparkles } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;
  const showError = params?.error === "1";

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden flex items-stretch">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[40rem] w-[40rem] rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
        <div className="relative max-w-md">
          <div className="absolute -inset-8 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 items-center justify-center shadow-xl shadow-violet-500/40 mb-6">
              <span className="text-white font-black text-2xl">P</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Portfolio
              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                Admin Console
              </span>
            </h1>
            <p className="mt-4 text-slate-300/90 leading-relaxed">
              Manage your portfolio content, projects, tech stack, testimonials,
              and experience — all from one place. Built for speed and clarity.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 rounded-lg bg-slate-950/5 border border-white/10 items-center justify-center text-violet-300">
                  <Sparkles size={14} />
                </span>
                Real-time content updates
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 rounded-lg bg-slate-950/5 border border-white/10 items-center justify-center text-violet-300">
                  <LayoutDashboard size={14} />
                </span>
                Modern dashboard & editor
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 rounded-lg bg-slate-950/5 border border-white/10 items-center justify-center text-violet-300">
                  <ArrowLeft size={14} />
                </span>
                One-click publish to live site
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition mb-8"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>

          <div className="relative rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-2xl p-7 sm:p-8 shadow-2xl shadow-black/40">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
            />
            <div className="mb-7 text-center">
              <div className="inline-flex lg:hidden h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
                <span className="text-white font-black text-xl">P</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-400">
                Sign in to manage your portfolio
              </p>
            </div>

            <LoginForm />

            {showError ? (
              <p className="mt-3 text-xs text-rose-300 text-center">
                Invalid password
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

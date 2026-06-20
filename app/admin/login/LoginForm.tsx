"use client";

import { useState } from "react";
import { KeyRound, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { loginAction } from "../actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        setError(null);
        try {
          await loginAction(formData);
        } catch (e: any) {
          if (e?.message?.includes?.("NEXT_REDIRECT")) {
            throw e;
          }
          setError("Invalid password. Try again.");
          setLoading(false);
        }
      }}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300"
        >
          <KeyRound size={13} />
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Enter your password"
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg font-semibold text-sm bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:brightness-110 transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            Sign in
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-slate-950/20 p-3 text-[11px] text-slate-400">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-violet-400" />
        <p>
          Default password:{" "}
          <code className="rounded bg-slate-900/60 px-1.5 py-0.5 text-violet-300">
            admin123
          </code>
          . Set{" "}
          <code className="rounded bg-slate-900/60 px-1.5 py-0.5 text-violet-300">
            ADMIN_PASSWORD
          </code>{" "}
          env to change.
        </p>
      </div>
    </form>
  );
}

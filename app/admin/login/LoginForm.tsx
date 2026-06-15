"use client";

import { useState } from "react";
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
          setError("Login failed");
          setLoading(false);
        }
      }}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
          placeholder="admin123"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">Invalid password. Try again.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-sky-500 hover:bg-sky-400 disabled:opacity-50 transition px-3 py-2 text-sm font-semibold text-slate-950"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Default password: <code className="text-sky-400">admin123</code> (set
        <code className="text-sky-400"> ADMIN_PASSWORD </code>env to change)
      </p>
    </form>
  );
}

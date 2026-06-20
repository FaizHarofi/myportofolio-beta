import Link from "next/link";
import type { ReactNode } from "react";

const variantClasses: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110",
  secondary:
    "bg-slate-950/10 text-slate-200 border border-white/10 hover:bg-slate-950/[0.07] hover:text-white",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-950/5 hover:text-white",
  danger:
    "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-200",
  success:
    "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-200",
};

const sizeClasses: Record<string, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}) {
  return (
    <button
      {...rest}
      className={
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 " +
        variantClasses[variant] +
        " " +
        sizeClasses[size] +
        " " +
        className
      }
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  prefetch,
  target,
}: {
  href: string;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
  target?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      target={target}
      className={
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:scale-[0.98] " +
        variantClasses[variant] +
        " " +
        sizeClasses[size] +
        " " +
        className
      }
    >
      {children}
    </Link>
  );
}

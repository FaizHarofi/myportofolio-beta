"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GlobalCursor } from "./Cursor";

/**
 * Renders the global custom cursor only on public routes.
 * Admin routes (`/admin/*`) keep the native cursor so dropdowns,
 * popups, and form interactions work normally.
 */
export function CursorGate() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    let styleEl = document.getElementById(
      "cursor-hide-style"
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cursor-hide-style";
      document.head.appendChild(styleEl);
    }
    if (isAdmin) {
      styleEl.textContent = "";
    } else {
      styleEl.textContent = `html, body, body * { cursor: none !important; }`;
    }
    return () => {
      if (styleEl) styleEl.textContent = "";
    };
  }, [isAdmin]);

  return <GlobalCursor enabled={!isAdmin} />;
}

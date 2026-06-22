"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GlobalCursor } from "./Cursor";

/**
 * Renders the global custom cursor only on public routes
 * AND only on devices with a fine pointer (mouse/trackpad).
 * Touch devices (phones, tablets) keep the native cursor.
 * Admin routes (`/admin/*`) always keep the native cursor.
 */
export function CursorGate() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const [isFinePointer, setIsFinePointer] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showCustomCursor = !isAdmin && isFinePointer;

  useEffect(() => {
    let styleEl = document.getElementById(
      "cursor-hide-style"
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cursor-hide-style";
      document.head.appendChild(styleEl);
    }
    if (showCustomCursor) {
      styleEl.textContent = `html, body, body * { cursor: none !important; }`;
    } else {
      styleEl.textContent = "";
    }
    return () => {
      if (styleEl) styleEl.textContent = "";
    };
  }, [showCustomCursor]);

  return <GlobalCursor enabled={showCustomCursor} />;
}

"use client";

import { useEffect, type ReactNode } from "react";

export function ContextGuard({ children }: { children: ReactNode }) {
  useEffect(() => {
    const isProtected = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      if (el.tagName === "IMG") return true;
      if (el.tagName === "SVG" || el.closest("svg")) return true;
      if (el.closest("[data-protect]")) return true;
      return false;
    };

    const onContextMenu = (e: MouseEvent) => {
      if (isProtected(e.target)) e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      if (isProtected(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return <>{children}</>;
}

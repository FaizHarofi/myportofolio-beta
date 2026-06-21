"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Primitive layer — context + position-tracked elements                     */
/* -------------------------------------------------------------------------- */

type CursorPosition = { x: number; y: number };
type CursorContextValue = { cursorPos: CursorPosition };

const CursorContext = React.createContext<CursorContextValue>({
  cursorPos: { x: 0, y: 0 },
});

function useCursor() {
  return React.useContext(CursorContext);
}

type CursorProviderProps = React.PropsWithChildren<{
  /** When true, the cursor tracks the mouse anywhere on the page. */
  global?: boolean;
}>;

function CursorProvider({ children }: CursorProviderProps) {
  const [cursorPos, setCursorPos] = React.useState<CursorPosition>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    function update(e: MouseEvent) {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
    // Listen on window so the cursor tracks the mouse anywhere when the
    // provider is mounted at the root layout.
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorPos }}>
      {children}
    </CursorContext.Provider>
  );
}

function CursorContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9990]">
      {children}
    </div>
  );
}

type CursorFollowSide = "top" | "right" | "bottom" | "left";
type CursorFollowAlign = "start" | "center" | "end";

type CursorFollowOffset = { x: number; y: number };

function buildFollowOffset(
  side: CursorFollowSide,
  align: CursorFollowAlign,
  sideOffset: number,
  alignOffset: number
): CursorFollowOffset {
  let x = 0;
  let y = 0;
  switch (side) {
    case "top":
      y = -sideOffset;
      break;
    case "bottom":
      y = sideOffset;
      break;
    case "left":
      x = -sideOffset;
      break;
    case "right":
      x = sideOffset;
      break;
  }
  switch (align) {
    case "start":
      x += alignOffset;
      y += alignOffset;
      break;
    case "end":
      x -= alignOffset;
      y -= alignOffset;
      break;
    case "center":
    default:
      break;
  }
  return { x, y };
}

type CursorFollowProps = React.PropsWithChildren<{
  side?: CursorFollowSide;
  align?: CursorFollowAlign;
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
}>;

function CursorFollow({
  children,
  side = "bottom",
  align = "end",
  sideOffset = 15,
  alignOffset = 5,
  className,
}: CursorFollowProps) {
  const { cursorPos } = useCursor();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    x.set(cursorPos.x);
    y.set(cursorPos.y);
  }, [cursorPos, x, y]);

  const smoothX = useSpring(x, { damping: 25, stiffness: 300 });
  const smoothY = useSpring(y, { damping: 25, stiffness: 300 });

  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  const scaleX = useTransform(velocityX, [-1000, 0, 1000], [0.9, 1, 1.15]);
  const scaleY = useTransform(velocityY, [-1000, 0, 1000], [1.15, 1, 0.9]);
  const skewX = useTransform(velocityX, [-1000, 0, 1000], [-3, 0, 3]);
  const skewY = useTransform(velocityY, [-1000, 0, 1000], [-3, 0, 3]);

  const offset = React.useMemo(
    () => buildFollowOffset(side, align, sideOffset, alignOffset),
    [side, align, sideOffset, alignOffset]
  );

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[9998] origin-top-left rounded-md bg-foreground px-2 py-1 text-sm text-background",
        className
      )}
      style={{
        x: smoothX,
        y: smoothY,
        translateX: offset.x,
        translateY: offset.y,
        scaleX,
        scaleY,
        skewX,
        skewY,
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cursor — animated SVG arrow with spring physics                           */
/* -------------------------------------------------------------------------- */

function Cursor({ className }: { className?: string }) {
  const { cursorPos } = useCursor();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    x.set(cursorPos.x);
    y.set(cursorPos.y);
  }, [cursorPos, x, y]);

  const smoothX = useSpring(x, { damping: 25, stiffness: 300 });
  const smoothY = useSpring(y, { damping: 25, stiffness: 300 });

  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  // Tilt the cursor based on velocity for a gravity feel.
  const rotate = useSpring(
    useTransform([velocityX, velocityY], ([vx, vy]) => {
      const rx = ((vx as number) / 1000) * 30;
      const ry = ((vy as number) / 1000) * 30;
      return Math.max(-45, Math.min(45, rx + ry));
    }),
    { damping: 15, stiffness: 200 }
  );

  const scale = useTransform([velocityX, velocityY], ([vx, vy]) => {
    const velocity = Math.sqrt((vx as number) ** 2 + (vy as number) ** 2);
    return 1 - Math.min(velocity / 2000, 0.1);
  });

  return (
    <motion.svg
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[9999] size-6 text-foreground",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      style={{
        x: smoothX,
        y: smoothY,
        rotate,
        scale,
        transformOrigin: "4.5% 11%", // Tip of the SVG path
        // Override default centering to align tip with cursor.
        translateX: "-4.5%",
        translateY: "-11%",
      }}
    >
      <path
        fill="currentColor"
        d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
      />
    </motion.svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Composed provider — wraps provider + container, ready for global use       */
/* -------------------------------------------------------------------------- */

export function GlobalCursor({
  label = "Designer",
  sideOffset = 55,
  alignOffset = 15,
  enabled = true,
}: {
  label?: React.ReactNode;
  sideOffset?: number;
  alignOffset?: number;
  /** Set to false to render nothing (e.g. on /admin where native cursor is needed). */
  enabled?: boolean;
} = {}) {
  if (!enabled) return null;
  return (
    <CursorProvider global>
      <CursorContainer>
        <Cursor />
        <CursorFollow sideOffset={sideOffset} alignOffset={alignOffset}>
          {label}
        </CursorFollow>
      </CursorContainer>
    </CursorProvider>
  );
}

export {
  CursorProvider,
  CursorContainer,
  Cursor,
  CursorFollow,
  useCursor,
  type CursorProviderProps,
  type CursorFollowProps,
  type CursorFollowSide,
  type CursorFollowAlign,
};

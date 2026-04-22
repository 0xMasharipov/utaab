import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

const getBreakpoint = (): Breakpoint => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(getBreakpoint);

  useEffect(() => {
    // Correct on mount in case SSR default differed
    setBp(getBreakpoint());

    let timer: ReturnType<typeof setTimeout> | null = null;
    const handler = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setBp(getBreakpoint()), 100);
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return bp;
}

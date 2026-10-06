"use client";

import { useEffect, useRef } from "react";
import { mountOrb, type OrbLook, type OrbOptions, type OrbRender, type OrbShape, type OrbState, type OrbVariant } from "./thinking-orb-core";

export type { OrbLook, OrbOptions, OrbRender, OrbShape, OrbState, OrbVariant };

/**
 * An animated status indicator for what an AI agent is doing: a `state`, and optionally one of that
 * state's `variant`s. It draws in the text color, so `text-*` classes tint it, and every orb is
 * tuned to read at 20px. `shape`, `render`, `density`, `dotSize` and `tilt` change how it's drawn.
 * `paused` holds it on its frame.
 */
export function Orb({
  state,
  variant,
  size = 20,
  speed = 1,
  paused = false,
  label,
  shape,
  render,
  density,
  dotSize,
  tilt,
  className,
}: OrbOptions & { paused?: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const orb = useRef<ReturnType<typeof mountOrb>>(null);
  useEffect(() => {
    // Destructuring split state from variant, so TypeScript no longer sees they belong together.
    const svg = ref.current;
    if (!svg) return;
    const mountedOrb = mountOrb(svg, { state, variant, size, speed, label, shape, render, density, dotSize, tilt } as OrbOptions);
    orb.current = mountedOrb;
    return mountedOrb.destroy;
  }, [state, variant, size, speed, label, shape, render, density, dotSize, tilt]);
  // After the mount above, so a remounted orb comes back paused if it should be.
  useEffect(() => {
    const mountedOrb = orb.current;
    if (!mountedOrb) return;
    if (paused) mountedOrb.pause();
    else mountedOrb.play();
  }, [paused, state, variant, size, speed, label, shape, render, density, dotSize, tilt]);
  // The same a11y attributes mountOrb sets, so the server's HTML has them before it runs.
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="currentColor" className={className} {...a11y} />;
}

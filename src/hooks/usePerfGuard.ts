import { useEffect, useRef, useState } from 'react';

export type PerfTier = 'full' | 'reduced' | 'minimal';

const TIER_RANK: Record<PerfTier, number> = { full: 2, reduced: 1, minimal: 0 };

function getInitialTier(): PerfTier {
  if (typeof window === 'undefined') return 'full';
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'minimal';
    const nav = navigator as any;
    const mem: number | undefined = nav.deviceMemory;
    const cores: number | undefined = nav.hardwareConcurrency;
    if ((typeof mem === 'number' && mem > 0 && mem <= 2) ||
        (typeof cores === 'number' && cores > 0 && cores <= 2)) {
      return 'minimal';
    }
    const saveData = nav.connection && nav.connection.saveData === true;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth <= 768;
    if (saveData || (typeof mem === 'number' && mem > 0 && mem <= 4) || (coarse && small)) {
      return 'reduced';
    }
  } catch {
    /* ignore */
  }
  return 'full';
}

/**
 * Adaptive performance guard. Returns a sticky `tier` that only ever
 * downgrades (full → reduced → minimal) when the device shows real
 * pressure (low FPS, jank spikes, or memory pressure on Chromium).
 *
 * Fully passive: no telemetry, no throw, no upgrades.
 */
export function usePerfGuard(): PerfTier {
  const [tier, setTier] = useState<PerfTier>(getInitialTier);
  const tierRef = useRef<PerfTier>(tier);
  tierRef.current = tier;

  useEffect(() => {
    if (tier === 'minimal') return; // already at floor

    let rafId = 0;
    let frames = 0;
    let windowStart = performance.now();
    let lastFrame = windowStart;
    let lowWindows = 0;
    let recentJank: number[] = [];
    let stopped = false;

    const downgrade = (reason: string) => {
      const current = tierRef.current;
      const next: PerfTier = current === 'full' ? 'reduced' : 'minimal';
      if (TIER_RANK[next] >= TIER_RANK[current]) return;
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(`[perf-guard] ${current} → ${next} (${reason})`);
      }
      setTier(next);
    };

    const tick = (now: number) => {
      if (stopped) return;
      const delta = now - lastFrame;
      lastFrame = now;

      // Single-frame jank spike (>120ms) twice within 3s
      if (delta > 120) {
        recentJank.push(now);
        recentJank = recentJank.filter((t) => now - t < 3000);
        if (recentJank.length >= 2) {
          recentJank = [];
          downgrade(`jank spike ${Math.round(delta)}ms`);
        }
      }

      frames++;
      if (frames >= 60) {
        const elapsed = now - windowStart;
        const fps = (frames * 1000) / elapsed;
        frames = 0;
        windowStart = now;
        if (fps < 45) {
          lowWindows++;
          if (lowWindows >= 2) {
            lowWindows = 0;
            downgrade(`avg fps ${fps.toFixed(0)}`);
          }
        } else {
          lowWindows = 0;
        }

        // Chromium-only heap pressure check
        const mem = (performance as any).memory;
        if (mem && mem.jsHeapSizeLimit > 0) {
          const ratio = mem.usedJSHeapSize / mem.jsHeapSizeLimit;
          if (ratio > 0.85) {
            if (tierRef.current !== 'minimal') {
              if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.warn(`[perf-guard] heap ${(ratio * 100).toFixed(0)}% → minimal`);
              }
              setTier('minimal');
            }
          }
        }
      }

      if (tierRef.current === 'minimal') return;
      rafId = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId && tierRef.current !== 'minimal') {
        windowStart = performance.now();
        lastFrame = windowStart;
        frames = 0;
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    rafId = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tier]);

  return tier;
}

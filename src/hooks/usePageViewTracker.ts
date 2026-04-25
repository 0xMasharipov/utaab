import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SKIP_PREFIXES = ['/v8k2m9x4', '/j3r7x1w9', '/profile/admin'];

/**
 * Sends a fire-and-forget visit ping on every public route change.
 * Skips admin/auth-protected routes. Debounces duplicate fires.
 */
export function usePageViewTracker() {
  const location = useLocation();
  const lastSentRef = useRef<{ path: string; ts: number } | null>(null);

  useEffect(() => {
    const path = location.pathname + location.search;

    if (SKIP_PREFIXES.some((p) => location.pathname.startsWith(p))) return;

    // Debounce duplicates within 1s (StrictMode safety)
    const now = Date.now();
    if (
      lastSentRef.current &&
      lastSentRef.current.path === path &&
      now - lastSentRef.current.ts < 1000
    ) {
      return;
    }
    lastSentRef.current = { path, ts: now };

    // Fire-and-forget
    try {
      supabase.functions
        .invoke('track-visit', {
          body: {
            path: location.pathname,
            referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
          },
        })
        .catch(() => {
          // Silently ignore — analytics must never break UX
        });
    } catch {
      // ignore
    }
  }, [location.pathname, location.search]);
}

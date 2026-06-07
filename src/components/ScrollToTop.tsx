import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll to the top on route change.
 * Skips when a URL hash is present or a `scrollTo` location state is set,
 * so in-page anchors and cross-route section scrolling keep working.
 */
const ScrollToTop = () => {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    if (hash) return;
    if (state && typeof state === "object" && (state as any).scrollTo) return;
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash, state]);

  return null;
};

export default ScrollToTop;


import { useEffect, useState } from 'react';

/** Footer visibility overrides page direction, including lazy-mounted footers. */
export function useFloatingNavigation(routeKey: string) {
  const [scrollVisible, setScrollVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    setScrollVisible(true);
    setFooterVisible(false);
    let referenceY = Math.max(0, window.scrollY);
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y < 24) setScrollVisible(true);
      else if (Math.abs(y - referenceY) >= 10) setScrollVisible(y < referenceY);
      if (Math.abs(y - referenceY) >= 10 || y < 24) referenceY = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    let observed: Element | null = null;
    const footerObserver = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry?.isIntersecting ?? false);
    });
    const findFooter = () => {
      const footer = document.querySelector('footer.footer-surface');
      if (footer === observed) return;
      if (observed) footerObserver.unobserve(observed);
      observed = footer;
      setFooterVisible(false);
      if (footer) footerObserver.observe(footer);
    };
    findFooter();
    const mutations = new MutationObserver(findFooter);
    mutations.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      footerObserver.disconnect();
      mutations.disconnect();
    };
  }, [routeKey]);
  return { scrollVisible, footerVisible };
}

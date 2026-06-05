import { useState, lazy, Suspense, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HeroCarousel } from '@/components/HeroCarousel';
import BackgroundGrid from '@/components/BackgroundGrid';

// Lazy load decorative background (causes forced reflow, not critical for FCP)
const AnimatedBlobBackground = lazy(() => import('@/components/AnimatedBlobBackground'));

// Lazy load all below-fold sections to reduce TTI
const AboutBlurb = lazy(() => import('@/components/AboutBlurb').then(m => ({ default: m.AboutBlurb })));
const Community = lazy(() => import('@/components/Community').then(m => ({ default: m.Community })));
const Learn = lazy(() => import('@/components/Learn').then(m => ({ default: m.Learn })));

const Projects = lazy(() => import('@/components/Projects').then(m => ({ default: m.Projects })));
const Events = lazy(() => import('@/components/Events').then(m => ({ default: m.Events })));
const BlogSection = lazy(() => import('@/components/BlogSection').then(m => ({ default: m.BlogSection })));
const Join = lazy(() => import('@/components/Join').then(m => ({ default: m.Join })));
const Footer = lazy(() => import('@/components/Footer').then(m => ({ default: m.Footer })));
const BottomGradientOverlay = lazy(() => import('@/components/BottomGradientOverlay'));

// Defer privacy components until after idle
const PrivacyPopup = lazy(() => import('@/components/PrivacyPopup').then(m => ({ default: m.PrivacyPopup })));
const PrivacyCenter = lazy(() => import('@/components/PrivacyCenter').then(m => ({ default: m.PrivacyCenter })));
const FloatingPrivacyButton = lazy(() => import('@/components/FloatingPrivacyButton').then(m => ({ default: m.FloatingPrivacyButton })));

const Index = () => {
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [showDeferred, setShowDeferred] = useState(false);
  const [showBelowFold, setShowBelowFold] = useState(false);

  useEffect(() => {
    // Load deferred CSS for below-fold components
    import('@/styles/deferred.css');

    // Pre-warm below-fold images during the idle window so they're cached
    // before the IntersectionObserver triggers — eliminates static pop-in.
    // Network-aware: skip on Save-Data / 2g; trim list on 3g / mobile.
    const allPreloadImages = [
      '/images/about/UTAAB_Education.webp',
      '/images/about/UTAAB_Projects_1.webp',
      '/images/projects/UTAAB_UBP.webp',
      '/images/projects/UTAAB_TonRa.webp',
      '/images/learn/UTAAB_Edu_Guides.webp',
    ];
    const conn = (navigator as any).connection;
    const saveData = conn?.saveData === true;
    const effective = conn?.effectiveType as string | undefined;
    const isMobileVp = window.matchMedia('(max-width: 767px)').matches;
    let preloadImages: string[] = allPreloadImages;
    if (saveData || effective === 'slow-2g' || effective === '2g') {
      preloadImages = [];
    } else if (effective === '3g') {
      preloadImages = allPreloadImages.slice(0, 2);
    } else if (isMobileVp) {
      preloadImages = allPreloadImages.slice(0, 3);
    }
    const injectPreloads = () => {
      preloadImages.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = href;
        (link as any).fetchPriority = 'low';
        document.head.appendChild(link);
      });
    };
    const preloadId = preloadImages.length === 0
      ? undefined
      : 'requestIdleCallback' in window
        ? (window as any).requestIdleCallback(injectPreloads, { timeout: 2500 })
        : setTimeout(injectPreloads, 800);

    // Mount below-fold sections after the hero has painted to shorten
    // the initial critical request chain. Uses rAF + idle callback to
    // ensure LCP element renders first, then trigger the lazy wave.
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const rafId = requestAnimationFrame(() => {
      if ('requestIdleCallback' in window) {
        idleId = (window as any).requestIdleCallback(() => setShowBelowFold(true), { timeout: 1500 });
      } else {
        timeoutId = (window as any).setTimeout(() => setShowBelowFold(true), 200);
      }
    });

    // Defer privacy components until browser is idle (longer delay)
    const id = 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(() => setShowDeferred(true), { timeout: 3000 })
      : setTimeout(() => setShowDeferred(true), 1500);
    return () => {
      cancelAnimationFrame(rafId);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if ('requestIdleCallback' in window) {
        (window as any).cancelIdleCallback(id);
        if (preloadId !== undefined) (window as any).cancelIdleCallback(preloadId);
      } else {
        clearTimeout(id);
        if (preloadId !== undefined) clearTimeout(preloadId as any);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={null}><AnimatedBlobBackground /></Suspense>
      <Navbar />
      <Hero />
      <HeroCarousel />
      
      {showBelowFold && (
        <Suspense fallback={null}>
          <BackgroundGrid>
            <AboutBlurb />
            <Projects />
            <Community />
            <Learn />
            <Events />
            <BlogSection />
            <Join />
            <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
          </BackgroundGrid>
        </Suspense>
      )}
      
      {showDeferred && (
        <Suspense fallback={null}>
          <PrivacyPopup
            onAccept={() => console.log('Privacy accepted')}
            onCustomize={() => setIsPrivacyCenterOpen(true)}
          />
          <PrivacyCenter
            isOpen={isPrivacyCenterOpen}
            onClose={() => setIsPrivacyCenterOpen(false)}
          />
          <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
          <BottomGradientOverlay />
        </Suspense>
      )}
    </div>
  );
};

export default Index;

import { useState, lazy, Suspense, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HeroCarousel } from '@/components/HeroCarousel';
import BackgroundGrid from '@/components/BackgroundGrid';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';

// Lazy load all below-fold sections to reduce TTI
const AboutBlurb = lazy(() => import('@/components/AboutBlurb').then(m => ({ default: m.AboutBlurb })));
const Community = lazy(() => import('@/components/Community').then(m => ({ default: m.Community })));
const Learn = lazy(() => import('@/components/Learn').then(m => ({ default: m.Learn })));
const Resources = lazy(() => import('@/components/Resources').then(m => ({ default: m.Resources })));
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

  useEffect(() => {
    // Defer privacy components until browser is idle
    const id = 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(() => setShowDeferred(true), { timeout: 3000 })
      : setTimeout(() => setShowDeferred(true), 1500);
    return () => {
      if ('requestIdleCallback' in window) {
        (window as any).cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />
      <Hero />
      <HeroCarousel />
      
      <Suspense fallback={null}>
        <BackgroundGrid>
          <AboutBlurb />
          <Community />
          <Learn />
          <Resources />
          <Projects />
          <Events />
          <BlogSection />
          <Join />
          <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
        </BackgroundGrid>
      </Suspense>
      
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

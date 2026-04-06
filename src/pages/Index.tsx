import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';

import { Community } from '@/components/Community';
import { Learn } from '@/components/Learn';
import { Events } from '@/components/Events';
import { BlogSection } from '@/components/BlogSection';
import { Projects } from '@/components/Projects';
import { Resources } from '@/components/Resources';

import { Join } from '@/components/Join';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import BackgroundGrid from '@/components/BackgroundGrid';
import BottomGradientOverlay from '@/components/BottomGradientOverlay';


const Index = () => {
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />
      <Hero />
      <HeroCarousel />
      
      <BackgroundGrid>
        <Community />
        <Learn />
        <Events />
        <BlogSection />
        <Projects />
        <Resources />
        
        <Join />
        <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      </BackgroundGrid>
      
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
    </div>
  );
};

export default Index;

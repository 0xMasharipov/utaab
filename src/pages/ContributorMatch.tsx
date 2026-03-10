import { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import ContributorHero from '@/components/contributor/ContributorHero';
import HowItWorks from '@/components/contributor/HowItWorks';
import AssessmentForm from '@/components/contributor/AssessmentForm';
import AssessmentResult from '@/components/contributor/AssessmentResult';
import ContributorArchetypes from '@/components/contributor/ContributorArchetypes';
import ContributorCTA from '@/components/contributor/ContributorCTA';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { FormData } from '@/components/contributor/AssessmentForm';
import type { AIResult } from '@/components/contributor/AssessmentResult';

const ContributorMatch = () => {
  const [result, setResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setSubmitted(true);

    // Scroll to result area
    setTimeout(() => {
      window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: 'smooth' });
    }, 100);

    try {
      const { data, error } = await supabase.functions.invoke('contributor-match', {
        body: { formData },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data.result);
      toast({ title: 'Analysis complete!', description: 'Your contributor profile is ready.' });
    } catch (err: any) {
      console.error('Assessment error:', err);
      const message = err?.message || 'Failed to analyze your profile. Please try again.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      setSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      <ContributorHero onStartAssessment={scrollToForm} onLearnMore={scrollToHowItWorks} />

      <div ref={howItWorksRef}>
        <HowItWorks />
      </div>

      <div ref={formRef}>
        {!submitted ? (
          <AssessmentForm onSubmit={handleSubmit} isSubmitting={isLoading} />
        ) : (
          <AssessmentResult result={result} isLoading={isLoading} />
        )}
      </div>

      {!submitted && (
        <>
          <ContributorArchetypes />
          <ContributorCTA onStartAssessment={scrollToForm} />
        </>
      )}

      <Footer />
    </div>
  );
};

export default ContributorMatch;

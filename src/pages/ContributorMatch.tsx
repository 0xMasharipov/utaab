import { useState, useRef, useEffect, useCallback } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'iconoir-react';
import { Compass, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ContributorHero from '@/components/contributor/ContributorHero';
import HowItWorks from '@/components/contributor/HowItWorks';
import AssessmentForm, { STORAGE_KEY, type FormData } from '@/components/contributor/AssessmentForm';
import AssessmentResult from '@/components/contributor/AssessmentResult';
import ContributorArchetypes from '@/components/contributor/ContributorArchetypes';
import { supabase } from '@/integrations/supabase/client';
import { validateResult, type AIResult } from '../../supabase/functions/_shared/contributor-contract';
import '@/components/contributor/contributor.css';

export default function ContributorMatch() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const assessmentView = searchParams.get('view') === 'assessment';
  const [started, setStarted] = useState(assessmentView);
  const [result, setResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const scrollTo = useCallback((element: HTMLElement | null) => element?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }), [reduced]);
  const changeView = (assessment: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (assessment) next.set('view', 'assessment'); else next.delete('view');
    setSearchParams(next);
  };

  useEffect(() => {
    if (assessmentView) setStarted(true);
    const target = assessmentView ? formRef.current : overviewRef.current;
    const frame = requestAnimationFrame(() => {
      scrollTo(target);
      target?.querySelector<HTMLElement>(assessmentView ? (result ? '[data-report-title]' : isLoading ? '[data-loading-title]' : '.cm-form-panel-header h3') : '[data-overview-title]')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [assessmentView, isLoading, result, scrollTo]);

  const handleSubmit = async (formData: FormData) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setIsLoading(true);
    setError('');
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('contributor-match', { body: { formData } });
      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);
      const report = validateResult(data?.result, { ...formData }, true);
      setResult(report);
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* A browser with storage disabled still supports submission. */ }
    } catch (cause: unknown) {
      const status = cause && typeof cause === 'object' && 'context' in cause && cause.context instanceof Response ? cause.context.status : undefined;
      setError(t(status === 429 ? 'contributor.studio.rateLimit' : status === 402 || status === 503 ? 'contributor.studio.unavailable' : 'contributor.studio.submitError'));
    } finally {
      setIsLoading(false);
      inFlight.current = false;
    }
  };

  return <MotionConfig reducedMotion="user"><div className="contributor-studio min-h-screen">
    <Navbar />
    <main>
      <div ref={overviewRef} hidden={assessmentView} className="cm-overview">
        <ContributorHero onStartAssessment={() => changeView(true)} started={started} completed={!!result} />
        <div className="cm-overview-details cm-shell">
          <details className="cm-details"><summary><Compass size={18} aria-hidden="true" />{t('contributor.journey.howItWorks')}</summary><HowItWorks /></details>
          <details className="cm-details"><summary><Users size={18} aria-hidden="true" />{t('contributor.journey.exploreRoles')}</summary><ContributorArchetypes /></details>
        </div>
      </div>
      <div ref={formRef} hidden={!assessmentView} className="cm-assessment-view">
        <div className="cm-journey-header cm-shell">
          <button className="cm-text-button cm-back-overview" onClick={() => changeView(false)}><ArrowLeft width={17} aria-hidden="true" />{t('contributor.journey.backOverview')}</button>
          <h1>{t(result ? 'contributor.studio.reportTitle' : 'contributor.studio.assessmentTitle')}</h1>
        </div>
        {result ? <AssessmentResult result={result} isLoading={false} /> : <>
          {isLoading && <AssessmentResult result={null} isLoading />}
          <div hidden={isLoading}><AssessmentForm onSubmit={handleSubmit} isSubmitting={isLoading} submissionError={error} /></div>
        </>}
      </div>
    </main>
    <Footer onPrivacyClick={() => window.open('/privacy-policy', '_blank', 'noopener,noreferrer')} />
  </div></MotionConfig>;
}

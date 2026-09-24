import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'iconoir-react';
import { AnimatedUtaabMark, Reveal } from './ContributorMotion';
import { roles, type AIResult, type Evidence } from '../../../supabase/functions/_shared/contributor-contract';
export type { AIResult } from '../../../supabase/functions/_shared/contributor-contract';

export function ReportEvidence({ evidence }: { evidence: Evidence[] }) {
  const { t } = useTranslation();
  return <div className="cm-report-evidence">{evidence.map((item, i) => {
    const source = ['deadline', 'evidence', 'priorities'].includes(item.source)
      ? t(`contributor.studio.${item.source}Title`)
      : t(`contributor.form.${item.source}`);
    return <blockquote className="cm-evidence" key={i}><span dir="auto">“{item.quote}”</span><cite>{t('contributor.studio.source', { source })}</cite></blockquote>;
  })}</div>;
}

// Shared with the existing reviewer screen: the same observations, quotes, and caveats.
export function ReportInsights({ result }: { result: AIResult }) {
  const { t } = useTranslation();
  return <>
    {!!result.role_evidence?.length && <div className="cm-report-block"><h3>{t('contributor.studio.roleEvidence')}</h3><ReportEvidence evidence={result.role_evidence} /></div>}
    {!!result.observations?.length && <>
      <h3 className="cm-report-section-title">{t('contributor.studio.observations')}</h3>
      <div className="cm-report-observations">{result.observations.map(item => <article key={item.dimension} className="cm-report-block">
        <h3>{t(`contributor.studio.${item.dimension}`)}</h3><p>{item.observation}</p>
        <ReportEvidence evidence={item.evidence} />
        <p className="cm-uncertainty"><strong>{t('contributor.studio.uncertainty')}: </strong>{item.uncertainty}</p>
      </article>)}</div>
    </>}
    {!!result.discussion_questions?.length && <div className="cm-report-block"><h3>{t('contributor.studio.discussion')}</h3><ul>{result.discussion_questions.map((question, i) => <li key={i}>{question}</li>)}</ul></div>}
  </>;
}

export default function AssessmentResult({ result, isLoading, embedded = false }: { result: AIResult | null; isLoading: boolean; embedded?: boolean }) {
  const { t } = useTranslation();
  const roleName = (role: string) => {
    const index = roles.indexOf(role as typeof roles[number]);
    return index < 0 ? role : t(`contributor.studio.roleNames.${index}`);
  };
  if (isLoading) return <section className="cm-shell cm-loading" role="status" aria-live="polite">
    <AnimatedUtaabMark /><div><h2 tabIndex={-1} data-loading-title>{t('contributor.studio.loadingTitle')}</h2><p>{t('contributor.studio.loadingText')}</p></div>
  </section>;
  if (!result) return null;
  if (!embedded) return <section className="cm-report cm-student-report cm-shell">
    <header className="cm-report-heading">
      <p className="cm-report-label">{t('contributor.result.primaryMatch')}</p>
      <h2 tabIndex={-1} data-report-title>{roleName(result.primary_role)}</h2>
      <p>{result.profile_summary}</p>
    </header>
    <div className="cm-report-block"><h3>{t('contributor.journey.firstContribution')}</h3><p>{result.suggested_first_step}</p></div>
    <details className="cm-details cm-report-details"><summary>{t('contributor.studio.roleEvidence')}</summary>
      <p className="cm-report-reason">{result.why_this_role}</p>
      <ReportInsights result={result} />
    </details>
    <details className="cm-details cm-report-details"><summary>{t('contributor.journey.morePaths')}</summary>
      <div className="cm-report-stack">
        <div className="cm-report-block"><span className="cm-report-label">{t('contributor.result.secondaryMatch')}</span><h3 className="cm-report-role">{roleName(result.secondary_role)}</h3><p>{t('contributor.studio.estimate')}: {Math.round(result.compatibility_score)} / 100</p><p className="cm-uncertainty">{t('contributor.studio.estimateNote')}</p></div>
        <div className="cm-report-block"><h3>{t('contributor.result.yourStrengths')}</h3><ul>{result.strengths.map((strength, i) => <li key={i}>{strength}</li>)}</ul></div>
        <div className="cm-report-block"><h3>{t('contributor.result.growthRecommendations')}</h3><p>{result.growth_recommendations}</p></div>
        <div className="cm-report-block"><h3>{t('contributor.result.growthPath')}</h3><p>{result.growth_path}</p></div>
        <div className="cm-report-block"><h3>{t('contributor.result.recommendedDepartment')}</h3><p>{result.recommended_department}</p></div>
      </div>
    </details>
    <p className="cm-disclosure">{t('contributor.studio.disclosure')}</p>
    <a className="cm-button mt-8" href="/">{t('contributor.result.exploreUtaab')}<ArrowUpRight width={18} aria-hidden="true" /></a>
  </section>;
  return <section className="cm-report">
    <Reveal className="cm-report-heading">
      <h2 tabIndex={-1} data-report-title>{t('contributor.studio.reportTitle')}</h2><p>{result.profile_summary}</p>
    </Reveal>
    <div className="cm-report-grid">
      <div className="cm-report-block"><span className="cm-report-label">{t('contributor.result.primaryMatch')}</span><h3 className="cm-report-role">{roleName(result.primary_role)}</h3><p>{result.why_this_role}</p></div>
      <div className="cm-report-block"><span className="cm-report-label">{t('contributor.result.secondaryMatch')}</span><h3 className="cm-report-role">{roleName(result.secondary_role)}</h3><p>{t('contributor.studio.estimate')}: {Math.round(result.compatibility_score)} / 100</p><p className="cm-uncertainty">{t('contributor.studio.estimateNote')}</p></div>
    </div>
    <div className="cm-report-stack mt-6"><ReportInsights result={result} /></div>
    <h3 className="cm-report-section-title mb-6">{t('contributor.result.suggestedNextSteps')}</h3>
    <div className="cm-report-grid">
      <div className="cm-report-stack">
        <div className="cm-report-block"><h3>{t('contributor.result.suggestedNextSteps')}</h3><p>{result.suggested_first_step}</p></div>
        <div className="cm-report-block"><h3>{t('contributor.result.growthRecommendations')}</h3><p>{result.growth_recommendations}</p></div>
        <div className="cm-report-block"><h3>{t('contributor.result.growthPath')}</h3><p>{result.growth_path}</p></div>
      </div>
      <div className="cm-report-stack">
        <div className="cm-report-block"><h3>{t('contributor.result.yourStrengths')}</h3><ul>{result.strengths.map((strength,i) => <li key={i}>{strength}</li>)}</ul></div>
        <div className="cm-report-block"><h3>{t('contributor.result.recommendedDepartment')}</h3><p>{result.recommended_department}</p></div>
      </div>
    </div>
    <p className="cm-disclosure">{t('contributor.studio.disclosure')}</p>
  </section>;
}

import { ArrowUpRight } from 'iconoir-react';
import { useTranslation } from 'react-i18next';
import { AnimatedUtaabMark } from './ContributorMotion';

export default function ContributorHero({ onStartAssessment, started = false, completed = false }: {
  onStartAssessment: () => void;
  started?: boolean;
  completed?: boolean;
}) {
  const { t } = useTranslation();
  return <section className="cm-welcome cm-shell">
    <div className="cm-welcome-copy">
      <p className="cm-eyebrow">UTAAB <span>/</span> {t('contributor.studio.label')}</p>
      <h1 tabIndex={-1} data-overview-title>{t('contributor.studio.headline1')} <span className="cm-accent">{t('contributor.studio.headline2')}</span></h1>
      <p className="cm-lead">{t('contributor.studio.intro')}</p>
      <button className="cm-button" onClick={onStartAssessment}>
        {t(completed ? 'contributor.journey.viewResults' : started ? 'contributor.journey.continue' : 'contributor.hero.startAssessment')}
        <ArrowUpRight width={20} aria-hidden="true" />
      </button>
    </div>
    <div className="cm-welcome-art" aria-hidden="true"><AnimatedUtaabMark /></div>
  </section>;
}

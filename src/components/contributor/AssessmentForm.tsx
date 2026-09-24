import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { NavArrowLeft, NavArrowRight, SendDiagonal } from 'iconoir-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { invalidAssessmentStage, isRecord, scenarioIds, type ScenarioId } from '../../../supabase/functions/_shared/contributor-contract';

export const STORAGE_KEY = 'utaab-contributor-assessment';

export interface FormData {
  assessmentVersion: 2;
  locale: string;
  scenarioAnswers: Record<ScenarioId, string>;
  fullName: string;
  email: string;
  university: string;
  yearOfStudy: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  hasCommunityExperience: boolean;
  communityExperienceDetails: string;
  topicInterests: string[];
  freeTimeActivities: string[];
  naturalWorkType: string[];
  strengths: string[];
  experienceRatings: Record<string, number>;
  bestTaskTypes: string[];
  workPreference: string;
  decisionStyle: string;
  personalityType: string;
  underPressure: string;
  motivations: string[];
  weeklyHours: string;
  contributionType: string;
  trackInterest: string;
  whyJoin: string;
  desiredImpact: string;
  proudAchievement: string;
  whatToBuild: string;
  bestTeamEnvironment: string;
}

const defaultFormData: FormData = {
  assessmentVersion: 2, locale: 'en', scenarioAnswers: { deadline: '', evidence: '', priorities: '' },
  fullName: '', email: '', university: '', yearOfStudy: '', linkedIn: '', github: '', portfolio: '',
  hasCommunityExperience: false, communityExperienceDetails: '',
  topicInterests: [], freeTimeActivities: [], naturalWorkType: [],
  strengths: [], experienceRatings: {}, bestTaskTypes: [],
  workPreference: '', decisionStyle: '', personalityType: '', underPressure: '',
  motivations: [], weeklyHours: '', contributionType: '', trackInterest: '',
  whyJoin: '', desiredImpact: '', proudAchievement: '', whatToBuild: '', bestTeamEnvironment: '',
};

const countWords = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

interface AssessmentFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  submissionError?: string;
  isSubmitting: boolean;
}

function MultiSelect({ label, options, selected, onChange, columns = 2 }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void; columns?: number }) {
  return (
    <div role="group" aria-label={label} className={`grid gap-2 ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] cursor-pointer transition-colors">
          <Checkbox
            checked={selected.includes(opt)}
            onCheckedChange={(checked) => {
              onChange(checked ? [...selected, opt] : selected.filter(s => s !== opt));
            }}
          />
          <span className="text-sm text-foreground">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function SingleSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="group" aria-label={label} className="cm-single-options grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={`p-3 rounded-xl text-sm text-left border transition-all duration-200 ${
            value === opt
              ? 'bg-primary/20 border-primary/50 text-foreground shadow-[0_0_15px_hsl(var(--primary)/0.15)]'
              : 'bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:bg-white/[0.08]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function RatingGroup({ label, areas, ratings, onChange }: { label: string; areas: string[]; ratings: Record<string, number>; onChange: (r: Record<string, number>) => void }) {
  return (
    <div role="group" aria-label={label} className="space-y-3">
      {areas.map((area) => (
        <div key={area} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <span className="text-sm text-foreground min-w-[160px]">{area}</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${area}: ${n} / 5`}
                aria-pressed={ratings[area] === n}
                onClick={() => onChange({ ...ratings, [area]: n })}
                className={`w-11 h-11 rounded-lg text-sm font-medium transition-all ${
                  (ratings[area] || 0) >= n
                    ? 'bg-primary/30 text-secondary border border-primary/50'
                    : 'bg-white/[0.04] text-muted-foreground border border-white/[0.08] hover:bg-white/[0.08]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children, required, htmlFor }: { children: React.ReactNode; required?: boolean; htmlFor?: string }) {
  const Tag = htmlFor ? 'label' : 'div';
  return (
    <Tag htmlFor={htmlFor} className="block text-sm font-medium text-foreground mb-2">
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </Tag>
  );
}

const AssessmentForm = ({ onSubmit, isSubmitting, submissionError }: AssessmentFormProps) => {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [furthestStep, setFurthestStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);
  const submitting = useRef(false);
  const stepPickerRef = useRef<HTMLDetailsElement>(null);
  const invalidFocus = useRef<{ stage: number; selector: string } | null>(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (!isRecord(parsed)) return defaultFormData;
      const restored = { ...defaultFormData, scenarioAnswers: { ...defaultFormData.scenarioAnswers } };
      // Ignore damaged local storage instead of allowing it to break the form.
      for (const key of Object.keys(defaultFormData) as (keyof FormData)[]) {
        const value = parsed[key];
        const fallback = defaultFormData[key];
        if ((typeof fallback === 'string' && typeof value === 'string') ||
            (typeof fallback === 'boolean' && typeof value === 'boolean') ||
            (Array.isArray(fallback) && Array.isArray(value) && value.every(v => typeof v === 'string'))) {
          Object.assign(restored, { [key]: value });
        }
      }
      if (isRecord(parsed.experienceRatings)) restored.experienceRatings = Object.fromEntries(Object.entries(parsed.experienceRatings).filter(([,v]) => typeof v === 'number' && v >= 1 && v <= 5)) as Record<string, number>;
      if (isRecord(parsed.scenarioAnswers)) for (const id of scenarioIds) {
        if (typeof parsed.scenarioAnswers[id] === 'string') restored.scenarioAnswers[id] = parsed.scenarioAnswers[id] as string;
      }
      return { ...restored, scenarioAnswers: { ...restored.scenarioAnswers } };
    } catch {
      return defaultFormData;
    }
  });

  const STEPS = [
    t('contributor.form.steps.aboutYou'),
    t('contributor.form.steps.interests'),
    t('contributor.form.steps.skills'),
    t('contributor.form.steps.workStyle'),
    t('contributor.form.steps.motivation'),
    t('contributor.studio.scenarios'),
    t('contributor.form.steps.review'),
  ];

  const TOPIC_INTERESTS = Object.values(t('contributor.form.topicOptions', { returnObjects: true }) as Record<string, string>);
  const FREE_TIME = Object.values(t('contributor.form.freeTimeOptions', { returnObjects: true }) as Record<string, string>);
  const NATURAL_WORK = Object.values(t('contributor.form.naturalWorkOptions', { returnObjects: true }) as Record<string, string>);
  const STRENGTHS = Object.values(t('contributor.form.strengthOptions', { returnObjects: true }) as Record<string, string>);
  const EXPERIENCE_AREAS = Object.values(t('contributor.form.experienceAreas', { returnObjects: true }) as Record<string, string>);
  const BEST_TASKS = Object.values(t('contributor.form.bestTaskOptions', { returnObjects: true }) as Record<string, string>);
  const MOTIVATIONS = Object.values(t('contributor.form.motivationOptions', { returnObjects: true }) as Record<string, string>);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(formData)); } catch { setStorageAvailable(false); }
  }, [formData]);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const moveToStep = (next: number) => {
    if (stepPickerRef.current) stepPickerRef.current.open = false;
    invalidFocus.current = null;
    stepChanged.current = true;
    headingRef.current?.focus({ preventScroll: true });
    setDirection(next > step ? 1 : -1);
    setValidationError('');
    setStep(next);
    setFurthestStep(previous => Math.max(previous, next));
  };

  const validateStep = (all = false): boolean => {
    const invalid = invalidAssessmentStage({ ...formData });
    if (invalid !== null && (all || invalid <= step)) {
      if (invalid !== step) moveToStep(invalid);
      const errors = [
        !formData.fullName.trim() || !formData.email.trim() ? 'contributor.form.validation.fillNameEmail' : 'contributor.form.validation.invalidEmailDesc',
        'contributor.form.validation.selectInterest',
        'contributor.form.validation.selectStrength',
        'contributor.form.validation.answerAll',
        !formData.weeklyHours ? 'contributor.form.validation.fillAvailability' : 'contributor.studio.stageValidation',
        'contributor.studio.scenarioValidation',
      ];
      const selectors = [
        !formData.fullName.trim() ? '#contributor-fullName' : '#contributor-email',
        '[role="checkbox"]',
        '[role="checkbox"]',
        `.space-y-8 > div:nth-child(${!formData.workPreference ? 1 : 2}) [role="group"] button`,
        !formData.weeklyHours ? '[role="group"] button' : '#contributor-whyJoin',
        `#${scenarioIds.find(id => formData.scenarioAnswers[id].trim().length < 80 || formData.scenarioAnswers[id].trim().length > 2000) || scenarioIds[0]}-answer`,
      ];
      invalidFocus.current = { stage: invalid, selector: selectors[invalid] };
      setValidationError(t(errors[invalid]));
      requestAnimationFrame(() => prepareStep());
      return false;
    }
    return true;
  };
  const nextStep = () => { if (validateStep()) moveToStep(Math.min(step + 1, STEPS.length - 1)); };
  const prevStep = () => moveToStep(Math.max(step - 1, 0));
  const handleSubmit = async () => {
    if (submitting.current || isSubmitting || !validateStep(true)) return;
    submitting.current = true;
    try { await onSubmit({ ...formData, assessmentVersion: 2, locale: i18n.resolvedLanguage || 'en' }); }
    finally { submitting.current = false; }
  };

  const prepareStep = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (stepChanged.current) {
      headingRef.current?.focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      stepChanged.current = false;
    }
    const invalid = invalidFocus.current;
    if (invalid) {
      const field = panel.querySelector<HTMLElement>(`[data-stage="${invalid.stage}"] ${invalid.selector}`);
      if (field) {
        field.focus({ preventScroll: true });
        field.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        invalidFocus.current = null;
      }
    }
  }, [reduced]);
  useEffect(() => { prepareStep(); }, [prepareStep, step, i18n.resolvedLanguage]);

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="space-y-5">
          <div><FieldLabel required htmlFor="contributor-fullName">{t('contributor.form.fullName')}</FieldLabel><Input aria-required="true" maxLength={200} id="contributor-fullName" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder={t('contributor.form.fullName')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel required htmlFor="contributor-email">{t('contributor.form.email')}</FieldLabel><Input aria-required="true" maxLength={255} type="email" id="contributor-email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel htmlFor="contributor-university">{t('contributor.form.university')}</FieldLabel><Input maxLength={200} id="contributor-university" value={formData.university} onChange={e => updateField('university', e.target.value)} placeholder={t('contributor.form.universityPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.yearOfStudy')}</FieldLabel>
            <SingleSelect label={t('contributor.form.yearOfStudy')} options={[t('contributor.form.options.year1'), t('contributor.form.options.year2'), t('contributor.form.options.year3'), t('contributor.form.options.year4'), t('contributor.form.options.graduate'), t('contributor.form.options.other')]} value={formData.yearOfStudy} onChange={v => updateField('yearOfStudy', v)} />
          </div>
          <div><FieldLabel htmlFor="contributor-linkedIn">{t('contributor.form.linkedIn')}</FieldLabel><Input maxLength={200} id="contributor-linkedIn" value={formData.linkedIn} onChange={e => updateField('linkedIn', e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel htmlFor="contributor-github">{t('contributor.form.github')}</FieldLabel><Input maxLength={200} id="contributor-github" value={formData.github} onChange={e => updateField('github', e.target.value)} placeholder="https://github.com/..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel htmlFor="contributor-portfolio">{t('contributor.form.portfolio')}</FieldLabel><Input maxLength={200} id="contributor-portfolio" value={formData.portfolio} onChange={e => updateField('portfolio', e.target.value)} placeholder="https://..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div>
            <FieldLabel>{t('contributor.form.communityExperience')}</FieldLabel>
            <SingleSelect label={t('contributor.form.communityExperience')} options={[t('contributor.form.options.yes'), t('contributor.form.options.no')]} value={formData.hasCommunityExperience ? t('contributor.form.options.yes') : t('contributor.form.options.no')} onChange={v => updateField('hasCommunityExperience', v === t('contributor.form.options.yes'))} />
            {formData.hasCommunityExperience && (
              <div className="mt-3">
                <Textarea aria-label={t('contributor.form.communityExperienceDetails')} maxLength={2000} value={formData.communityExperienceDetails} onChange={e => updateField('communityExperienceDetails', e.target.value)} placeholder={t('contributor.form.communityExperienceDetails')} className="bg-white/[0.04] border-white/[0.1]" />
              </div>
            )}
          </div>
        </div>
      );
      case 1: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.topicInterests')}</FieldLabel><MultiSelect label={t('contributor.form.topicInterests')} options={TOPIC_INTERESTS} selected={formData.topicInterests} onChange={v => updateField('topicInterests', v)} columns={3} /></div>
          <div><FieldLabel>{t('contributor.form.freeTimeActivities')}</FieldLabel><MultiSelect label={t('contributor.form.freeTimeActivities')} options={FREE_TIME} selected={formData.freeTimeActivities} onChange={v => updateField('freeTimeActivities', v)} columns={3} /></div>
          <div><FieldLabel>{t('contributor.form.naturalWork')}</FieldLabel><MultiSelect label={t('contributor.form.naturalWork')} options={NATURAL_WORK} selected={formData.naturalWorkType} onChange={v => updateField('naturalWorkType', v)} /></div>
        </div>
      );
      case 2: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.strengths')}</FieldLabel><MultiSelect label={t('contributor.form.strengths')} options={STRENGTHS} selected={formData.strengths} onChange={v => updateField('strengths', v)} columns={3} /></div>
          <div><FieldLabel>{t('contributor.form.experienceLevel')}</FieldLabel><RatingGroup label={t('contributor.form.experienceLevel')} areas={EXPERIENCE_AREAS} ratings={formData.experienceRatings} onChange={v => updateField('experienceRatings', v)} /></div>
          <div><FieldLabel>{t('contributor.form.bestTasks')}</FieldLabel><MultiSelect label={t('contributor.form.bestTasks')} options={BEST_TASKS} selected={formData.bestTaskTypes} onChange={v => updateField('bestTaskTypes', v)} /></div>
        </div>
      );
      case 3: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.workPreference')}</FieldLabel><SingleSelect label={t('contributor.form.workPreference')} options={[t('contributor.form.options.workAlone'), t('contributor.form.options.workSmallTeam'), t('contributor.form.options.workLargeTeam')]} value={formData.workPreference} onChange={v => updateField('workPreference', v)} /></div>
          <div><FieldLabel required>{t('contributor.form.decisionStyle')}</FieldLabel><SingleSelect label={t('contributor.form.decisionStyle')} options={[t('contributor.form.options.logicFirst'), t('contributor.form.options.intuitionFirst'), t('contributor.form.options.dataFirst'), t('contributor.form.options.discussionFirst')]} value={formData.decisionStyle} onChange={v => updateField('decisionStyle', v)} /></div>
          <div><FieldLabel>{t('contributor.form.personalityType')}</FieldLabel><SingleSelect label={t('contributor.form.personalityType')} options={[t('contributor.form.options.structured'), t('contributor.form.options.flexible'), t('contributor.form.options.creative'), t('contributor.form.options.analytical')]} value={formData.personalityType} onChange={v => updateField('personalityType', v)} /></div>
          <div><FieldLabel>{t('contributor.form.underPressure')}</FieldLabel><SingleSelect label={t('contributor.form.underPressure')} options={[t('contributor.form.options.takeInitiative'), t('contributor.form.options.focusQuietly'), t('contributor.form.options.askTeam'), t('contributor.form.options.breakTasks')]} value={formData.underPressure} onChange={v => updateField('underPressure', v)} /></div>
          <div><FieldLabel>{t('contributor.form.whatMotivates')}</FieldLabel><MultiSelect label={t('contributor.form.whatMotivates')} options={MOTIVATIONS} selected={formData.motivations} onChange={v => updateField('motivations', v)} /></div>
        </div>
      );
      case 4: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.weeklyHours')}</FieldLabel><SingleSelect label={t('contributor.form.weeklyHours')} options={[t('contributor.form.options.hours1_3'), t('contributor.form.options.hours4_6'), t('contributor.form.options.hours7_10'), t('contributor.form.options.hours10plus')]} value={formData.weeklyHours} onChange={v => updateField('weeklyHours', v)} /></div>
          <div><FieldLabel>{t('contributor.form.contributionType')}</FieldLabel><SingleSelect label={t('contributor.form.contributionType')} options={[t('contributor.form.options.ongoingWeekly'), t('contributor.form.options.projectBased'), t('contributor.form.options.eventSupport'), t('contributor.form.options.researchContent'), t('contributor.form.options.technicalBuilding')]} value={formData.contributionType} onChange={v => updateField('contributionType', v)} /></div>
          <div><FieldLabel>{t('contributor.form.trackInterest')}</FieldLabel><SingleSelect label={t('contributor.form.trackInterest')} options={[t('contributor.form.options.leadershipTrack'), t('contributor.form.options.coreContributor'), t('contributor.form.options.volunteerTrack'), t('contributor.form.options.internshipTrack')]} value={formData.trackInterest} onChange={v => updateField('trackInterest', v)} /></div>
          <div>
            <FieldLabel required htmlFor="contributor-whyJoin">{t('contributor.form.whyJoin')}</FieldLabel>
            <Textarea maxLength={2000} aria-required="true" id="contributor-whyJoin" value={formData.whyJoin} onChange={e => updateField('whyJoin', e.target.value)} placeholder={t('contributor.form.whyJoinPlaceholder')} className="bg-white/[0.04] border-white/[0.1] min-h-[100px]" />
            <p className={`text-xs mt-1.5 ${countWords(formData.whyJoin) >= 50 ? 'text-secondary' : 'text-muted-foreground'}`}>
              {t('contributor.form.wordsCount', { count: countWords(formData.whyJoin) })}
            </p>
          </div>
          <div><FieldLabel htmlFor="contributor-desiredImpact">{t('contributor.form.desiredImpact')}</FieldLabel><Textarea maxLength={2000} id="contributor-desiredImpact" value={formData.desiredImpact} onChange={e => updateField('desiredImpact', e.target.value)} placeholder={t('contributor.form.desiredImpactPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel htmlFor="contributor-proudAchievement">{t('contributor.form.proudAchievement')}</FieldLabel><Textarea maxLength={2000} id="contributor-proudAchievement" value={formData.proudAchievement} onChange={e => updateField('proudAchievement', e.target.value)} placeholder={t('contributor.form.proudAchievementPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel htmlFor="contributor-whatToBuild">{t('contributor.form.whatToBuild')}</FieldLabel><Textarea maxLength={2000} id="contributor-whatToBuild" value={formData.whatToBuild} onChange={e => updateField('whatToBuild', e.target.value)} placeholder={t('contributor.form.whatToBuildPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel htmlFor="contributor-bestTeamEnvironment">{t('contributor.form.bestTeamEnvironment')}</FieldLabel><Textarea maxLength={2000} id="contributor-bestTeamEnvironment" value={formData.bestTeamEnvironment} onChange={e => updateField('bestTeamEnvironment', e.target.value)} placeholder={t('contributor.form.bestTeamEnvironmentPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
        </div>
      );
      case 5: return (
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed">{t('contributor.studio.scenarioIntro')}</p>
          {scenarioIds.map(id => <div className="cm-scenario" key={id}>
            <h4>{t(`contributor.studio.${id}Title`)}</h4>
            <p id={`${id}-prompt`}>{t(`contributor.studio.${id}Prompt`)}</p>
            <label className="sr-only" htmlFor={`${id}-answer`}>{t('contributor.studio.answerLabel')}: {t(`contributor.studio.${id}Title`)}</label>
            <Textarea aria-required="true" id={`${id}-answer`} aria-describedby={`${id}-prompt ${id}-count`} minLength={80} maxLength={2000} value={formData.scenarioAnswers[id]} onChange={e => updateField('scenarioAnswers', { ...formData.scenarioAnswers, [id]: e.target.value })} />
            <small id={`${id}-count`}>{t('contributor.studio.characters', { count: formData.scenarioAnswers[id].trim().length })}</small>
          </div>)}
        </div>
      );
      case 6: return (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">{t('contributor.form.reviewTitle')}</h3>
          <div className="space-y-4 text-sm">
            <ReviewItem label={t('contributor.form.reviewName')} value={formData.fullName} />
            <ReviewItem label={t('contributor.form.reviewEmail')} value={formData.email} />
            <ReviewItem label={t('contributor.form.reviewUniversity')} value={formData.university || '–'} />
            <ReviewItem label={t('contributor.form.reviewInterests')} value={formData.topicInterests.join(', ') || '–'} />
            <ReviewItem label={t('contributor.form.reviewStrengths')} value={formData.strengths.join(', ') || '–'} />
            <ReviewItem label={t('contributor.form.reviewWorkPreference')} value={formData.workPreference || '–'} />
            <ReviewItem label={t('contributor.form.reviewWeeklyHours')} value={formData.weeklyHours || '–'} />
            <ReviewItem label={t('contributor.form.reviewWhyUtaab')} value={formData.whyJoin || '–'} />
          </div>
          <h4>{t('contributor.studio.reviewScenarios')}</h4>
          {scenarioIds.map(id => <ReviewItem key={id} label={t(`contributor.studio.${id}Title`)} value={formData.scenarioAnswers[id]} />)}
          <button className="cm-text-button" onClick={() => moveToStep(0)}>{t('contributor.studio.edit')} <NavArrowLeft width={16} /></button>
          <p className="text-muted-foreground text-xs">{t('contributor.form.submitDisclaimer')}</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <section id="assessment-form" className="cm-assessment">
      <div className="cm-shell cm-form-layout">
        <details className="cm-details cm-step-picker" ref={stepPickerRef}>
          <summary>{t('contributor.journey.viewSteps')}</summary>
          <nav className="cm-step-nav" aria-label={t('contributor.form.reviewTitle')}>
            {STEPS.map((name, i) => <button key={name} type="button" aria-current={i === step ? 'step' : undefined} disabled={isSubmitting || i > furthestStep} onClick={() => moveToStep(i)}><span>{String(i + 1).padStart(2, '0')}</span>{name}</button>)}
          </nav>
        </details>
        <div ref={panelRef} className="cm-form-panel scroll-mt-28" aria-busy={isSubmitting}>
          <div className="cm-form-panel-header"><h3 ref={headingRef} tabIndex={-1}>{STEPS[step]}</h3><span>{t('contributor.journey.stepCount', { current: step + 1, total: STEPS.length })}</span></div>
          {step < 5 && <p className="cm-optional-note">{t('contributor.journey.optionalNote')}</p>}
          <fieldset disabled={isSubmitting}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div data-stage={step} key={`${step}-${i18n.resolvedLanguage}`} initial={reduced ? false : { opacity: 0, x: direction * (i18n.dir() === 'rtl' ? -16 : 16) }} animate={{ opacity: 1, x: 0 }} exit={reduced ? {} : { opacity: 0 }} transition={{ duration: 0.2 }} onAnimationComplete={prepareStep}>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </fieldset>
          {validationError && <p className="cm-inline-error" role="alert">{validationError}</p>}
          {submissionError && <p className="cm-inline-error" role="alert">{submissionError}</p>}
          <div className={`cm-form-actions ${step === STEPS.length - 1 ? 'cm-form-actions-review' : ''}`}>
            <button type="button" className="cm-text-button" onClick={prevStep} disabled={step === 0 || isSubmitting}><NavArrowLeft width={16} />{t('contributor.form.previous')}</button>
            {step < STEPS.length - 1
              ? <button type="button" className="cm-button" onClick={nextStep}>{t('contributor.form.next')}<NavArrowRight width={16} /></button>
              : <button type="button" className="cm-button" onClick={handleSubmit} disabled={isSubmitting}>{t(isSubmitting ? 'contributor.form.submitting' : 'contributor.form.submitAssessment')}<SendDiagonal width={18} /></button>}
          </div>
          <p className="cm-storage-note">{t(storageAvailable ? 'contributor.studio.saved' : 'contributor.studio.saveUnavailable')}</p>
          <p className="cm-disclosure">{t('contributor.studio.disclosure')} <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">{t('contributor.studio.privacy')}</a></p>
        </div>
      </div>
    </section>
  );
};

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
      <span className="text-muted-foreground">{label}:</span>{' '}
      <span className="text-foreground">{value}</span>
    </div>
  );
}

export default AssessmentForm;

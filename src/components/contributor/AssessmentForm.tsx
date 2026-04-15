import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { NavArrowLeft, NavArrowRight, SendDiagonal } from 'iconoir-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import GlassCard from '@/components/glass/GlassCard';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'utaab-contributor-assessment';

export interface FormData {
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
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

function MultiSelect({ options, selected, onChange, columns = 2 }: { options: string[]; selected: string[]; onChange: (v: string[]) => void; columns?: number }) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
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

function SingleSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
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

function RatingGroup({ areas, ratings, onChange }: { areas: string[]; ratings: Record<string, number>; onChange: (r: Record<string, number>) => void }) {
  return (
    <div className="space-y-3">
      {areas.map((area) => (
        <div key={area} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <span className="text-sm text-foreground min-w-[160px]">{area}</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ ...ratings, [area]: n })}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
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

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-foreground mb-2">
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

const AssessmentForm = ({ onSubmit, isSubmitting }: AssessmentFormProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const validateStep = (): boolean => {
    switch (step) {
      case 0:
        if (!formData.fullName.trim() || !formData.email.trim()) {
          toast({ title: t('contributor.form.validation.requiredFields'), description: t('contributor.form.validation.fillNameEmail'), variant: 'destructive' });
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast({ title: t('contributor.form.validation.invalidEmail'), description: t('contributor.form.validation.invalidEmailDesc'), variant: 'destructive' });
          return false;
        }
        return true;
      case 1:
        if (formData.topicInterests.length === 0) {
          toast({ title: t('contributor.form.validation.selectInterest'), variant: 'destructive' });
          return false;
        }
        return true;
      case 2:
        if (formData.strengths.length === 0) {
          toast({ title: t('contributor.form.validation.selectStrength'), variant: 'destructive' });
          return false;
        }
        return true;
      case 3:
        if (!formData.workPreference || !formData.decisionStyle) {
          toast({ title: t('contributor.form.validation.answerAll'), variant: 'destructive' });
          return false;
        }
        return true;
      case 4:
        if (!formData.weeklyHours || !formData.whyJoin.trim()) {
          toast({ title: t('contributor.form.validation.fillAvailability'), variant: 'destructive' });
          return false;
        }
        if (countWords(formData.whyJoin) < 50) {
          toast({ title: t('contributor.form.validation.motivationTooShort'), description: t('contributor.form.validation.motivationTooShortDesc', { count: countWords(formData.whyJoin) }), variant: 'destructive' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!validateStep()) return;
    onSubmit(formData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="space-y-5">
          <div><FieldLabel required>{t('contributor.form.fullName')}</FieldLabel><Input value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder={t('contributor.form.fullName')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel required>{t('contributor.form.email')}</FieldLabel><Input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.university')}</FieldLabel><Input value={formData.university} onChange={e => updateField('university', e.target.value)} placeholder={t('contributor.form.universityPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.yearOfStudy')}</FieldLabel>
            <SingleSelect options={[t('contributor.form.options.year1'), t('contributor.form.options.year2'), t('contributor.form.options.year3'), t('contributor.form.options.year4'), t('contributor.form.options.graduate'), t('contributor.form.options.other')]} value={formData.yearOfStudy} onChange={v => updateField('yearOfStudy', v)} />
          </div>
          <div><FieldLabel>{t('contributor.form.linkedIn')}</FieldLabel><Input value={formData.linkedIn} onChange={e => updateField('linkedIn', e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.github')}</FieldLabel><Input value={formData.github} onChange={e => updateField('github', e.target.value)} placeholder="https://github.com/..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.portfolio')}</FieldLabel><Input value={formData.portfolio} onChange={e => updateField('portfolio', e.target.value)} placeholder="https://..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div>
            <FieldLabel>{t('contributor.form.communityExperience')}</FieldLabel>
            <SingleSelect options={[t('contributor.form.options.yes'), t('contributor.form.options.no')]} value={formData.hasCommunityExperience ? t('contributor.form.options.yes') : formData.hasCommunityExperience === false && formData.communityExperienceDetails === '' ? '' : t('contributor.form.options.no')} onChange={v => updateField('hasCommunityExperience', v === t('contributor.form.options.yes'))} />
            {formData.hasCommunityExperience && (
              <div className="mt-3">
                <Textarea value={formData.communityExperienceDetails} onChange={e => updateField('communityExperienceDetails', e.target.value)} placeholder={t('contributor.form.communityExperienceDetails')} className="bg-white/[0.04] border-white/[0.1]" />
              </div>
            )}
          </div>
        </div>
      );
      case 1: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.topicInterests')}</FieldLabel><MultiSelect options={TOPIC_INTERESTS} selected={formData.topicInterests} onChange={v => updateField('topicInterests', v)} columns={3} /></div>
          <div><FieldLabel>{t('contributor.form.freeTimeActivities')}</FieldLabel><MultiSelect options={FREE_TIME} selected={formData.freeTimeActivities} onChange={v => updateField('freeTimeActivities', v)} columns={3} /></div>
          <div><FieldLabel>{t('contributor.form.naturalWork')}</FieldLabel><MultiSelect options={NATURAL_WORK} selected={formData.naturalWorkType} onChange={v => updateField('naturalWorkType', v)} /></div>
        </div>
      );
      case 2: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.strengths')}</FieldLabel><MultiSelect options={STRENGTHS} selected={formData.strengths} onChange={v => updateField('strengths', v)} columns={3} /></div>
          <div><FieldLabel>{t('contributor.form.experienceLevel')}</FieldLabel><RatingGroup areas={EXPERIENCE_AREAS} ratings={formData.experienceRatings} onChange={v => updateField('experienceRatings', v)} /></div>
          <div><FieldLabel>{t('contributor.form.bestTasks')}</FieldLabel><MultiSelect options={BEST_TASKS} selected={formData.bestTaskTypes} onChange={v => updateField('bestTaskTypes', v)} /></div>
        </div>
      );
      case 3: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.workPreference')}</FieldLabel><SingleSelect options={[t('contributor.form.options.workAlone'), t('contributor.form.options.workSmallTeam'), t('contributor.form.options.workLargeTeam')]} value={formData.workPreference} onChange={v => updateField('workPreference', v)} /></div>
          <div><FieldLabel required>{t('contributor.form.decisionStyle')}</FieldLabel><SingleSelect options={[t('contributor.form.options.logicFirst'), t('contributor.form.options.intuitionFirst'), t('contributor.form.options.dataFirst'), t('contributor.form.options.discussionFirst')]} value={formData.decisionStyle} onChange={v => updateField('decisionStyle', v)} /></div>
          <div><FieldLabel>{t('contributor.form.personalityType')}</FieldLabel><SingleSelect options={[t('contributor.form.options.structured'), t('contributor.form.options.flexible'), t('contributor.form.options.creative'), t('contributor.form.options.analytical')]} value={formData.personalityType} onChange={v => updateField('personalityType', v)} /></div>
          <div><FieldLabel>{t('contributor.form.underPressure')}</FieldLabel><SingleSelect options={[t('contributor.form.options.takeInitiative'), t('contributor.form.options.focusQuietly'), t('contributor.form.options.askTeam'), t('contributor.form.options.breakTasks')]} value={formData.underPressure} onChange={v => updateField('underPressure', v)} /></div>
          <div><FieldLabel>{t('contributor.form.whatMotivates')}</FieldLabel><MultiSelect options={MOTIVATIONS} selected={formData.motivations} onChange={v => updateField('motivations', v)} /></div>
        </div>
      );
      case 4: return (
        <div className="space-y-8">
          <div><FieldLabel required>{t('contributor.form.weeklyHours')}</FieldLabel><SingleSelect options={[t('contributor.form.options.hours1_3'), t('contributor.form.options.hours4_6'), t('contributor.form.options.hours7_10'), t('contributor.form.options.hours10plus')]} value={formData.weeklyHours} onChange={v => updateField('weeklyHours', v)} /></div>
          <div><FieldLabel>{t('contributor.form.contributionType')}</FieldLabel><SingleSelect options={[t('contributor.form.options.ongoingWeekly'), t('contributor.form.options.projectBased'), t('contributor.form.options.eventSupport'), t('contributor.form.options.researchContent'), t('contributor.form.options.technicalBuilding')]} value={formData.contributionType} onChange={v => updateField('contributionType', v)} /></div>
          <div><FieldLabel>{t('contributor.form.trackInterest')}</FieldLabel><SingleSelect options={[t('contributor.form.options.leadershipTrack'), t('contributor.form.options.coreContributor'), t('contributor.form.options.volunteerTrack'), t('contributor.form.options.internshipTrack')]} value={formData.trackInterest} onChange={v => updateField('trackInterest', v)} /></div>
          <div>
            <FieldLabel required>{t('contributor.form.whyJoin')}</FieldLabel>
            <Textarea value={formData.whyJoin} onChange={e => updateField('whyJoin', e.target.value)} placeholder={t('contributor.form.whyJoinPlaceholder')} className="bg-white/[0.04] border-white/[0.1] min-h-[100px]" />
            <p className={`text-xs mt-1.5 ${countWords(formData.whyJoin) >= 50 ? 'text-green-400' : 'text-destructive'}`}>
              {t('contributor.form.wordsCount', { count: countWords(formData.whyJoin) })}
            </p>
          </div>
          <div><FieldLabel>{t('contributor.form.desiredImpact')}</FieldLabel><Textarea value={formData.desiredImpact} onChange={e => updateField('desiredImpact', e.target.value)} placeholder={t('contributor.form.desiredImpactPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.proudAchievement')}</FieldLabel><Textarea value={formData.proudAchievement} onChange={e => updateField('proudAchievement', e.target.value)} placeholder={t('contributor.form.proudAchievementPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.whatToBuild')}</FieldLabel><Textarea value={formData.whatToBuild} onChange={e => updateField('whatToBuild', e.target.value)} placeholder={t('contributor.form.whatToBuildPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>{t('contributor.form.bestTeamEnvironment')}</FieldLabel><Textarea value={formData.bestTeamEnvironment} onChange={e => updateField('bestTeamEnvironment', e.target.value)} placeholder={t('contributor.form.bestTeamEnvironmentPlaceholder')} className="bg-white/[0.04] border-white/[0.1]" /></div>
        </div>
      );
      case 5: return (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">{t('contributor.form.reviewTitle')}</h3>
          <div className="space-y-4 text-sm">
            <ReviewItem label={t('contributor.form.reviewName')} value={formData.fullName} />
            <ReviewItem label={t('contributor.form.reviewEmail')} value={formData.email} />
            <ReviewItem label={t('contributor.form.reviewUniversity')} value={formData.university || '—'} />
            <ReviewItem label={t('contributor.form.reviewInterests')} value={formData.topicInterests.join(', ') || '—'} />
            <ReviewItem label={t('contributor.form.reviewStrengths')} value={formData.strengths.join(', ') || '—'} />
            <ReviewItem label={t('contributor.form.reviewWorkPreference')} value={formData.workPreference || '—'} />
            <ReviewItem label={t('contributor.form.reviewWeeklyHours')} value={formData.weeklyHours || '—'} />
            <ReviewItem label={t('contributor.form.reviewWhyUtaab')} value={formData.whyJoin || '—'} />
          </div>
          <p className="text-muted-foreground text-xs">{t('contributor.form.submitDisclaimer')}</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <section id="assessment-form" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard variant="strong" className="p-6 md:p-10">
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map((s, i) => (
                <span key={s} className={`text-xs hidden sm:block ${i === step ? 'text-secondary font-semibold' : 'text-muted-foreground'}`}>{s}</span>
              ))}
              <span className="sm:hidden text-xs text-secondary font-semibold">{STEPS[step]} ({step + 1}/{STEPS.length})</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10 pt-6 border-t border-white/[0.08]">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="bg-white/[0.04] border-white/[0.1] hover:bg-white/[0.08]"
            >
              <NavArrowLeft className="w-4 h-4 mr-1" strokeWidth={1.5} /> {t('contributor.form.previous')}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={nextStep} className="bg-primary/80 hover:bg-primary text-primary-foreground">
                {t('contributor.form.next')} <NavArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary/80 hover:bg-primary text-primary-foreground">
                {isSubmitting ? t('contributor.form.submitting') : t('contributor.form.submitAssessment')} <SendDiagonal className="w-4 h-4 ml-2" strokeWidth={1.5} />
              </Button>
            )}
          </div>
        </GlassCard>
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

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import GlassCard from '@/components/glass/GlassCard';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'utaab-contributor-assessment';

const STEPS = ['About You', 'Interests', 'Skills', 'Work Style', 'Motivation', 'Review'];

const TOPIC_INTERESTS = ['Blockchain', 'Smart Contracts', 'DeFi', 'AI', 'Product Building', 'Design', 'Content Creation', 'Community Building', 'Research', 'Marketing', 'Events', 'Partnerships', 'Operations', 'Education', 'Data / Analytics'];
const FREE_TIME = ['Reading', 'Writing', 'Building side projects', 'Designing', 'Organizing events', 'Networking', 'Gaming', 'Researching trends', 'Public speaking', 'Coding', 'Social media content', 'Helping communities grow', 'Other'];
const NATURAL_WORK = ['Creating', 'Analyzing', 'Leading', 'Supporting', 'Communicating', 'Designing systems', 'Solving technical problems', 'Building relationships'];
const STRENGTHS = ['Communication', 'Writing', 'Research', 'Graphic Design', 'UI/UX', 'Frontend', 'Backend', 'Smart Contracts', 'Social Media', 'Event Planning', 'Partnership Development', 'Leadership', 'Strategy', 'Data Analysis', 'Video Editing', 'Community Moderation', 'Presentation Skills'];
const EXPERIENCE_AREAS = ['Blockchain knowledge', 'Coding', 'Design', 'Research', 'Marketing', 'Teamwork', 'Leadership', 'Communication'];
const BEST_TASKS = ['Fast execution', 'Long-term research', 'Creative ideation', 'Organizing people', 'Technical development', 'Content production', 'Problem solving', 'Detail control'];
const MOTIVATIONS = ['Learning', 'Recognition', 'Building impactful things', 'Community', 'Career growth', 'Innovation', 'Networking', 'Leadership opportunities'];

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

interface AssessmentFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

// Sub-components
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
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  // Autosave
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
          toast({ title: 'Required fields', description: 'Please fill in your name and email.', variant: 'destructive' });
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
          return false;
        }
        return true;
      case 1:
        if (formData.topicInterests.length === 0) {
          toast({ title: 'Select at least one interest', variant: 'destructive' });
          return false;
        }
        return true;
      case 2:
        if (formData.strengths.length === 0) {
          toast({ title: 'Select at least one strength', variant: 'destructive' });
          return false;
        }
        return true;
      case 3:
        if (!formData.workPreference || !formData.decisionStyle) {
          toast({ title: 'Please answer all questions', variant: 'destructive' });
          return false;
        }
        return true;
      case 4:
        if (!formData.weeklyHours || !formData.whyJoin.trim()) {
          toast({ title: 'Please fill in availability and motivation', variant: 'destructive' });
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
          <div><FieldLabel required>Full Name</FieldLabel><Input value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Your full name" className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel required>Email</FieldLabel><Input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>University / Department</FieldLabel><Input value={formData.university} onChange={e => updateField('university', e.target.value)} placeholder="e.g. Istanbul Technical University - CS" className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>Year of Study</FieldLabel>
            <SingleSelect options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Other']} value={formData.yearOfStudy} onChange={v => updateField('yearOfStudy', v)} />
          </div>
          <div><FieldLabel>LinkedIn (optional)</FieldLabel><Input value={formData.linkedIn} onChange={e => updateField('linkedIn', e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>GitHub (optional)</FieldLabel><Input value={formData.github} onChange={e => updateField('github', e.target.value)} placeholder="https://github.com/..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>Portfolio (optional)</FieldLabel><Input value={formData.portfolio} onChange={e => updateField('portfolio', e.target.value)} placeholder="https://..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div>
            <FieldLabel>Have you previously joined any communities, clubs, startups, DAOs, or blockchain projects?</FieldLabel>
            <SingleSelect options={['Yes', 'No']} value={formData.hasCommunityExperience ? 'Yes' : formData.hasCommunityExperience === false && formData.communityExperienceDetails === '' ? '' : 'No'} onChange={v => updateField('hasCommunityExperience', v === 'Yes')} />
            {formData.hasCommunityExperience && (
              <div className="mt-3">
                <Textarea value={formData.communityExperienceDetails} onChange={e => updateField('communityExperienceDetails', e.target.value)} placeholder="Briefly describe your experience..." className="bg-white/[0.04] border-white/[0.1]" />
              </div>
            )}
          </div>
        </div>
      );
      case 1: return (
        <div className="space-y-8">
          <div><FieldLabel required>Which topics excite you the most?</FieldLabel><MultiSelect options={TOPIC_INTERESTS} selected={formData.topicInterests} onChange={v => updateField('topicInterests', v)} columns={3} /></div>
          <div><FieldLabel>What do you usually enjoy doing in your free time?</FieldLabel><MultiSelect options={FREE_TIME} selected={formData.freeTimeActivities} onChange={v => updateField('freeTimeActivities', v)} columns={3} /></div>
          <div><FieldLabel>What type of work feels most natural to you?</FieldLabel><MultiSelect options={NATURAL_WORK} selected={formData.naturalWorkType} onChange={v => updateField('naturalWorkType', v)} /></div>
        </div>
      );
      case 2: return (
        <div className="space-y-8">
          <div><FieldLabel required>Which of these describe your strengths?</FieldLabel><MultiSelect options={STRENGTHS} selected={formData.strengths} onChange={v => updateField('strengths', v)} columns={3} /></div>
          <div><FieldLabel>Rate your experience level (1–5)</FieldLabel><RatingGroup areas={EXPERIENCE_AREAS} ratings={formData.experienceRatings} onChange={v => updateField('experienceRatings', v)} /></div>
          <div><FieldLabel>What kind of tasks do you usually perform best?</FieldLabel><MultiSelect options={BEST_TASKS} selected={formData.bestTaskTypes} onChange={v => updateField('bestTaskTypes', v)} /></div>
        </div>
      );
      case 3: return (
        <div className="space-y-8">
          <div><FieldLabel required>Do you prefer:</FieldLabel><SingleSelect options={['Working alone', 'Working in a small team', 'Working in a large team']} value={formData.workPreference} onChange={v => updateField('workPreference', v)} /></div>
          <div><FieldLabel required>How do you usually make decisions?</FieldLabel><SingleSelect options={['Logic-first', 'Intuition-first', 'Data-first', 'Discussion-first']} value={formData.decisionStyle} onChange={v => updateField('decisionStyle', v)} /></div>
          <div><FieldLabel>Which describes you better?</FieldLabel><SingleSelect options={['Structured and organized', 'Flexible and adaptive', 'Creative and experimental', 'Analytical and methodical']} value={formData.personalityType} onChange={v => updateField('personalityType', v)} /></div>
          <div><FieldLabel>Under pressure, you tend to:</FieldLabel><SingleSelect options={['Take initiative', 'Focus quietly', 'Ask for team input', 'Break tasks into parts']} value={formData.underPressure} onChange={v => updateField('underPressure', v)} /></div>
          <div><FieldLabel>What motivates you most?</FieldLabel><MultiSelect options={MOTIVATIONS} selected={formData.motivations} onChange={v => updateField('motivations', v)} /></div>
        </div>
      );
      case 4: return (
        <div className="space-y-8">
          <div><FieldLabel required>How many hours per week can you contribute?</FieldLabel><SingleSelect options={['1–3', '4–6', '7–10', '10+']} value={formData.weeklyHours} onChange={v => updateField('weeklyHours', v)} /></div>
          <div><FieldLabel>Preferred contribution type</FieldLabel><SingleSelect options={['Ongoing weekly contribution', 'Project-based contribution', 'Event support', 'Research/content contribution', 'Technical building']} value={formData.contributionType} onChange={v => updateField('contributionType', v)} /></div>
          <div><FieldLabel>Are you interested in:</FieldLabel><SingleSelect options={['Leadership track', 'Core contributor track', 'Volunteer track', 'Internship-style learning track']} value={formData.trackInterest} onChange={v => updateField('trackInterest', v)} /></div>
          <div><FieldLabel required>Why do you want to join UTAAB?</FieldLabel><Textarea value={formData.whyJoin} onChange={e => updateField('whyJoin', e.target.value)} placeholder="Share your motivation..." className="bg-white/[0.04] border-white/[0.1] min-h-[100px]" /></div>
          <div><FieldLabel>What kind of impact do you want to create?</FieldLabel><Textarea value={formData.desiredImpact} onChange={e => updateField('desiredImpact', e.target.value)} placeholder="Describe the impact..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>Describe a project, achievement, or experience you are proud of.</FieldLabel><Textarea value={formData.proudAchievement} onChange={e => updateField('proudAchievement', e.target.value)} placeholder="Tell us about it..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>If you joined UTAAB, what would you like to improve, build, or lead?</FieldLabel><Textarea value={formData.whatToBuild} onChange={e => updateField('whatToBuild', e.target.value)} placeholder="Your vision..." className="bg-white/[0.04] border-white/[0.1]" /></div>
          <div><FieldLabel>What kind of team environment helps you perform best?</FieldLabel><Textarea value={formData.bestTeamEnvironment} onChange={e => updateField('bestTeamEnvironment', e.target.value)} placeholder="Describe your ideal environment..." className="bg-white/[0.04] border-white/[0.1]" /></div>
        </div>
      );
      case 5: return (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">Review Your Responses</h3>
          <div className="space-y-4 text-sm">
            <ReviewItem label="Name" value={formData.fullName} />
            <ReviewItem label="Email" value={formData.email} />
            <ReviewItem label="University" value={formData.university || '—'} />
            <ReviewItem label="Interests" value={formData.topicInterests.join(', ') || '—'} />
            <ReviewItem label="Strengths" value={formData.strengths.join(', ') || '—'} />
            <ReviewItem label="Work Preference" value={formData.workPreference || '—'} />
            <ReviewItem label="Weekly Hours" value={formData.weeklyHours || '—'} />
            <ReviewItem label="Why UTAAB" value={formData.whyJoin || '—'} />
          </div>
          <p className="text-muted-foreground text-xs">By submitting, your responses will be analyzed by AI to recommend the best contributor role for you.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <section id="assessment-form" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard variant="strong" className="p-6 md:p-10">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map((s, i) => (
                <span key={s} className={`text-xs hidden sm:block ${i === step ? 'text-secondary font-semibold' : 'text-muted-foreground'}`}>{s}</span>
              ))}
              <span className="sm:hidden text-xs text-secondary font-semibold">{STEPS[step]} ({step + 1}/{STEPS.length})</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Step content */}
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

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-white/[0.08]">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="bg-white/[0.04] border-white/[0.1] hover:bg-white/[0.08]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={nextStep} className="bg-primary/80 hover:bg-primary text-primary-foreground">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary/80 hover:bg-primary text-primary-foreground">
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'} <Send className="w-4 h-4 ml-2" />
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

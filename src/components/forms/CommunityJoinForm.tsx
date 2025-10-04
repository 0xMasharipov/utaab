import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, CheckCircle, ExternalLink, Calendar, MessageCircle, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const createSchema = (t: any) => z.object({
  full_name: z.string().trim().min(1, { message: t('join.validation.nameRequired') }),
  email: z.string().trim().email({ message: t('join.validation.emailInvalid') }),
  telegram: z.string().optional(),
  department: z.string().trim().min(1, { message: t('join.validation.departmentRequired') }),
  country: z.string().optional(),
  city: z.string().optional(),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: t('join.validation.experienceRequired') })
  }),
  interests: z.array(z.string()).min(1, { message: t('join.validation.interestsRequired') }),
  github_url: z.string().url({ message: t('join.validation.urlInvalid') }).optional().or(z.literal('')),
  portfolio_url: z.string().url({ message: t('join.validation.urlInvalid') }).optional().or(z.literal('')),
  linkedin_url: z.string().url({ message: t('join.validation.urlInvalid') }).optional().or(z.literal('')),
  availability_hours: z.number({ invalid_type_error: t('join.validation.availabilityInvalid') }).int().min(1, { message: t('join.validation.availabilityRequired') }),
  preferred_tracks: z.array(z.string()).min(1, { message: t('join.validation.tracksRequired') }),
  motivation: z.string().trim().min(300, { message: t('join.validation.motivationTooShort') }).max(500, { message: t('join.validation.motivationTooLong') }),
  kvkk_consent: z.boolean().refine(val => val === true, { message: t('join.validation.consentRequired') }),
  honeypot: z.string().max(0).optional(),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

export const CommunityJoinForm = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    interests: [],
    preferred_tracks: [],
    kvkk_consent: false,
    honeypot: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftSaved, setDraftSaved] = useState(false);

  const interestOptions = [
    'interestSolidity', 'interestRust', 'interestZK', 'interestL2',
    'interestDeFi', 'interestNFT', 'interestSecurity', 'interestResearch',
    'interestData', 'interestInfra', 'interestProduct', 'interestDesign', 'interestCommunity'
  ];

  const trackOptions = ['trackLearn', 'trackResearch', 'trackProjects', 'trackEvents', 'trackMentorship'];

  // Auto-save draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('communityFormDraft');
    if (savedDraft && !submitted) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed.formData);
        setStep(parsed.step);
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!submitted && Object.keys(formData).length > 0) {
      localStorage.setItem('communityFormDraft', JSON.stringify({ formData, step }));
    }
  }, [formData, step, submitted]);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    const schema = createSchema(t);

    try {
      if (currentStep === 1) {
        schema.pick({ full_name: true, email: true, department: true }).parse(formData);
      } else if (currentStep === 2) {
        schema.pick({ experience_level: true, interests: true }).parse(formData);
      } else if (currentStep === 3) {
        schema.pick({
          availability_hours: true,
          preferred_tracks: true,
          motivation: true,
          github_url: true,
          portfolio_url: true,
          linkedin_url: true,
        }).parse(formData);
      } else if (currentStep === 4) {
        schema.pick({ kvkk_consent: true, honeypot: true }).parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const schema = createSchema(t);
      const validatedData = schema.parse(formData);

      // Get metadata
      const urlParams = new URLSearchParams(window.location.search);
      const metadata = {
        locale: i18n.language,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        referrer: document.referrer || undefined,
        user_agent: navigator.userAgent,
      };

      const { error } = await supabase.from('community_applications').insert([
        {
          full_name: validatedData.full_name,
          email: validatedData.email,
          telegram: validatedData.telegram || null,
          department: validatedData.department,
          country: validatedData.country || null,
          city: validatedData.city || null,
          experience_level: validatedData.experience_level,
          interests: validatedData.interests,
          github_url: validatedData.github_url || null,
          portfolio_url: validatedData.portfolio_url || null,
          linkedin_url: validatedData.linkedin_url || null,
          availability_hours: validatedData.availability_hours,
          preferred_tracks: validatedData.preferred_tracks,
          motivation: validatedData.motivation,
          kvkk_consent: validatedData.kvkk_consent,
          kvkk_consent_version: '1.0',
          ...metadata,
        },
      ]);

      if (error) throw error;

      // Clear draft
      localStorage.removeItem('communityFormDraft');
      setSubmitted(true);
      toast.success(t('join.successTitle'));
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayItem = (field: 'interests' | 'preferred_tracks', item: string) => {
    const current = (formData[field] as string[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: current.includes(item) ? current.filter(i => i !== item) : [...current, item],
    }));
  };

  const motivationLength = (formData.motivation || '').length;

  if (submitted) {
    return (
      <div className="glass rounded-3xl p-8 md:p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <CheckCircle className="h-20 w-20 text-accent mx-auto mb-6" />
        </motion.div>
        <h3 className="text-3xl font-bold mb-4 text-foreground">{t('join.successTitle')}</h3>
        <p className="text-muted-foreground text-lg mb-8">
          {t('join.successMessage')}
        </p>
        
        <div className="grid gap-4 max-w-md mx-auto">
          <Button className="btn-primary w-full" asChild>
            <a href="https://t.me/utaablockchain" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('join.joinTelegram')}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button className="btn-glass w-full" asChild>
            <a href="/#events">
              <Calendar className="mr-2 h-5 w-5" />
              {t('join.viewEvents')}
            </a>
          </Button>
          <Button className="btn-glass w-full" asChild>
            <a href="/education">
              <GraduationCap className="mr-2 h-5 w-5" />
              {t('join.exploreEducation')}
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-12">
      {draftSaved && (
        <div className="mb-4 p-3 glass-strong rounded-xl text-sm text-accent text-center">
          Draft restored
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                s <= step ? 'bg-accent text-accent-foreground' : 'glass text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-1 mx-2 rounded transition-all ${
                  s < step ? 'bg-accent' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Profile */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('join.step1')}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="full_name" className="text-foreground mb-2 block">{t('join.name')}</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder={t('join.name')}
                />
                {errors.full_name && <p className="text-destructive text-sm mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground mb-2 block">{t('join.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder={t('join.email')}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="telegram" className="text-foreground mb-2 block">
                  {t('join.telegram')} <span className="text-muted-foreground text-sm">(optional)</span>
                </Label>
                <Input
                  id="telegram"
                  value={formData.telegram || ''}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="@username"
                />
              </div>

              <div>
                <Label htmlFor="department" className="text-foreground mb-2 block">{t('join.department')}</Label>
                <Input
                  id="department"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder={t('join.department')}
                />
                {errors.department && <p className="text-destructive text-sm mt-1">{errors.department}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country" className="text-foreground mb-2 block">
                    {t('join.country')} <span className="text-muted-foreground text-sm">(optional)</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="glass border-white/20 focus:border-accent text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-foreground mb-2 block">
                    {t('join.city')} <span className="text-muted-foreground text-sm">(optional)</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="glass border-white/20 focus:border-accent text-foreground"
                  />
                </div>
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={formData.honeypot || ''}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <Button type="button" onClick={handleNext} className="btn-primary w-full">
              {t('join.next')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Experience & Interests */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('join.step2')}</h3>
            
            <div className="space-y-6 mb-6">
              <div>
                <Label htmlFor="experience_level" className="text-foreground mb-3 block">{t('join.experienceLevel')}</Label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                    setFormData({ ...formData, experience_level: value })
                  }
                >
                  <SelectTrigger
                    id="experience_level"
                    className="glass border-white/20 focus:border-accent text-foreground data-[placeholder]:text-muted-foreground bg-white/5 hover:bg-white/10"
                  >
                    <SelectValue placeholder={t('join.selectExperience')} />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl z-[100]">
                    <SelectItem value="beginner" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                      {t('join.beginner')}
                    </SelectItem>
                    <SelectItem value="intermediate" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                      {t('join.intermediate')}
                    </SelectItem>
                    <SelectItem value="advanced" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                      {t('join.advanced')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience_level && <p className="text-destructive text-sm mt-2">{errors.experience_level}</p>}
              </div>

              <div>
                <Label className="text-foreground mb-3 block">{t('join.interests')}</Label>
                <p className="text-sm text-muted-foreground mb-3">{t('join.selectInterests')}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleArrayItem('interests', interest)}
                      className={`glass rounded-xl p-4 text-left transition-all hover:scale-105 ${
                        formData.interests?.includes(interest)
                          ? 'bg-accent/20 border-accent text-accent-foreground border-2'
                          : 'hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium">{t(`join.${interest}`)}</span>
                    </button>
                  ))}
                </div>
                {errors.interests && <p className="text-destructive text-sm mt-2">{errors.interests}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1 glass hover:bg-white/10">
                <ChevronLeft className="mr-2 h-5 w-5" />
                {t('join.back')}
              </Button>
              <Button type="button" onClick={handleNext} className="btn-primary flex-1">
                {t('join.next')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Portfolio & Availability */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('join.step3')}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="github_url" className="text-foreground mb-2 block">
                  {t('join.github')} <span className="text-muted-foreground text-sm">(optional)</span>
                </Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="https://github.com/username"
                />
                {errors.github_url && <p className="text-destructive text-sm mt-1">{errors.github_url}</p>}
              </div>

              <div>
                <Label htmlFor="portfolio_url" className="text-foreground mb-2 block">
                  {t('join.portfolio')} <span className="text-muted-foreground text-sm">(optional)</span>
                </Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  value={formData.portfolio_url || ''}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="https://yoursite.com"
                />
                {errors.portfolio_url && <p className="text-destructive text-sm mt-1">{errors.portfolio_url}</p>}
              </div>

              <div>
                <Label htmlFor="linkedin_url" className="text-foreground mb-2 block">
                  {t('join.linkedin')} <span className="text-muted-foreground text-sm">(optional)</span>
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedin_url && <p className="text-destructive text-sm mt-1">{errors.linkedin_url}</p>}
              </div>

              <div>
                <Label htmlFor="availability_hours" className="text-foreground mb-2 block">{t('join.availability')}</Label>
                <Input
                  id="availability_hours"
                  type="number"
                  min="1"
                  value={formData.availability_hours || ''}
                  onChange={(e) => setFormData({ ...formData, availability_hours: parseInt(e.target.value) || 0 })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="10"
                />
                {errors.availability_hours && <p className="text-destructive text-sm mt-1">{errors.availability_hours}</p>}
              </div>

              <div>
                <Label className="text-foreground mb-3 block">{t('join.preferredTracks')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {trackOptions.map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => toggleArrayItem('preferred_tracks', track)}
                      className={`glass rounded-xl p-4 text-left transition-all hover:scale-105 ${
                        formData.preferred_tracks?.includes(track)
                          ? 'bg-accent/20 border-accent text-accent-foreground border-2'
                          : 'hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium">{t(`join.${track}`)}</span>
                    </button>
                  ))}
                </div>
                {errors.preferred_tracks && <p className="text-destructive text-sm mt-2">{errors.preferred_tracks}</p>}
              </div>

              <div>
                <Label htmlFor="motivation" className="text-foreground mb-2 block">{t('join.motivation')}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t('join.motivationHelper')}</p>
                <Textarea
                  id="motivation"
                  value={formData.motivation || ''}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground min-h-[120px]"
                  placeholder={t('join.motivationHelper')}
                />
                <p className={`text-sm mt-2 ${motivationLength < 300 ? 'text-muted-foreground' : motivationLength > 500 ? 'text-destructive' : 'text-accent'}`}>
                  {t('join.charCount', { count: motivationLength, max: 500 })}
                </p>
                {errors.motivation && <p className="text-destructive text-sm mt-1">{errors.motivation}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1 glass hover:bg-white/10">
                <ChevronLeft className="mr-2 h-5 w-5" />
                {t('join.back')}
              </Button>
              <Button type="button" onClick={handleNext} className="btn-primary flex-1">
                {t('join.next')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Consent & Submit */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('join.step4')}</h3>
            
            <div className="space-y-6 mb-6">
              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="kvkk_consent"
                    checked={formData.kvkk_consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, kvkk_consent: checked as boolean })}
                    className="mt-1 border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <div className="flex-1">
                    <Label htmlFor="kvkk_consent" className="text-foreground leading-relaxed cursor-pointer">
                      {t('join.consent')}
                    </Label>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a href="#" className="text-sm text-accent hover:underline flex items-center">
                        {t('join.kvkkNotice')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                      <a href="#" className="text-sm text-accent hover:underline flex items-center">
                        {t('join.privacyPolicy')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                      <a href="#" className="text-sm text-accent hover:underline flex items-center">
                        {t('join.cookiePolicy')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
                {errors.kvkk_consent && <p className="text-destructive text-sm mt-2">{errors.kvkk_consent}</p>}
              </div>

              <div className="glass rounded-xl p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Non-profit community</p>
                <p>Educational purposes only — not financial advice.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1 glass hover:bg-white/10">
                <ChevronLeft className="mr-2 h-5 w-5" />
                {t('join.back')}
              </Button>
              <Button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : t('join.submit')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};
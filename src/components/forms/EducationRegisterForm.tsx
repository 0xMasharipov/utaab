import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { mapError } from '@/lib/errorUtils';

const createBaseSchema = (t: any) => z.object({
  email: z.string().trim().email({ message: t('education.registration.validation.emailInvalid') }),
  password: z.string().min(8, { message: t('education.registration.validation.passwordTooShort') }),
  confirmPassword: z.string(),
  preferred_language: z.string(),
  full_name: z.string().trim().min(1, { message: t('education.registration.validation.nameRequired') }),
  department: z.string().trim().min(1, { message: t('education.registration.validation.departmentRequired') }),
  role: z.enum(['student', 'instructor'], {
    errorMap: () => ({ message: t('education.registration.validation.roleRequired') })
  }),
  focus_areas: z.array(z.string()).min(1, { message: t('education.registration.validation.focusAreasRequired') }),
  kvkk_consent: z.boolean().refine(val => val === true, { message: t('education.registration.validation.kvkkRequired') }),
  email_course_updates: z.boolean(),
  email_newsletters: z.boolean(),
  email_marketing: z.boolean(),
});

const createSchema = (t: any) => createBaseSchema(t).refine(data => data.password === data.confirmPassword, {
  message: t('education.registration.validation.passwordMatch'),
  path: ['confirmPassword'],
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

export const EducationRegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    preferred_language: i18n.language,
    focus_areas: [],
    kvkk_consent: false,
    email_course_updates: false,
    email_newsletters: false,
    email_marketing: false,
    role: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const focusAreaOptions = [
    'interestSolidity', 'interestRust', 'interestZK', 'interestL2',
    'interestDeFi', 'interestNFT', 'interestSecurity', 'interestResearch',
    'interestData', 'interestInfra', 'interestProduct', 'interestDesign', 'interestCommunity'
  ];

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'text-destructive' };
    if (score <= 4) return { score, label: 'Medium', color: 'text-yellow-500' };
    return { score, label: 'Strong', color: 'text-accent' };
  };

  const passwordStrength = getPasswordStrength(formData.password || '');

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    const baseSchema = createBaseSchema(t);

    try {
      if (currentStep === 1) {
        baseSchema.pick({ email: true, password: true, confirmPassword: true, preferred_language: true }).parse(formData);
        // Also check password match for step 1
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = t('education.registration.validation.passwordMatch');
          throw new Error('Password mismatch');
        }
      } else if (currentStep === 2) {
        baseSchema.pick({ full_name: true, department: true, role: true, focus_areas: true }).parse(formData);
      } else if (currentStep === 3) {
        baseSchema.pick({
          kvkk_consent: true,
          email_course_updates: true,
          email_newsletters: true,
          email_marketing: true,
        }).parse(formData);
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

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (validateStep(step)) {
      setStep(step + 1);
      // Focus first field of next step after state update
      setTimeout(() => {
        const firstInput = document.querySelector(`form input:not([type="checkbox"]), form select, form textarea`) as HTMLElement;
        firstInput?.focus();
      }, 100);
    } else {
      // Focus first invalid field
      setTimeout(() => {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const field = document.getElementById(firstError);
          field?.focus();
        }
      }, 100);
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setStep(step - 1);
    setErrors({});
    // Focus first field of previous step
    setTimeout(() => {
      const firstInput = document.querySelector(`form input:not([type="checkbox"]), form select, form textarea`) as HTMLElement;
      firstInput?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step < 3) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const schema = createSchema(t);
      const validatedData = schema.parse(formData);

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/education`,
          data: {
            full_name: validatedData.full_name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Create education profile
      const { error: profileError } = await supabase.from('education_profiles').insert([
        {
          user_id: authData.user.id,
          full_name: validatedData.full_name,
          preferred_language: validatedData.preferred_language,
          department: validatedData.department,
          role: validatedData.role,
          focus_areas: validatedData.focus_areas,
          kvkk_consent: validatedData.kvkk_consent,
          kvkk_consent_version: '1.0',
          email_course_updates: validatedData.email_course_updates,
          email_newsletters: validatedData.email_newsletters,
          email_marketing: validatedData.email_marketing,
          locale: i18n.language,
        },
      ]);

      if (profileError) throw profileError;

      setCompleted(true);
      toast({
        title: t('education.registration.welcomeTitle'),
        description: t('education.registration.welcomeMessage'),
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: mapError(error),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFocusArea = (area: string) => {
    const current = (formData.focus_areas as string[]) || [];
    setFormData(prev => ({
      ...prev,
      focus_areas: current.includes(area) ? current.filter(a => a !== area) : [...current, area],
    }));
  };

  if (completed) {
    return (
      <div className="glass rounded-3xl p-8 md:p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <CheckCircle className="h-20 w-20 text-accent mx-auto mb-6" />
        </motion.div>
        <h3 className="text-3xl font-bold mb-4 text-foreground">{t('education.registration.welcomeTitle')}</h3>
        <p className="text-muted-foreground text-lg mb-8">
          {t('education.registration.welcomeMessage')}
        </p>
        
        <Button className="btn-primary" onClick={() => navigate('/education')}>
          {t('education.registration.gotoDashboard')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="glass rounded-3xl p-6 md:p-12">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                s <= step ? 'bg-accent text-accent-foreground' : 'glass text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
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
        {/* Step 1: Account */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('education.registration.stepAccount')}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="email" className="text-foreground mb-2 block">{t('education.registration.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground mb-2 block">{t('education.registration.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="glass border-white/20 focus:border-accent text-foreground pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordStrength.score <= 2 ? 'bg-destructive' :
                            passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-accent'
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm ${passwordStrength.color}`}>{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-foreground mb-2 block">{t('education.registration.confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword || ''}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="glass border-white/20 focus:border-accent text-foreground pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <Label htmlFor="preferred_language" className="text-foreground mb-2 block">{t('education.registration.preferredLanguage')}</Label>
                <Select
                  value={formData.preferred_language}
                  onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
                >
                  <SelectTrigger className="glass border-white/20 focus:border-accent text-foreground bg-white/5 hover:bg-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl z-[100]">
                    <SelectItem value="en" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">English</SelectItem>
                    <SelectItem value="tr" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">Türkçe</SelectItem>
                    <SelectItem value="ru" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">Русский</SelectItem>
                    <SelectItem value="ar" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="button" onClick={handleNext} className="btn-primary w-full">
              {t('join.next')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('education.registration.stepProfile')}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="full_name" className="text-foreground mb-2 block">{t('education.registration.fullName')}</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="John Doe"
                />
                {errors.full_name && <p className="text-destructive text-sm mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <Label htmlFor="department" className="text-foreground mb-2 block">{t('education.registration.department')}</Label>
                <Input
                  id="department"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground"
                  placeholder="Computer Science"
                />
                {errors.department && <p className="text-destructive text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <Label htmlFor="role" className="text-foreground mb-2 block">{t('education.registration.role')}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'student' | 'instructor') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="glass border-white/20 focus:border-accent text-foreground data-[placeholder]:text-muted-foreground bg-white/5 hover:bg-white/10">
                    <SelectValue placeholder={t('education.registration.role')} />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl z-[100]">
                    <SelectItem value="student" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                      {t('education.registration.student')}
                    </SelectItem>
                    <SelectItem value="instructor" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                      {t('education.registration.instructor')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-destructive text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <Label className="text-foreground mb-3 block">{t('education.registration.focusAreas')}</Label>
                <p className="text-sm text-muted-foreground mb-3">{t('education.registration.selectFocusAreas')}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {focusAreaOptions.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleFocusArea(area)}
                      className={`glass rounded-xl p-4 text-left transition-all hover:scale-105 ${
                        formData.focus_areas?.includes(area)
                          ? 'bg-accent/20 border-accent text-accent-foreground border-2'
                          : 'hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium">{t(`join.${area}`)}</span>
                    </button>
                  ))}
                </div>
                {errors.focus_areas && <p className="text-destructive text-sm mt-2">{errors.focus_areas}</p>}
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

        {/* Step 3: Legal & Preferences */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('education.registration.stepLegal')}</h3>
            
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
                      {t('education.registration.kvkkConsent')}
                    </Label>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a href="#" className="text-sm text-accent hover:underline flex items-center">
                        {t('education.registration.kvkkNotice')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                      <a href="#" className="text-sm text-accent hover:underline flex items-center">
                        {t('education.registration.privacyPolicy')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                      <a href="#" className="text-sm text-accent hover:underline flex items-center">
                        {t('education.registration.cookiePolicy')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
                {errors.kvkk_consent && <p className="text-destructive text-sm mt-2">{errors.kvkk_consent}</p>}
              </div>

              <div className="glass rounded-xl p-6">
                <Label className="text-foreground mb-4 block font-semibold">{t('education.registration.emailPreferences')}</Label>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="email_course_updates"
                      checked={formData.email_course_updates}
                      onCheckedChange={(checked) => setFormData({ ...formData, email_course_updates: checked as boolean })}
                      className="mt-1 border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <Label htmlFor="email_course_updates" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      {t('education.registration.emailCourseUpdates')}
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="email_newsletters"
                      checked={formData.email_newsletters}
                      onCheckedChange={(checked) => setFormData({ ...formData, email_newsletters: checked as boolean })}
                      className="mt-1 border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <Label htmlFor="email_newsletters" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      {t('education.registration.emailNewsletters')}
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="email_marketing"
                      checked={formData.email_marketing}
                      onCheckedChange={(checked) => setFormData({ ...formData, email_marketing: checked as boolean })}
                      className="mt-1 border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <Label htmlFor="email_marketing" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      {t('education.registration.emailMarketing')}
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  {t('education.registration.emailNote')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1 glass hover:bg-white/10">
                <ChevronLeft className="mr-2 h-5 w-5" />
                {t('join.back')}
              </Button>
              <Button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : t('education.registration.createAccount')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle, ExternalLink, Mail, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { z } from 'zod';
import { mapError } from '@/lib/errorUtils';
import { HoneypotField } from '@/components/security/HoneypotField';
import { useSecurity } from '@/hooks/useSecurity';
import { UtaabCaptcha, UtaabCaptchaRef } from '@/components/security/UtaabCaptcha';

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

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const logLogin = async (userId: string, email: string, provider: string) => {
  try {
    await supabase.from('login_history').insert({
      user_id: userId,
      email,
      provider,
      user_agent: navigator.userAgent,
    });
  } catch (e) {
    console.error('Failed to log login:', e);
  }
};

export const EducationRegisterForm = ({ initialMode = 'signup' }: { initialMode?: 'signup' | 'signin' }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { checkRateLimit, validateFormTiming, logSecurityEvent } = useSecurity();
  const [utaabToken, setUtaabToken] = useState<string | null>(null);
  const utaabRef = useRef<UtaabCaptchaRef>(null);
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

  // Email confirmation / OTP state
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpType, setOtpType] = useState<'signup' | 'email'>('signup');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  // For sign-up, Supabase sends a link-based confirmation by default,
  // not a 6-digit OTP. We show a "check your email" screen in that case.
  const [confirmationMode, setConfirmationMode] = useState<'link' | 'code'>('link');

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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
      setTimeout(() => {
        const firstInput = document.querySelector(`form input:not([type="checkbox"]), form select, form textarea`) as HTMLElement;
        firstInput?.focus();
      }, 100);
    } else {
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

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;
    
    // Rate limit OTP verification attempts
    const rateLimitCheck = await checkRateLimit(otpEmail, 'otp_verify', 5);
    if (!rateLimitCheck.allowed) {
      toast({
        title: 'Error',
        description: `Too many verification attempts. Please try again ${rateLimitCheck.retryAfter ? `in ${rateLimitCheck.retryAfter}s` : 'later'}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: otpCode,
        type: otpType,
      });

      if (error) throw error;

      if (data.user) {
        await logLogin(data.user.id, otpEmail, 'email');
      }

      toast({
        title: t('education.registration.welcomeTitle'),
        description: mode === 'signup'
          ? t('education.registration.welcomeMessage')
          : t('education.registration.signInSuccess'),
      });

      if (mode === 'signup') {
        setCompleted(true);
      } else {
        navigate('/education');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid verification code',
        variant: 'destructive',
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    // Rate limit OTP resend
    const rateLimitCheck = await checkRateLimit(otpEmail, 'otp_resend', 3);
    if (!rateLimitCheck.allowed) {
      toast({
        title: 'Error',
        description: `Too many resend attempts. Please try again ${rateLimitCheck.retryAfter ? `in ${rateLimitCheck.retryAfter}s` : 'later'}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsResending(true);
    // Set cooldown immediately to block double-clicks even if request is slow
    setResendCooldown(60);
    try {
      const { data: resendResp, error } = await supabase.functions.invoke(
        'education-resend-otp',
        {
          body: {
            email: otpEmail,
            email_redirect_to: `${window.location.origin}/education`,
          },
        }
      );
      if (error) throw error;

      if (resendResp?.confirmation_mode === 'code') {
        setConfirmationMode('code');
        setOtpType('email');
      }

      toast({
        title: 'Email sent',
        description: resendResp?.email_sent
          ? `We sent a new verification code to ${otpEmail}.`
          : `We couldn't send a new email right now. Please try again shortly.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: mapError(error),
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  // Temporary: Google OAuth disabled while we resolve technical issues.
  // Set to true to re-enable the original OAuth flow.
  const GOOGLE_OAUTH_ENABLED = false;

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_OAUTH_ENABLED) {
      toast({
        title: t('auth.googleTempUnavailableTitle'),
        description: t('auth.googleTempUnavailableMessage'),
      });
      return;
    }

    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Google sign-in failed',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle sign in mode
    if (mode === 'signin') {
      if (!formData.email || !formData.password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const rateLimitCheck = await checkRateLimit(formData.email, 'student_login', 10);
        if (!rateLimitCheck.allowed) {
          toast({
            title: 'Error',
            description: t('auth.tooManyAttempts'),
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        if (error) {
          setFailedAttempts(prev => prev + 1);
          await logSecurityEvent('student_login_failed', 'low', { email: formData.email });
          
          // If email not confirmed, show confirmation screen (link-based)
          if (error.message?.includes('Email not confirmed')) {
            const pendingEmail = formData.email.trim().toLowerCase();
            setOtpEmail(pendingEmail);
            setOtpType('email');
            setConfirmationMode('code');
            setAwaitingOtp(true);
            // Use a long cooldown to respect the backend 60s safety window
            setResendCooldown(60);

            // Send a fresh verification code so the student can finish here.
            const { data: resendResp } = await supabase.functions.invoke(
              'education-resend-otp',
              {
                body: {
                  email: pendingEmail,
                  email_redirect_to: `${window.location.origin}/education`,
                },
              }
            );
            if (resendResp?.confirmation_mode === 'link') {
              setConfirmationMode('link');
            }

            toast({
              title: 'Email not verified',
              description: 'We sent a 6-digit verification code to your inbox.',
            });
            setIsSubmitting(false);
            return;
          }
          
          let errorMessage = mapError(error);
          if (error.message?.includes('Invalid login credentials')) {
            errorMessage = t('auth.incorrectPassword');
          }
          
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        await logSecurityEvent('student_login_success', 'low', { email: formData.email });
        
        if (data.user) {
          await logLogin(data.user.id, formData.email, 'email');
        }

        toast({
          title: t('education.registration.welcomeBack'),
          description: t('education.registration.signInSuccess'),
        });

        navigate('/education');
      } catch (error: any) {
        console.error('Sign in failed:', error);
        toast({
          title: 'Error',
          description: mapError(error),
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Handle sign up mode
    if (!validateStep(3)) return;

    // Honeypot check
    if (honeypot) {
      await logSecurityEvent('honeypot_triggered', 'high', { email: formData.email });
      toast({
        title: 'Error',
        description: 'Please try again later',
        variant: 'destructive',
      });
      return;
    }

    // Anti-bot check
    if (!utaabToken) {
      toast({
        title: 'Error',
        description: 'Please complete the security verification',
        variant: 'destructive',
      });
      return;
    }

    // Form timing check
    if (!validateFormTiming()) {
      await logSecurityEvent('fast_submission', 'medium', { email: formData.email });
      toast({
        title: 'Error',
        description: 'Please take your time filling out the form',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const rateLimitCheck = await checkRateLimit(formData.email || 'unknown', 'student_register', 3);
      if (!rateLimitCheck.allowed) {
        toast({
          title: 'Error',
          description: t('auth.tooManyAttempts'),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const schema = createSchema(t);
      const validatedData = schema.parse(formData);

      const normalizedEmail = validatedData.email.trim().toLowerCase();

      const { data: signupResp, error: signupError } = await supabase.functions.invoke(
        'education-signup',
        {
          body: {
            email: normalizedEmail,
            password: validatedData.password,
            full_name: validatedData.full_name,
            preferred_language: validatedData.preferred_language,
            department: validatedData.department,
            role: validatedData.role,
            focus_areas: validatedData.focus_areas,
            kvkk_consent: true,
            email_course_updates: validatedData.email_course_updates,
            email_newsletters: validatedData.email_newsletters,
            email_marketing: validatedData.email_marketing,
            locale: i18n.language,
            email_redirect_to: `${window.location.origin}/education`,
          },
        }
      );

      if (signupError || !signupResp?.success) {
        await logSecurityEvent('student_register_failed', 'medium', {
          email: validatedData.email,
        });
        toast({
          title: 'Error',
          description: mapError(signupError ?? new Error('Signup failed')),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      await logSecurityEvent('student_register_success', 'low', {
        email: validatedData.email,
      });

      if (!signupResp.needs_email_confirmation) {
        toast({
          title: 'Account already active',
          description: `An active account for ${validatedData.email} already exists. Please sign in instead.`,
        });
        setMode('signin');
        setStep(1);
        setIsSubmitting(false);
        return;
      }

      // Show verification screen — code-based when the backend delivered an OTP.
      setOtpEmail(normalizedEmail);
      setOtpType('email');
      setConfirmationMode(signupResp.confirmation_mode === 'code' ? 'code' : 'link');
      setAwaitingOtp(true);
      setResendCooldown(60);

      const description = !signupResp.email_sent
        ? `We couldn't send a new confirmation email right now. Please wait a minute, then use Resend.`
        : signupResp.already_existed
        ? `An account for ${validatedData.email} already exists. We've re-sent the verification code — please check your inbox.`
        : `We sent a 6-digit verification code to ${validatedData.email}. Enter it below to activate your account.`;

      toast({
        title: signupResp.email_sent ? (signupResp.already_existed ? 'Account already exists' : 'Check your email') : 'Confirmation pending',
        description,
      });
    } catch (error: any) {
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

  // Email confirmation screen (link-based for sign-up, code-based for OTP login)
  if (awaitingOtp) {
    const isLink = confirmationMode === 'link';
    return (
      <div className="glass rounded-3xl p-8 md:p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <Mail className="h-16 w-16 text-accent mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2 text-foreground">
          {isLink ? 'Check Your Email' : 'Verify Your Email'}
        </h3>
        <p className="text-muted-foreground mb-8">
          {isLink ? (
            <>
              We sent a confirmation link to{' '}
              <strong className="text-foreground">{otpEmail}</strong>. Click it to
              activate your account.
            </>
          ) : (
            <>
              We sent a 6-digit code to{' '}
              <strong className="text-foreground">{otpEmail}</strong>
            </>
          )}
        </p>

        {!isLink && (
          <>
            <div className="flex justify-center mb-6">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="btn-primary w-full max-w-xs mx-auto mb-4"
              disabled={otpCode.length !== 6 || isVerifyingOtp}
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify Code'}
            </Button>
          </>
        )}

        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {isLink ? "Didn't receive the email?" : "Didn't receive the code?"}
          </span>
          <button
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isResending}
            className="text-accent hover:underline font-medium disabled:opacity-50 disabled:no-underline flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : isResending ? 'Sending…' : 'Resend'}
          </button>
        </div>

        {isLink && (
          <button
            onClick={() => {
              setAwaitingOtp(false);
              setMode('signin');
            }}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground underline"
          >
            Back to sign in
          </button>
        )}
      </div>
    );
  }

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
        <p className="text-muted-foreground text-lg mb-6">
          {t('education.registration.welcomeMessage')}
        </p>
        <p className="text-foreground text-base mb-8">
          Join our WhatsApp Community to connect with other students and instructors!
        </p>
        
        <div className="grid gap-4 max-w-md mx-auto">
          <WhatsAppButton 
            variant="primary"
            message="Join WhatsApp Community"
          />
          
          <Button className="btn-glass" onClick={() => navigate('/education')}>
            {t('education.registration.gotoDashboard')}
          </Button>
        </div>
      </div>
    );
  }

  // Sign In Mode
  if (mode === 'signin') {
    return (
      <div className="glass rounded-3xl p-6 md:p-12">
        <h3 className="text-2xl font-bold mb-6 text-foreground">
          {t('education.registration.signIn')}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <div>
            <Label htmlFor="signin-email" className="text-foreground mb-2 block">
              {t('education.registration.email')}
            </Label>
            <Input
              id="signin-email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="glass border-white/20 focus:border-accent text-foreground"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="signin-password" className="text-foreground mb-2 block">
              {t('education.registration.password')}
            </Label>
            <div className="relative">
              <Input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="glass border-white/20 focus:border-accent text-foreground pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="btn-primary w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? t('education.registration.signingIn') : t('education.registration.signIn')}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full glass border-white/20"
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon />
            {t('auth.continueWithGoogle')}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {t('auth.privacyNotice')}
          </p>

        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="glass rounded-3xl p-6 md:p-12">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
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

            {/* UTAAB Anti-bot Verification */}
            <UtaabCaptcha
              ref={utaabRef}
              onVerify={(token) => setUtaabToken(token)}
              onError={() => toast({
                title: 'Error',
                description: 'Security verification failed. Please try again.',
                variant: 'destructive',
              })}
              mode="interactive"
              difficulty="adaptive"
            />

            <div className="flex gap-3">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1 glass hover:bg-white/10">
                <ChevronLeft className="mr-2 h-5 w-5" />
                {t('join.back')}
              </Button>
              <Button 
                type="submit" 
                className="btn-primary flex-1" 
                disabled={isSubmitting || !utaabToken}
              >
                {isSubmitting ? 'Creating Account...' : t('education.registration.createAccount')}
              </Button>
            </div>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full glass border-white/20"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              {t('auth.continueWithGoogle')}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t('auth.privacyNotice')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

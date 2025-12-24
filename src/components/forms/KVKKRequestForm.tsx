import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, Mail, Home } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { mapError } from '@/lib/errorUtils';
import { UtaabCaptcha, UtaabCaptchaRef } from '@/components/security/UtaabCaptcha';

const createSchema = (t: any) => z.object({
  full_name: z.string().trim().min(1, { message: t('kvkk.requestForm.validation.nameRequired') }),
  email: z.string().trim().email({ message: t('kvkk.requestForm.validation.emailInvalid') }),
  request_type: z.enum(['access', 'correction', 'deletion', 'portability', 'objection'], {
    errorMap: () => ({ message: t('kvkk.requestForm.validation.typeRequired') })
  }),
  details: z.string().trim().min(10, { message: t('kvkk.requestForm.validation.detailsRequired') }),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

export const KVKKRequestForm = () => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [utaabToken, setUtaabToken] = useState<string | null>(null);
  const utaabRef = useRef<UtaabCaptchaRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const schema = createSchema(t);
      const validatedData = schema.parse(formData);

      // Check UTAAB verification
      if (!utaabToken) {
        toast.error(t('auth.captchaRequired'));
        return;
      }

      setIsSubmitting(true);

      // Call edge function for server-side validation and rate limiting
      const { data, error } = await supabase.functions.invoke('submit-kvkk-request', {
        body: {
          full_name: validatedData.full_name,
          email: validatedData.email,
          request_type: validatedData.request_type,
          details: validatedData.details,
          locale: i18n.language,
          utaab_token: utaabToken,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error('Submission failed');

      setSubmitted(true);
      toast.success(t('kvkk.requestForm.successTitle'));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Error details are sanitized by mapError to prevent information leakage
        toast.error(mapError(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h3 className="text-3xl font-bold mb-4 text-foreground">{t('kvkk.requestForm.successTitle')}</h3>
        <p className="text-muted-foreground text-lg mb-6">
          {t('kvkk.requestForm.successMessage')}
        </p>
        <p className="text-foreground text-base mb-8">
          Meanwhile, join our community on WhatsApp to stay connected!
        </p>
        
        <div className="grid gap-4 max-w-md mx-auto">
          <WhatsAppButton 
            variant="primary"
            message="Join WhatsApp Community"
          />
          
          <Button className="btn-glass w-full" asChild>
            <a href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-12">
      <h3 className="text-2xl font-bold mb-2 text-foreground">{t('kvkk.requestForm.title')}</h3>
      <p className="text-muted-foreground mb-6">{t('kvkk.requestForm.subtitle')}</p>
      
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="full_name" className="text-foreground mb-2 block">{t('kvkk.requestForm.name')}</Label>
          <Input
            id="full_name"
            value={formData.full_name || ''}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="glass border-white/20 focus:border-accent text-foreground"
            placeholder={t('kvkk.requestForm.name')}
          />
          {errors.full_name && <p className="text-destructive text-sm mt-1">{errors.full_name}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-foreground mb-2 block">{t('kvkk.requestForm.email')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="glass border-white/20 focus:border-accent text-foreground"
            placeholder={t('kvkk.requestForm.email')}
          />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="request_type" className="text-foreground mb-2 block">{t('kvkk.requestForm.requestType')}</Label>
          <Select
            value={formData.request_type}
            onValueChange={(value: 'access' | 'correction' | 'deletion' | 'portability' | 'objection') => 
              setFormData({ ...formData, request_type: value })
            }
          >
            <SelectTrigger
              id="request_type"
              className="glass border-white/20 focus:border-accent text-foreground data-[placeholder]:text-muted-foreground bg-white/5 hover:bg-white/10"
            >
              <SelectValue placeholder={t('kvkk.requestForm.selectType')} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl z-[100]">
              <SelectItem value="access" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                {t('kvkk.requestForm.typeAccess')}
              </SelectItem>
              <SelectItem value="correction" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                {t('kvkk.requestForm.typeCorrection')}
              </SelectItem>
              <SelectItem value="deletion" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                {t('kvkk.requestForm.typeDeletion')}
              </SelectItem>
              <SelectItem value="portability" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                {t('kvkk.requestForm.typePortability')}
              </SelectItem>
              <SelectItem value="objection" className="text-foreground hover:bg-white/10 focus:bg-accent/20 cursor-pointer rounded-xl my-1">
                {t('kvkk.requestForm.typeObjection')}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.request_type && <p className="text-destructive text-sm mt-1">{errors.request_type}</p>}
        </div>

        <div>
          <Label htmlFor="details" className="text-foreground mb-2 block">{t('kvkk.requestForm.details')}</Label>
          <Textarea
            id="details"
            value={formData.details || ''}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="glass border-white/20 focus:border-accent text-foreground min-h-[120px]"
            placeholder={t('kvkk.requestForm.detailsPlaceholder')}
          />
          {errors.details && <p className="text-destructive text-sm mt-1">{errors.details}</p>}
        </div>

        <div className="glass rounded-xl p-4 text-sm">
          <p className="text-foreground mb-2">{t('kvkk.requestForm.responseTime')}</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{t('kvkk.requestForm.contact')} privacy@utaablockchain.org</span>
          </div>
        </div>

        {/* UTAAB Anti-bot Verification */}
        <UtaabCaptcha
          ref={utaabRef}
          onVerify={(token) => setUtaabToken(token)}
          onError={() => toast.error(t('auth.captchaFailed'))}
          mode="visible"
          difficulty="adaptive"
        />
      </div>

      <Button type="submit" className="btn-primary w-full" disabled={isSubmitting || !utaabToken}>
        {isSubmitting ? 'Submitting...' : t('kvkk.requestForm.submit')}
      </Button>
    </form>
  );
};
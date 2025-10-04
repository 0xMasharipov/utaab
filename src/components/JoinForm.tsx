import { useState } from 'react';
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
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  department: string;
  university: string;
  experienceLevel: string;
  interests: string[];
  consent: boolean;
}

export const JoinForm = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    department: '',
    university: '',
    experienceLevel: '',
    interests: [],
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = ['defi', 'nft', 'dao', 'layer2', 'smartcontracts', 'web3'];
  const experienceLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = t('join.validation.nameRequired');
      if (!formData.email.trim()) {
        newErrors.email = t('join.validation.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('join.validation.emailInvalid');
      }
    } else if (currentStep === 2) {
      if (!formData.department.trim()) newErrors.department = t('join.validation.departmentRequired');
      if (!formData.university.trim()) newErrors.university = t('join.validation.universityRequired');
      if (!formData.experienceLevel) newErrors.experienceLevel = t('join.validation.experienceRequired');
    } else if (currentStep === 3) {
      if (formData.interests.length === 0) newErrors.interests = t('join.validation.interestsRequired');
      if (!formData.consent) newErrors.consent = t('join.validation.consentRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      // Simulate submission
      console.log('Form submitted:', formData);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  if (submitted) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <CheckCircle className="h-20 w-20 text-accent mx-auto mb-6" />
        </motion.div>
        <h3 className="text-3xl font-bold mb-4 text-foreground">Thank You!</h3>
        <p className="text-muted-foreground text-lg">
          Your application has been submitted. We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:p-12">
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
        {/* Step 1: Personal Info */}
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
                <Label htmlFor="name" className="text-foreground mb-2 block">{t('join.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground placeholder:text-muted-foreground"
                  placeholder={t('join.name')}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground mb-2 block">{t('join.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground placeholder:text-muted-foreground"
                  placeholder={t('join.email')}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <Button type="button" onClick={handleNext} className="btn-primary w-full">
              {t('join.next')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Background */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('join.step2')}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="department" className="text-foreground mb-2 block">{t('join.department')}</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground placeholder:text-muted-foreground"
                  placeholder={t('join.department')}
                />
                {errors.department && <p className="text-destructive text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <Label htmlFor="university" className="text-foreground mb-2 block">{t('join.university')}</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="glass border-white/20 focus:border-accent text-foreground placeholder:text-muted-foreground"
                  placeholder={t('join.university')}
                />
                {errors.university && <p className="text-destructive text-sm mt-1">{errors.university}</p>}
              </div>

              <div>
                <Label htmlFor="experienceLevel" className="text-foreground mb-2 block">{t('join.experienceLevel')}</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                >
                  <SelectTrigger
                    id="experienceLevel"
                    className="glass border-white/20 focus:border-accent text-foreground data-[placeholder]:text-muted-foreground bg-white/5 hover:bg-white/10"
                  >
                    <SelectValue placeholder={t('join.selectExperience')} />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl z-[100]">
                    {experienceLevels.map((level) => (
                      <SelectItem
                        key={level}
                        value={level}
                        className="text-foreground hover:bg-white/10 focus:bg-accent/20 focus:text-accent-foreground cursor-pointer rounded-xl my-1"
                      >
                        {t(`join.${level}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-destructive text-sm mt-1">{errors.experienceLevel}</p>}
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

        {/* Step 3: Interests */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">{t('join.step3')}</h3>
            
            <div className="space-y-6 mb-6">
              <div>
                <Label className="text-foreground mb-3 block">{t('join.interests')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`glass rounded-xl p-4 text-left transition-all ${
                        formData.interests.includes(interest)
                          ? 'bg-accent/20 border-accent text-accent-foreground'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {t(`join.${interest}`)}
                    </button>
                  ))}
                </div>
                {errors.interests && <p className="text-destructive text-sm mt-2">{errors.interests}</p>}
              </div>

              <div className="flex items-start space-x-3 glass rounded-xl p-4">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  className="mt-1 border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  {t('join.consent')}
                </Label>
              </div>
              {errors.consent && <p className="text-destructive text-sm">{errors.consent}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1 glass hover:bg-white/10">
                <ChevronLeft className="mr-2 h-5 w-5" />
                {t('join.back')}
              </Button>
              <Button type="submit" className="btn-primary flex-1">
                {t('join.submit')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

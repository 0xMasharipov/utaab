import { EducationRegisterForm } from '@/components/forms/EducationRegisterForm';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const EducationRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as 'signin' | 'signup') || 'signup';

  const toggleMode = () => {
    setSearchParams({ mode: mode === 'signin' ? 'signup' : 'signin' });
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/education')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Education
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            {mode === 'signin' ? t('education.registration.signIn') : t('education.registration.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {mode === 'signin' 
              ? 'Welcome back! Sign in to continue your learning journey'
              : t('education.registration.subtitle')
            }
          </p>
        </div>

        <EducationRegisterForm initialMode={mode} />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {mode === 'signin' 
              ? t('education.registration.noAccount')
              : t('education.registration.haveAccount')
            }{' '}
            <button
              onClick={toggleMode}
              className="text-accent hover:underline font-medium"
            >
              {mode === 'signin' 
                ? t('education.registration.createAccount')
                : t('education.registration.signIn')
              }
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

import { EducationRegisterForm } from '@/components/forms/EducationRegisterForm';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const EducationSignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background gradient-mesh pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/education')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('educationNav.backToEducation')}
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            {t('education.registration.signIn')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('educationNav.welcomeBack')}
          </p>
        </div>

        <EducationRegisterForm initialMode="signin" />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {t('education.registration.noAccount')}{' '}
            <button
              onClick={() => navigate('/education/register')}
              className="text-accent hover:underline font-medium"
            >
              {t('education.registration.createAccount')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

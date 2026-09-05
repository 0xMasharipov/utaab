import { useEffect } from 'react';
import { EducationRegisterForm } from '@/components/forms/EducationRegisterForm';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EducationNavbar } from '@/components/education/EducationNavbar';

export const EducationSignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        const provider = user.app_metadata?.provider || 'email';
        
        // Log login
        try {
          await supabase.from('login_history').insert({
            user_id: user.id,
            email: user.email,
            provider,
            user_agent: navigator.userAgent,
          });
        } catch (e) {
          console.error('Failed to log login:', e);
        }

        // Check if profile exists for OAuth users
        if (provider !== 'email') {
          const { data: profile } = await supabase
            .from('education_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!profile) {
            // Auto-create minimal profile for OAuth
            await supabase.from('education_profiles').insert({
              user_id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              department: 'General',
              role: 'student',
              focus_areas: [],
              kvkk_consent: true,
              kvkk_consent_version: '1.0',
              preferred_language: 'en',
              locale: 'en',
            });
          }

          navigate('/education');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] bg-background px-6 pb-28 pt-28">
      <EducationNavbar />
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/education')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('educationNav.backToEducation')}
        </Button>

        <div className="mb-10 border-b border-white/10 pb-8 text-start">
          <h1 className="mb-4 text-4xl font-extrabold tracking-[-0.05em] md:text-6xl">
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

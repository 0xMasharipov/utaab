import { motion } from 'framer-motion';
import { Trophy, Star, GraphUp, Archery, Flash, NavArrowRight } from 'iconoir-react';
import GlassCard from '@/components/glass/GlassCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export interface AIResult {
  primary_role: string;
  secondary_role: string;
  compatibility_score: number;
  profile_summary: string;
  strengths: string[];
  why_this_role: string;
  growth_recommendations: string;
  suggested_first_step: string;
  recommended_department: string;
  growth_path: string;
}

interface AssessmentResultProps {
  result: AIResult | null;
  isLoading: boolean;
}

function CircularScore({ score }: { score: number }) {
  const { t } = useTranslation();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none"
          stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-extrabold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-muted-foreground">{t('contributor.result.match')}</span>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <GlassCard variant="strong" className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Flash className="w-7 h-7 text-secondary animate-pulse" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('contributor.result.analyzing')}</h2>
            <p className="text-muted-foreground">{t('contributor.result.analyzingSubtitle')}</p>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-36 w-36 rounded-full mx-auto" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

const AssessmentResult = ({ result, isLoading }: AssessmentResultProps) => {
  const { t } = useTranslation();

  if (isLoading) return <LoadingSkeleton />;
  if (!result) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <GlassCard variant="strong" className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-7 h-7 text-secondary" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('contributor.result.title')}
              </h2>
              <p className="text-muted-foreground">{t('contributor.result.subtitle')}</p>
            </div>

            <div className="mb-10">
              <CircularScore score={result.compatibility_score} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <GlassCard className="p-6 border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('contributor.result.primaryMatch')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{result.primary_role}</h3>
                </GlassCard>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Archery className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('contributor.result.secondaryMatch')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{result.secondary_role}</h3>
                </GlassCard>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
              <GlassCard variant="subtle" className="p-6">
                <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">{t('contributor.result.profileSummary')}</h4>
                <p className="text-foreground leading-relaxed">{result.profile_summary}</p>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-8">
              <GlassCard variant="subtle" className="p-6">
                <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">{t('contributor.result.whyThisRole')}</h4>
                <p className="text-foreground leading-relaxed">{result.why_this_role}</p>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-8">
              <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">{t('contributor.result.yourStrengths')}</h4>
              <div className="flex flex-wrap gap-2">
                {result.strengths.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-primary/15 text-secondary border border-white/[0.08]">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <GlassCard variant="subtle" className="p-5 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <GraphUp className="w-4 h-4 text-secondary" strokeWidth={1.5} />
                    <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider">{t('contributor.result.growthPath')}</h4>
                  </div>
                  <p className="text-sm text-foreground">{result.growth_path}</p>
                </GlassCard>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <GlassCard variant="subtle" className="p-5 h-full">
                  <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">{t('contributor.result.recommendedDepartment')}</h4>
                  <p className="text-sm text-foreground">{result.recommended_department}</p>
                </GlassCard>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mb-8">
              <GlassCard variant="subtle" className="p-6 border-primary/20">
                <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">{t('contributor.result.suggestedNextSteps')}</h4>
                <p className="text-foreground leading-relaxed">{result.suggested_first_step}</p>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <GlassCard variant="subtle" className="p-6">
                <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">{t('contributor.result.growthRecommendations')}</h4>
                <p className="text-foreground leading-relaxed">{result.growth_recommendations}</p>
              </GlassCard>
            </motion.div>

            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-primary/80 hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-xl">
                <a href="/">
                  {t('contributor.result.exploreUtaab')} <NavArrowRight className="w-5 h-5 ml-2" strokeWidth={1.5} />
                </a>
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default AssessmentResult;

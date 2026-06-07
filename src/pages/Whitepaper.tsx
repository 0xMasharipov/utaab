import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Target, Cpu, Map, Download, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import GlassCard from '@/components/glass/GlassCard';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { Button } from '@/components/ui/button';

const Whitepaper = () => {
  const { t } = useTranslation();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  const visionPoints = [
    t('whitepaper.vision.p1', 'Make Web3 education accessible to anyone, regardless of background or budget.'),
    t('whitepaper.vision.p2', 'Bridge the gap between learning and shipping by giving members real projects to build on.'),
    t('whitepaper.vision.p3', 'Create a borderless community where students, developers, and mentors collaborate as equals.'),
  ];

  const technology = [
    {
      title: t('whitepaper.tech.t1.title', 'Open ecosystem'),
      description: t('whitepaper.tech.t1.description', 'We rely on open standards and public blockchains rather than locked-down platforms. Anything we publish, you can inspect.'),
    },
    {
      title: t('whitepaper.tech.t2.title', 'Education-first stack'),
      description: t('whitepaper.tech.t2.description', 'Our learning platform combines structured courses, hands-on workshops, and an AI tutor so members can learn at their own pace.'),
    },
    {
      title: t('whitepaper.tech.t3.title', 'Project pipeline'),
      description: t('whitepaper.tech.t3.description', 'Members move from learning to building through guided projects, mentorship, and contributor matching.'),
    },
  ];

  const roadmap = [
    {
      phase: t('whitepaper.roadmap.phase1.phase', 'Phase 1 — Foundation'),
      status: t('whitepaper.roadmap.phase1.status', 'In progress'),
      points: [
        t('whitepaper.roadmap.phase1.p1', 'Launch core education platform with multilingual support (EN, TR, RU, AR).'),
        t('whitepaper.roadmap.phase1.p2', 'Publish beginner-to-advanced learning guides and the official MIT "Blockchain and Money" course.'),
        t('whitepaper.roadmap.phase1.p3', 'Grow the global community across student chapters and online channels.'),
      ],
    },
    {
      phase: t('whitepaper.roadmap.phase2.phase', 'Phase 2 — Builder Ecosystem'),
      status: t('whitepaper.roadmap.phase2.status', 'Next'),
      points: [
        t('whitepaper.roadmap.phase2.p1', 'Open contributor program with mentorship, paid bounties, and project tracks.'),
        t('whitepaper.roadmap.phase2.p2', 'Ship the first cohort of UTAAB-supported open-source Web3 projects.'),
        t('whitepaper.roadmap.phase2.p3', 'Launch a transparent governance model for community decisions.'),
      ],
    },
    {
      phase: t('whitepaper.roadmap.phase3.phase', 'Phase 3 — Global Network'),
      status: t('whitepaper.roadmap.phase3.status', 'Planned'),
      points: [
        t('whitepaper.roadmap.phase3.p1', 'Hackathons, partnerships, and cross-border collaborations at scale.'),
        t('whitepaper.roadmap.phase3.p2', 'On-chain credentials and verifiable certificates for completed programs.'),
        t('whitepaper.roadmap.phase3.p3', 'Long-term sustainability model funded by partners, grants, and ecosystem contributions.'),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="section-container text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-5">
              {t('whitepaper.hero.badge', 'Whitepaper')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight">
              {t('whitepaper.hero.title', 'UTAAB Whitepaper')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('whitepaper.hero.subtitle', 'A clear, honest summary of what UTAAB is, why it exists, and where it\u2019s going next.')}
            </p>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-white/[0.04] border-white/15 hover:bg-white/[0.10]"
              disabled
              title={t('whitepaper.hero.downloadHint', 'PDF coming soon')}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('whitepaper.hero.download', 'Download PDF (coming soon)')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="pb-12 md:pb-16">
        <div className="section-container max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">01 — Vision</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">{t('whitepaper.vision.title', 'Vision')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('whitepaper.vision.intro', 'UTAAB exists to make blockchain understandable, useful, and open to everyone. We believe Web3 should not be locked behind jargon, paywalls, or insider networks.')}
            </p>
            <ul className="space-y-3">
              {visionPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-accent mt-1.5 leading-none">—</span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* Technology */}
      <section className="pb-12 md:pb-16">
        <div className="section-container max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">02 — Technology</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">{t('whitepaper.tech.title', 'Technology')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('whitepaper.tech.intro', 'Our approach is intentionally pragmatic. We use technology that is open, well-understood, and battle-tested — and we explain everything we use.')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {technology.map((tech, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-xs font-extralight text-foreground/30 tabular-nums mb-2">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="font-semibold mb-2">{tech.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Roadmap */}
      <section className="pb-16 md:pb-20">
        <div className="section-container max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">03 — Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">{t('whitepaper.roadmap.title', 'Roadmap')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t('whitepaper.roadmap.intro', 'Three phases. We move on once the previous one is real, not just announced.')}
            </p>
            <div className="space-y-6">
              {roadmap.map((phase, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-lg font-bold">{phase.phase}</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
                      {phase.status}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {phase.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="text-accent mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-12 md:pb-16">
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('whitepaper.disclaimer', 'This page is a living summary of our direction and may evolve as the ecosystem grows. Nothing here is financial advice or a token sale offering.')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="section-container max-w-3xl mx-auto">
          <GlassCard className="p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t('whitepaper.cta.title', 'Want the practical side?')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('whitepaper.cta.subtitle', 'Skip ahead to the guides and start learning Web3 right away.')}
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/learn/guides">
                {t('whitepaper.cta.button', 'Open Guides')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </GlassCard>
        </div>
      </section>

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default Whitepaper;

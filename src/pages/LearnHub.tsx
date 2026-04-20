import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Wrench, ArrowRight, Sparkles, Users, Compass } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import GlassCard from '@/components/glass/GlassCard';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { Button } from '@/components/ui/button';

const LearnHub = () => {
  const { t } = useTranslation();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  const paths = [
    {
      icon: BookOpen,
      title: t('learnHub.paths.guides.title', 'Guides'),
      description: t('learnHub.paths.guides.description', 'Self-paced articles that explain blockchain, wallets, and Web3 in plain language. Perfect if you are starting from zero.'),
      cta: t('learnHub.paths.guides.cta', 'Read the guides'),
      to: '/learn/guides',
      level: t('learnHub.paths.guides.level', 'Beginner → Advanced'),
    },
    {
      icon: GraduationCap,
      title: t('learnHub.paths.courses.title', 'Structured Courses'),
      description: t('learnHub.paths.courses.description', 'Full video courses with quizzes, certificates, and a clear curriculum — including the official MIT "Blockchain and Money" course.'),
      cta: t('learnHub.paths.courses.cta', 'Browse courses'),
      to: '/education',
      level: t('learnHub.paths.courses.level', 'Beginner → Advanced'),
    },
    {
      icon: Wrench,
      title: t('learnHub.paths.workshops.title', 'Workshops'),
      description: t('learnHub.paths.workshops.description', 'Live and recorded hands-on sessions. Build wallets, deploy your first smart contract, and ship a tiny dApp with the community.'),
      cta: t('learnHub.paths.workshops.cta', 'See workshops'),
      to: '/learn/workshops',
      level: t('learnHub.paths.workshops.level', 'Hands-on'),
    },
  ];

  const principles = [
    {
      icon: Compass,
      title: t('learnHub.principles.clarity.title', 'Clarity over jargon'),
      description: t('learnHub.principles.clarity.description', 'We define every technical word the moment we use it. No assumed knowledge.'),
    },
    {
      icon: Sparkles,
      title: t('learnHub.principles.examples.title', 'Real-world examples'),
      description: t('learnHub.principles.examples.description', 'Every concept is paired with an analogy or a small example so it actually sticks.'),
    },
    {
      icon: Users,
      title: t('learnHub.principles.community.title', 'Learn with others'),
      description: t('learnHub.principles.community.description', 'A growing community of students, builders, and mentors who answer questions and ship projects together.'),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="section-container text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              {t('learnHub.hero.badge', 'Learning Hub')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('learnHub.hero.title', 'Learn Web3 the clear way.')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('learnHub.hero.subtitle', 'A free, beginner-friendly path into blockchain — built by UTAAB students, mentors, and developers. Start with the basics, finish building something real.')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/learn/guides">
                  {t('learnHub.hero.primary', 'Start Learning')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-white/[0.04] border-white/15 hover:bg-white/[0.10]">
                <Link to="/whitepaper">{t('learnHub.hero.secondary', 'Read the Whitepaper')}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is UTAAB */}
      <section className="pb-16 md:pb-20">
        <div className="section-container max-w-5xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('learnHub.about.title', 'What is UTAAB?')}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('learnHub.about.p1', 'UTAAB (Unified Turkic Academic Alliance for Blockchain) is a student-led ecosystem focused on Web3 education, real projects, and cross-border collaboration. We exist to lower the entry barrier to blockchain — so anyone curious can understand it, build with it, and contribute to it.')}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t('learnHub.about.p2', 'Our content is free, our community is open, and our goal is simple: turn beginners into capable Web3 builders through clear lessons and hands-on projects.')}
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Three paths */}
      <section className="pb-16 md:pb-24">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t('learnHub.paths.title', 'Three ways to learn')}
            </h2>
            <p className="text-muted-foreground">
              {t('learnHub.paths.subtitle', 'Pick the path that fits how you like to learn. You can switch between them anytime.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paths.map((path) => (
              <GlassCard key={path.title} hover className="p-6 md:p-7 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-accent/20 flex items-center justify-center text-accent mb-5">
                  <path.icon className="h-6 w-6" />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{path.level}</span>
                <h3 className="text-xl font-bold mb-3">{path.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{path.description}</p>
                <Button asChild variant="ghost" className="justify-start gap-2 text-accent hover:text-accent/80 px-0">
                  <Link to={path.to}>
                    {path.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="pb-16 md:pb-24">
        <div className="section-container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t('learnHub.principles.title', 'How we teach')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="text-center p-6">
                <div className="w-12 h-12 rounded-full glass border border-white/15 flex items-center justify-center text-accent mx-auto mb-4">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20 md:pb-28">
        <div className="section-container max-w-3xl mx-auto">
          <GlassCard className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t('learnHub.cta.title', 'Ready to start?')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('learnHub.cta.subtitle', 'Open the first guide and you\u2019ll understand what a blockchain actually is in under 5 minutes.')}
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/learn/guides">
                {t('learnHub.cta.button', 'Open Guides')} <ArrowRight className="ml-2 h-4 w-4" />
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

export default LearnHub;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookStack,
  BrainResearch,
  CheckCircle,
  CodeBrackets,
  Community,
  Developer,
  Download,
  GraduationCap,
  Network,
  ScaleFrameEnlarge,
  WarningCircle,
} from 'iconoir-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import GlassCard from '@/components/glass/GlassCard';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import EcosystemFlow, {
  type EcosystemNodeState,
  type NodeItem,
} from '@/components/whitepaper/EcosystemFlow';
import logo from '@/assets/logo-new.webp';

const Whitepaper = () => {
  const { t } = useTranslation();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const visionPoints = [
    t('whitepaper.vision.p1', 'Make Web3 education accessible to anyone, regardless of background or budget.'),
    t('whitepaper.vision.p2', 'Bridge the gap between learning and shipping by giving members real projects to build on.'),
    t('whitepaper.vision.p3', 'Create a borderless community where students, developers, and mentors collaborate as equals.'),
  ];

  const technology = [
    {
      title: t('whitepaper.tech.t1.title', 'Open ecosystem'),
      description: t('whitepaper.tech.t1.description', 'We rely on open standards and public blockchains rather than locked-down platforms. Anything we publish, you can inspect.'),
      icon: Network,
    },
    {
      title: t('whitepaper.tech.t2.title', 'Education-first stack'),
      description: t('whitepaper.tech.t2.description', 'Our learning platform combines structured courses, hands-on workshops, and an AI tutor so members can learn at their own pace.'),
      icon: BookStack,
    },
    {
      title: t('whitepaper.tech.t3.title', 'Project pipeline'),
      description: t('whitepaper.tech.t3.description', 'Members move from learning to building through guided projects, mentorship, and contributor matching.'),
      icon: CodeBrackets,
    },
  ];

  const roadmap = [
    {
      phase: t('whitepaper.roadmap.phase1.phase', 'Foundation'),
      status: t('whitepaper.roadmap.phase1.status', 'In progress'),
      points: [
        t('whitepaper.roadmap.phase1.p1', 'Launch the core education platform with multilingual support.'),
        t('whitepaper.roadmap.phase1.p2', 'Publish learning guides and the MIT Blockchain and Money course.'),
        t('whitepaper.roadmap.phase1.p3', 'Grow the global community through student chapters and online channels.'),
      ],
    },
    {
      phase: t('whitepaper.roadmap.phase2.phase', 'Builder ecosystem'),
      status: t('whitepaper.roadmap.phase2.status', 'Next'),
      points: [
        t('whitepaper.roadmap.phase2.p1', 'Open contributor tracks with mentorship and paid bounties.'),
        t('whitepaper.roadmap.phase2.p2', 'Ship UTAAB-supported open-source Web3 projects.'),
        t('whitepaper.roadmap.phase2.p3', 'Launch transparent community governance.'),
      ],
    },
    {
      phase: t('whitepaper.roadmap.phase3.phase', 'Global network'),
      status: t('whitepaper.roadmap.phase3.status', 'Planned'),
      points: [
        t('whitepaper.roadmap.phase3.p1', 'Scale hackathons, partnerships, and cross-border collaborations.'),
        t('whitepaper.roadmap.phase3.p2', 'Issue on-chain credentials and verifiable certificates.'),
        t('whitepaper.roadmap.phase3.p3', 'Build a sustainable model funded by partners, grants, and contributions.'),
      ],
    },
  ];

  const nodeContent = (
    icon: typeof BookStack,
    label: string,
    state: EcosystemNodeState,
  ) => {
    const Icon = icon;
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-1.5 py-1">
        <Icon
          className={state === 'planned' ? 'h-4 w-4 text-foreground/50 sm:h-5 sm:w-5' : 'h-4 w-4 text-accent sm:h-5 sm:w-5'}
          strokeWidth={1.5}
        />
        <span className="max-w-full text-[9px] font-semibold leading-[1.08] sm:text-[10px]">
          {label}
        </span>
      </div>
    );
  };

  const nodeDefinitions: Array<{
    id: string;
    icon: typeof BookStack;
    label: string;
    state: EcosystemNodeState;
  }> = [
    { id: 'education', icon: BookStack, label: t('whitepaper.ecosystem.nodes.education', 'Education'), state: 'active' },
    { id: 'community', icon: Community, label: t('whitepaper.ecosystem.nodes.community', 'Community'), state: 'active' },
    { id: 'projects', icon: CodeBrackets, label: t('whitepaper.ecosystem.nodes.projects', 'Projects'), state: 'active' },
    { id: 'research', icon: BrainResearch, label: t('whitepaper.ecosystem.nodes.research', 'Research'), state: 'active' },
    { id: 'contributors', icon: Developer, label: t('whitepaper.ecosystem.nodes.contributors', 'Contributors'), state: 'emerging' },
    { id: 'mentorship', icon: GraduationCap, label: t('whitepaper.ecosystem.nodes.mentorship', 'Mentorship'), state: 'emerging' },
    { id: 'partnerships', icon: Network, label: t('whitepaper.ecosystem.nodes.partnerships', 'Partnerships'), state: 'emerging' },
    { id: 'governance', icon: ScaleFrameEnlarge, label: t('whitepaper.ecosystem.nodes.governance', 'Governance'), state: 'planned' },
    { id: 'credentials', icon: BadgeCheck, label: t('whitepaper.ecosystem.nodes.credentials', 'Credentials'), state: 'planned' },
  ];

  const ecosystemNodes: NodeItem[] = nodeDefinitions.map((node) => ({
    id: node.id,
    state: node.state,
    ariaLabel: `${node.label}, ${t(`whitepaper.ecosystem.states.${node.state}`, node.state)}`,
    content: nodeContent(node.icon, node.label, node.state),
  }));

  const legend: Array<{ state: EcosystemNodeState; label: string }> = [
    { state: 'active', label: t('whitepaper.ecosystem.states.active', 'Active now') },
    { state: 'emerging', label: t('whitepaper.ecosystem.states.emerging', 'In development') },
    { state: 'planned', label: t('whitepaper.ecosystem.states.planned', 'Planned') },
  ];

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.22 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <SEO
        title={`${t('whitepaper.hero.title', 'UTAAB Whitepaper')} | UTAAB`}
        description={t('whitepaper.hero.subtitle', 'A clear summary of what UTAAB is, why it exists, and where it is going next.')}
        path="/whitepaper"
      />
      <AnimatedBlobBackground />
      <Navbar />

      <main>
        <section className="pb-20 pt-28 sm:pt-32 md:pb-24">
          <div className="section-container grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <motion.div
              className="lg:col-span-7"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {t('whitepaper.hero.badge', 'Whitepaper')}
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
                {t('whitepaper.hero.title', 'UTAAB Whitepaper')}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('whitepaper.hero.subtitle', 'A clear, honest summary of what UTAAB is, why it exists, and where it is going next.')}
              </p>
              <Button
                size="lg"
                variant="outline"
                className="mt-8 rounded-full border-white/15 bg-white/[0.05] px-6 text-foreground hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
                disabled
                title={t('whitepaper.hero.downloadHint', 'PDF coming soon')}
              >
                <Download className="mr-2 h-4 w-4" strokeWidth={1.5} />
                {t('whitepaper.hero.download', 'Download PDF (coming soon)')}
              </Button>
            </motion.div>

            <motion.nav
              aria-label={t('whitepaper.hero.contents', 'Inside the whitepaper')}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,hsl(217_42%_11%/0.84),hsl(217_50%_6%/0.66))] p-7 shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_30px_80px_hsl(217_91%_4%/0.3)] backdrop-blur-xl sm:p-8 lg:col-span-5"
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/[0.08] blur-3xl" />
              <div className="relative flex items-center gap-3 border-b border-white/10 pb-6">
                <img src={logo} alt="" className="h-9 w-auto mix-blend-lighten" width={64} height={64} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {t('whitepaper.hero.contents', 'Inside the whitepaper')}
                  </p>
                  <p className="mt-1 font-semibold">UTAAB</p>
                </div>
              </div>
              <div className="relative mt-2">
                {[
                  { href: '#vision', label: t('whitepaper.vision.title', 'Vision') },
                  { href: '#ecosystem', label: t('whitepaper.ecosystem.title', 'The Ecosystem We Are Building') },
                  { href: '#roadmap', label: t('whitepaper.roadmap.title', 'Roadmap') },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group flex min-h-12 items-center justify-between border-b border-white/[0.07] text-sm text-muted-foreground transition-colors last:border-b-0 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </motion.nav>
          </div>
        </section>

        <section id="vision" className="scroll-mt-24 border-y border-white/[0.07] py-20 md:py-24">
          <motion.div {...reveal} className="section-container grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('whitepaper.vision.title', 'Vision')}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('whitepaper.vision.intro', 'UTAAB exists to make blockchain understandable, useful, and open to everyone. Web3 should not be locked behind jargon, paywalls, or insider networks.')}
              </p>
            </div>
            <div className="space-y-7 lg:col-span-7">
              {visionPoints.map((point) => (
                <div key={point} className="flex items-start gap-4">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                  <p className="max-w-2xl text-base leading-relaxed text-foreground/85 sm:text-lg">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="ecosystem" className="scroll-mt-24 py-20 md:py-28">
          <div className="section-container">
            <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {t('whitepaper.ecosystem.title', 'The Ecosystem We Are Building')}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('whitepaper.ecosystem.description', 'UTAAB connects learning, contribution, research, and real projects in one open path from curiosity to meaningful work.')}
              </p>
            </motion.div>

            <motion.div
              {...reveal}
              className="relative mx-auto mt-12 max-w-6xl overflow-hidden rounded-2xl border border-accent/15 bg-[linear-gradient(145deg,hsl(216_48%_9%/0.88),hsl(218_52%_5%/0.82))] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_34px_110px_hsl(217_91%_4%/0.42)] backdrop-blur-xl"
            >
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(213_94%_68%/0.13),transparent_38%),radial-gradient(circle_at_50%_46%,transparent_25%,hsl(217_70%_3%/0.42)_82%)]" />
              <EcosystemFlow
                nodeItems={ecosystemNodes}
                centerContent={(
                  <div className="flex flex-col items-center gap-2">
                    <img src={logo} alt="" className="h-10 w-auto mix-blend-lighten sm:h-12" width={72} height={72} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground sm:text-xs">UTAAB</span>
                  </div>
                )}
                centerSize={144}
                nodeSize={92}
                pulseDuration={4.1}
                pulseInterval={4.1}
                pulseLength={0.2}
                lineWidth={1}
                pulseWidth={1.3}
                pulseSoftness={6}
                lineColor="hsl(213 58% 34%)"
                lineColorLight="hsl(213 45% 68%)"
                pulseColor="hsl(213 94% 68%)"
                pulseColorLight="hsl(217 91% 45%)"
                glowColor="hsl(213 94% 68%)"
                glowColorLight="hsl(217 91% 45%)"
                maxGlowIntensity={38}
                glowDecay={0.9}
                borderRadius={28}
                nodeDistance={0.83}
              />
              <div className="relative flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/[0.08] px-5 py-5">
                {legend.map((item) => (
                  <div key={item.state} className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    <span
                      aria-hidden="true"
                      className={item.state === 'planned'
                        ? 'w-8 border-t border-dashed border-white/30'
                        : item.state === 'emerging'
                          ? 'h-px w-8 bg-accent/45'
                          : 'h-px w-8 bg-accent'}
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] py-20 md:py-24">
          <div className="section-container">
            <motion.div {...reveal} className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('whitepaper.tech.title', 'Technology')}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('whitepaper.tech.intro', 'Our approach is pragmatic. We use open, well-understood, battle-tested technology and explain every part of the stack.')}
              </p>
            </motion.div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-12 lg:grid-rows-2">
              {technology.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.article
                    key={tech.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: reduceMotion ? 0 : 0.58, delay: reduceMotion ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={index === 0
                      ? 'relative overflow-hidden rounded-2xl border border-accent/20 bg-[linear-gradient(145deg,hsl(217_40%_11%/0.9),hsl(217_50%_7%/0.72))] p-7 lg:col-span-7 lg:row-span-2 lg:p-10'
                      : 'relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-7 lg:col-span-5'}
                  >
                    <div aria-hidden="true" className={index === 0 ? 'absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/[0.08] blur-3xl' : 'absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/[0.04] blur-2xl'} />
                    <Icon className="relative h-7 w-7 text-accent" strokeWidth={1.5} />
                    <h3 className={index === 0 ? 'relative mt-10 text-2xl font-bold sm:text-3xl' : 'relative mt-7 text-xl font-bold'}>
                      {tech.title}
                    </h3>
                    <p className={index === 0 ? 'relative mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg' : 'relative mt-3 text-sm leading-relaxed text-muted-foreground'}>
                      {tech.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-24 py-20 md:py-28">
          <div className="section-container">
            <motion.div {...reveal} className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('whitepaper.roadmap.title', 'Roadmap')}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('whitepaper.roadmap.intro', 'We advance only when the previous phase is real, useful, and ready to support what comes next.')}
              </p>
            </motion.div>

            <div className="relative mx-auto mt-14 max-w-6xl">
              <div aria-hidden="true" className="absolute left-[8px] top-2 h-[calc(100%-1rem)] w-px bg-white/10 md:left-0 md:right-0 md:top-[8px] md:h-px md:w-auto" />
              <div className="grid gap-12 md:grid-cols-3 md:gap-8">
                {roadmap.map((phase, index) => (
                  <motion.article
                    key={phase.phase}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-10 md:pl-0 md:pt-10"
                  >
                    <span
                      aria-hidden="true"
                      className={index === 0
                        ? 'absolute left-0 top-0 h-4 w-4 rounded-[4px] border border-accent bg-accent shadow-[0_0_20px_hsl(213_94%_68%/0.35)] md:left-0'
                        : 'absolute left-0 top-0 h-4 w-4 rounded-[4px] border border-accent/35 bg-background md:left-0'}
                    />
                    <span className="inline-flex rounded-full border border-accent/25 bg-accent/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                      {phase.status}
                    </span>
                    <h3 className="mt-5 text-xl font-bold">{phase.phase}</h3>
                    <ul className="mt-5 space-y-3">
                      {phase.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent/75" strokeWidth={1.5} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-16">
          <div className="section-container max-w-4xl">
            <div className="flex items-start gap-3 rounded-2xl border border-accent/15 bg-accent/[0.045] p-5 sm:p-6">
              <WarningCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('whitepaper.disclaimer', 'This page is a living summary of our direction and may evolve as the ecosystem grows. Nothing here is financial advice or a token sale offering.')}
              </p>
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="section-container max-w-4xl">
            <GlassCard variant="strong" className="relative overflow-hidden p-8 text-center sm:p-12">
              <div aria-hidden="true" className="absolute left-1/2 top-0 h-44 w-80 -translate-x-1/2 rounded-full bg-accent/[0.08] blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {t('whitepaper.cta.title', 'Want the practical side?')}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                  {t('whitepaper.cta.subtitle', 'Open the guides and start learning Web3 through clear explanations and practical examples.')}
                </p>
                <Button asChild size="lg" className="mt-7 rounded-full px-7 active:scale-[0.98]">
                  <Link to="/learn/guides">
                    {t('whitepaper.cta.button', 'Open Guides')}
                    <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default Whitepaper;

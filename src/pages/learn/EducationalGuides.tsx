import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Clock, ChevronRight, ExternalLink, Layers, Shield, Code, Globe, Wallet, FileText, Cpu, Network, Boxes, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 }
  })
};

interface GuideCard {
  titleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
}

const Section = ({ id, title, subtitle, cards, t }: { id: string; title: string; subtitle: string; cards: GuideCard[]; t: (key: string) => string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const difficultyKey = (d: string) =>
    d === 'Beginner' ? 'learn.guidesPage.difficultyBeginner'
    : d === 'Intermediate' ? 'learn.guidesPage.difficultyIntermediate'
    : 'learn.guidesPage.difficultyAdvanced';

  const badgeColor = (d: string) =>
    d === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : d === 'Intermediate' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30';

  return (
    <section id={id} ref={ref} className="py-12 md:py-16">
      <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.titleKey}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            custom={i + 1}
            className="glass rounded-2xl p-6 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 group flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-primary/20 text-accent">
                <card.icon className="h-5 w-5" />
              </div>
              <Badge className={`${badgeColor(card.difficulty)} text-[10px] font-semibold border`}>
                {t(difficultyKey(card.difficulty))}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t(card.titleKey)}</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">{t(card.descriptionKey)}</p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.08]">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {card.readTime}
              </span>
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 gap-1 text-xs px-2 h-7">
                {t('learn.guidesPage.readGuide')} <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const startHereCards: GuideCard[] = [
  { titleKey: 'learn.guidesPage.cards.whatIsBlockchain.title', descriptionKey: 'learn.guidesPage.cards.whatIsBlockchain.description', icon: Layers, difficulty: 'Beginner', readTime: '5 min' },
  { titleKey: 'learn.guidesPage.cards.howBlockchainWorks.title', descriptionKey: 'learn.guidesPage.cards.howBlockchainWorks.description', icon: Cpu, difficulty: 'Beginner', readTime: '7 min' },
  { titleKey: 'learn.guidesPage.cards.whatIsWeb3.title', descriptionKey: 'learn.guidesPage.cards.whatIsWeb3.description', icon: Globe, difficulty: 'Beginner', readTime: '4 min' },
  { titleKey: 'learn.guidesPage.cards.walletsTokens.title', descriptionKey: 'learn.guidesPage.cards.walletsTokens.description', icon: Wallet, difficulty: 'Beginner', readTime: '6 min' },
  { titleKey: 'learn.guidesPage.cards.publicPrivateKeys.title', descriptionKey: 'learn.guidesPage.cards.publicPrivateKeys.description', icon: Shield, difficulty: 'Beginner', readTime: '4 min' },
  { titleKey: 'learn.guidesPage.cards.commonTerms.title', descriptionKey: 'learn.guidesPage.cards.commonTerms.description', icon: FileText, difficulty: 'Beginner', readTime: '5 min' },
];

const ethereumCards: GuideCard[] = [
  { titleKey: 'learn.guidesPage.cards.whatIsEthereum.title', descriptionKey: 'learn.guidesPage.cards.whatIsEthereum.description', icon: Layers, difficulty: 'Intermediate', readTime: '6 min' },
  { titleKey: 'learn.guidesPage.cards.ethereumVsBitcoin.title', descriptionKey: 'learn.guidesPage.cards.ethereumVsBitcoin.description', icon: Boxes, difficulty: 'Intermediate', readTime: '5 min' },
  { titleKey: 'learn.guidesPage.cards.smartContracts.title', descriptionKey: 'learn.guidesPage.cards.smartContracts.description', icon: Code, difficulty: 'Intermediate', readTime: '7 min' },
  { titleKey: 'learn.guidesPage.cards.gasFees.title', descriptionKey: 'learn.guidesPage.cards.gasFees.description', icon: Zap, difficulty: 'Intermediate', readTime: '5 min' },
  { titleKey: 'learn.guidesPage.cards.ethereumAccounts.title', descriptionKey: 'learn.guidesPage.cards.ethereumAccounts.description', icon: Wallet, difficulty: 'Intermediate', readTime: '6 min' },
  { titleKey: 'learn.guidesPage.cards.introEthDev.title', descriptionKey: 'learn.guidesPage.cards.introEthDev.description', icon: Code, difficulty: 'Intermediate', readTime: '8 min' },
];

const buildCards: GuideCard[] = [
  { titleKey: 'learn.guidesPage.cards.introDapps.title', descriptionKey: 'learn.guidesPage.cards.introDapps.description', icon: Globe, difficulty: 'Intermediate', readTime: '6 min' },
  { titleKey: 'learn.guidesPage.cards.whatAreDaos.title', descriptionKey: 'learn.guidesPage.cards.whatAreDaos.description', icon: Network, difficulty: 'Intermediate', readTime: '5 min' },
  { titleKey: 'learn.guidesPage.cards.web2VsWeb3.title', descriptionKey: 'learn.guidesPage.cards.web2VsWeb3.description', icon: Boxes, difficulty: 'Beginner', readTime: '4 min' },
  { titleKey: 'learn.guidesPage.cards.testnets.title', descriptionKey: 'learn.guidesPage.cards.testnets.description', icon: Cpu, difficulty: 'Advanced', readTime: '7 min' },
  { titleKey: 'learn.guidesPage.cards.devTooling.title', descriptionKey: 'learn.guidesPage.cards.devTooling.description', icon: Code, difficulty: 'Advanced', readTime: '8 min' },
  { titleKey: 'learn.guidesPage.cards.securityBasics.title', descriptionKey: 'learn.guidesPage.cards.securityBasics.description', icon: Shield, difficulty: 'Advanced', readTime: '7 min' },
];

const ecosystemResources = [
  { key: 'ethereum', url: 'https://ethereum.org/en/learn/', color: 'from-[hsl(213,60%,50%)] to-[hsl(260,50%,45%)]' },
  { key: 'binance', url: 'https://academy.binance.com/', color: 'from-[hsl(45,90%,50%)] to-[hsl(35,85%,45%)]' },
  { key: 'solana', url: 'https://solana.com/learn', color: 'from-[hsl(280,70%,55%)] to-[hsl(190,80%,50%)]' },
];

const journeyStepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];

const EducationalGuides = () => {
  const { t } = useTranslation();
  const ecosystemRef = useRef(null);
  const ecosystemInView = useInView(ecosystemRef, { once: true, margin: '-80px' });
  const journeyRef = useRef(null);
  const journeyInView = useInView(journeyRef, { once: true, margin: '-80px' });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" /> {t('learn.guidesPage.heroBadge')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 text-foreground">
              {t('learn.guidesPage.heroTitle')}<span className="text-accent">{t('learn.guidesPage.heroTitleAccent')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-3">
              {t('learn.guidesPage.heroSubtitle')}
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto">
              {t('learn.guidesPage.heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section-container pb-20">
        <Section id="start-here" title={t('learn.guidesPage.startHereTitle')} subtitle={t('learn.guidesPage.startHereSubtitle')} cards={startHereCards} t={t} />
        <Section id="ethereum" title={t('learn.guidesPage.ethereumTitle')} subtitle={t('learn.guidesPage.ethereumSubtitle')} cards={ethereumCards} t={t} />
        <Section id="build" title={t('learn.guidesPage.buildTitle')} subtitle={t('learn.guidesPage.buildSubtitle')} cards={buildCards} t={t} />

        {/* Ecosystem Resources */}
        <section ref={ecosystemRef} className="py-12 md:py-16">
          <motion.div initial="hidden" animate={ecosystemInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('learn.guidesPage.ecosystemTitle')}</h2>
            <p className="text-muted-foreground max-w-2xl">{t('learn.guidesPage.ecosystemSubtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ecosystemResources.map((res, i) => (
              <motion.a
                key={res.key}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                initial="hidden"
                animate={ecosystemInView ? 'visible' : 'hidden'}
                variants={fadeUp}
                custom={i + 1}
                className="glass rounded-2xl p-6 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${res.color} mb-5`} />
                <h3 className="text-xl font-bold text-foreground mb-2">{t(`learn.guidesPage.ecosystem.${res.key}.name`)}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{t(`learn.guidesPage.ecosystem.${res.key}.description`)}</p>
                <span className="flex items-center gap-1.5 text-accent text-sm font-medium group-hover:gap-2.5 transition-all">
                  {t('learn.guidesPage.visitResource')} <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Learning Journey */}
        <section ref={journeyRef} className="py-12 md:py-20">
          <motion.div initial="hidden" animate={journeyInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('learn.guidesPage.journeyTitle')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t('learn.guidesPage.journeySubtitle')}</p>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            {journeyStepKeys.map((stepKey, i) => (
              <motion.div
                key={stepKey}
                initial="hidden"
                animate={journeyInView ? 'visible' : 'hidden'}
                variants={fadeUp}
                custom={i + 1}
                className="flex items-start gap-4 mb-6 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  {i < journeyStepKeys.length - 1 && <div className="w-px h-8 bg-accent/20 mt-1" />}
                </div>
                <div className="pt-2">
                  <p className="text-foreground font-medium">{t(`learn.guidesPage.journey.${stepKey}`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Footer onPrivacyClick={() => {}} />
    </div>
  );
};

export default EducationalGuides;

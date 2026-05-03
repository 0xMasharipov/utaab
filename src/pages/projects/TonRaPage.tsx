import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Wallet,
  Coins,
  ShieldAlert,
  Gift,
  Activity,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import BackgroundGrid from '@/components/BackgroundGrid';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';

const TONRA_BOT_URL = 'https://t.me/TonRa_Robot';

const TonRaPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const prev = document.title;
    document.title = 'TonRa — Telegram Security Bot for TON | UTAAB';
    return () => {
      document.title = prev;
    };
  }, []);

  const useCases = [
    { key: 'wallet', Icon: Wallet },
    { key: 'token', Icon: Coins },
    { key: 'project', Icon: ShieldAlert },
    { key: 'airdrop', Icon: Gift },
    { key: 'overview', Icon: Activity },
    { key: 'decisions', Icon: CheckCircle2 },
  ] as const;

  const whatIsParagraphs = (t('projects.tonraPage.whatIs.body', { returnObjects: true }) as string[]) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <BackgroundGrid>
        {/* Hero */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('projects.tonraPage.hero.backToProjects')}
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent mb-4">
                  {t('projects.status.underDevelopment')}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-glow-soft leading-tight">
                  TonRa
                </h1>
                <p className="text-xl sm:text-2xl text-foreground/90 mb-4 font-semibold">
                  {t('projects.tonraPage.hero.tagline')}
                </p>
                <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                  {t('projects.tonraPage.hero.intro')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={TONRA_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-[0_8px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_36px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {t('projects.tonraPage.hero.tryBeta')}
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </a>
                  <Link
                    to="/#projects"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/[0.04] text-foreground hover:bg-white/[0.08] transition-colors font-medium"
                  >
                    {t('projects.tonraPage.hero.backToProjects')}
                  </Link>
                </div>

                <p className="mt-4 text-xs text-muted-foreground/80">
                  {t('projects.tonraPage.hero.devNote')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="relative flex justify-center lg:justify-end"
              >
                <AnimatedImage
                  src="/images/projects/UTAAB_TonRa.webp"
                  alt="TonRa"
                  containerClassName="w-full max-w-md"
                  className="w-full h-auto object-contain drop-shadow-[0_12px_36px_rgba(59,130,246,0.32)] hover:drop-shadow-[0_16px_48px_rgba(59,130,246,0.45)] transition-[filter] duration-500"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* What is TonRa */}
        <section className="py-12 md:py-20">
          <div className="section-container max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold mb-6 text-glow-soft"
            >
              {t('projects.tonraPage.whatIs.title')}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              {whatIsParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What is TonRa used for */}
        <section className="py-12 md:py-20">
          <div className="section-container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold mb-10 text-glow-soft text-center"
            >
              {t('projects.tonraPage.usedFor.title')}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {useCases.map(({ key, Icon }, idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.05 * idx }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t(`projects.tonraPage.usedFor.items.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`projects.tonraPage.usedFor.items.${key}.desc`)}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TonRa matters */}
        <section className="py-12 md:py-20">
          <div className="section-container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-8 md:p-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-glow-soft">
                  {t('projects.tonraPage.why.title')}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {t('projects.tonraPage.why.body')}
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="section-container max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-glow-soft">
                {t('projects.tonraPage.cta.title')}
              </h2>
              <a
                href={TONRA_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-[0_8px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_36px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition-all"
              >
                <Send className="w-5 h-5" />
                {t('projects.tonraPage.cta.button')}
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
              <p className="mt-4 text-sm text-muted-foreground">
                {t('projects.tonraPage.cta.note')}
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </BackgroundGrid>
    </div>
  );
};

export default TonRaPage;

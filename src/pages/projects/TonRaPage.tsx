import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import BackgroundGrid from '@/components/BackgroundGrid';
import AnimatedImage from '@/components/common/AnimatedImage';
import tonraLogo from '@/assets/projects/tonra-logo.png';

const TONRA_BOT_URL = 'https://t.me/TonRa_Robot';

const USE_CASE_KEYS = ['wallet', 'token', 'project', 'airdrop', 'overview', 'decisions'] as const;

const TonRaPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const prev = document.title;
    document.title = 'TonRa — Telegram Security Bot for TON | UTAAB';
    return () => {
      document.title = prev;
    };
  }, []);

  const whatIsParagraphs = (t('projects.tonraPage.whatIs.body', { returnObjects: true }) as string[]) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <BackgroundGrid>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t('projects.tonraPage.hero.backToProjects')}
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7"
              >
                <div className="flex items-center gap-3 mb-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="text-foreground/60">01</span>
                  <span className="h-px w-8 bg-white/20" />
                  <span>{t('projects.status.underDevelopment')}</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.02]">
                  Ton<span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Ra</span>
                </h1>

                <div className="h-px w-16 bg-white/15 mb-6" />

                <p className="text-xl sm:text-2xl text-foreground/90 mb-5 font-medium leading-snug max-w-xl">
                  {t('projects.tonraPage.hero.tagline')}
                </p>
                <p className="text-base text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  {t('projects.tonraPage.hero.intro')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href={TONRA_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-[0_6px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_8px_28px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {t('projects.tonraPage.hero.tryBeta')}
                  </a>
                  <Link
                    to="/#projects"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] text-foreground/80 hover:bg-white/[0.05] hover:text-foreground transition-colors text-sm font-medium"
                  >
                    {t('projects.tonraPage.hero.backToProjects')}
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['Beta', 'Telegram', 'TON'].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <p className="mt-8 text-xs text-muted-foreground/70 max-w-md">
                  {t('projects.tonraPage.hero.devNote')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="lg:col-span-5 relative flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-sm">
                  {/* Soft blue radial pocket */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -m-12 blur-3xl z-0"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)',
                    }}
                  />
                  {/* Faint hairline ring */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -m-6 rounded-full border border-white/[0.06] z-0"
                  />
                  <AnimatedImage
                    src={tonraLogo}
                    alt="TonRa logo"
                    containerClassName="relative z-10 w-full"
                    className="w-full h-auto object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.18)] transition-[filter] duration-500"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What is TonRa */}
        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-4"
              >
                <div className="lg:sticky lg:top-28">
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">About</div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    {t('projects.tonraPage.whatIs.title')}
                  </h2>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-8 space-y-5"
              >
                {whatIsParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'text-xl text-foreground/90 leading-relaxed'
                        : 'text-base text-muted-foreground leading-relaxed'
                    }
                  >
                    {p}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Used for — numbered editorial list */}
        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="mb-12 max-w-2xl"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">Capabilities</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {t('projects.tonraPage.usedFor.title')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {USE_CASE_KEYS.map((key, idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: 0.04 * idx }}
                  className="group relative flex gap-6 py-7 border-t border-white/[0.08]"
                >
                  <div className="shrink-0 w-12 text-4xl font-extralight text-foreground/20 tabular-nums leading-none pt-1">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                      {t(`projects.tonraPage.usedFor.items.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`projects.tonraPage.usedFor.items.${key}.desc`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why — editorial pull quote */}
        <section className="border-t border-white/[0.06] py-24 md:py-32">
          <div className="section-container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-6">
                {t('projects.tonraPage.why.title')}
              </div>
              <div
                aria-hidden
                className="text-7xl md:text-8xl font-serif text-primary/30 leading-none mb-2 select-none"
              >
                “
              </div>
              <p className="text-2xl md:text-3xl font-light leading-snug text-foreground/90 tracking-tight">
                {t('projects.tonraPage.why.body')}
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-px w-8 bg-white/15" />
                TonRa · UTAAB
                <span className="h-px w-8 bg-white/15" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className="section-container max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="relative text-center"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.18) 0%, transparent 60%)',
                }}
              />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
                {t('projects.tonraPage.cta.title')}
              </h2>
              <a
                href={TONRA_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-[0_6px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_32px_rgba(59,130,246,0.45)] hover:-translate-y-0.5 transition-all"
              >
                <Send className="w-4 h-4" />
                {t('projects.tonraPage.cta.button')}
              </a>
              <p className="mt-5 text-xs text-muted-foreground">
                {t('projects.tonraPage.cta.note')}
              </p>
            </motion.div>
          </div>
        </section>

        <Footer onPrivacyClick={() => {}} />
      </BackgroundGrid>
    </div>
  );
};

export default TonRaPage;

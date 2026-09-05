import {
  Component,
  type ErrorInfo,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import SEO from '@/components/SEO';
import tonraLogo from '@/assets/projects/tonra-logo-640.webp';
import walletMotion from '@/assets/projects/Wallet.webp';
import walletPoster from '@/assets/projects/Wallet-poster.webp';
import tonMotion from '@/assets/projects/TON.webp';
import tonPoster from '@/assets/projects/TON-poster.webp';
import scanMotion from '@/assets/projects/scan.webp';
import scanPoster from '@/assets/projects/scan-poster.webp';
import connectMotion from '@/assets/projects/connect.webp';
import connectPoster from '@/assets/projects/connect-poster.webp';
import aiMotion from '@/assets/projects/ai_ansvering.webp';
import aiPoster from '@/assets/projects/ai_ansvering-poster.webp';
import verifiedMotion from '@/assets/projects/get_verified.webp';
import verifiedPoster from '@/assets/projects/get_verified-poster.webp';
import blockchainMotion from '@/assets/projects/blockchain.webp';
import blockchainPoster from '@/assets/projects/blockchain-poster.webp';

const TONRA_BOT_URL = 'https://t.me/TonRa_Robot';
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1687ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05080f]';

const phoneSlides = [
  { key: 'wallets' },
  { key: 'assets' },
  { key: 'airdrops' },
] as const;

type PhoneSlide = (typeof phoneSlides)[number];

interface MotionAsset {
  animated: string;
  poster: string;
}

const tonraMotionAssets = {
  wallet: { animated: walletMotion, poster: walletPoster },
  ton: { animated: tonMotion, poster: tonPoster },
  scan: { animated: scanMotion, poster: scanPoster },
  connect: { animated: connectMotion, poster: connectPoster },
  ai: { animated: aiMotion, poster: aiPoster },
  verified: { animated: verifiedMotion, poster: verifiedPoster },
  blockchain: { animated: blockchainMotion, poster: blockchainPoster },
} satisfies Record<string, MotionAsset>;

const ProjectMotionIcon = ({ asset, className = '' }: { asset: MotionAsset; className?: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <img
      src={reduceMotion ? asset.poster : asset.animated}
      alt=""
      aria-hidden
      loading="lazy"
      className={`object-contain ${className}`}
    />
  );
};

const usePageLinks = () => {
  const { t } = useTranslation();
  return [
    { href: '#checks', label: t('projects.tonraPage.nav.checks') },
    { href: '#workflow', label: t('projects.tonraPage.nav.workflow') },
    { href: '#safety', label: t('projects.tonraPage.nav.safety') },
  ];
};

const PageNavbar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const links = usePageLinks();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/[0.08] bg-[#05080f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className={`flex items-center gap-2.5 rounded-md ${focusRing}`}>
          <img src={tonraLogo} alt="" className="h-9 w-9 object-contain" />
          <span className="text-[15px] font-extrabold tracking-[-0.035em] text-[#f4f7fb]">TonRa</span>
        </Link>

        <nav aria-label={t('projects.tonraPage.nav.ariaLabel')} className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-md py-2 text-[13px] font-semibold text-slate-400 transition-colors hover:text-white ${focusRing}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={TONRA_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden min-h-10 items-center rounded-full bg-[#1687ff] px-5 text-sm font-extrabold whitespace-nowrap text-[#03101f] transition-transform hover:-translate-y-0.5 active:translate-y-px sm:inline-flex ${focusRing}`}
          >
            {t('projects.tonraPage.nav.openTonra')}
            <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="tonra-mobile-menu"
            aria-label={t('projects.tonraPage.nav.toggleMenu')}
            onClick={() => setOpen((value) => !value)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.08] lg:hidden ${focusRing}`}
          >
            {open ? <X aria-hidden className="h-5 w-5" strokeWidth={1.8} /> : <Menu aria-hidden className="h-5 w-5" strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="tonra-mobile-menu"
            aria-label={t('projects.tonraPage.nav.mobileAriaLabel')}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-16 border-b border-white/[0.08] bg-[#070b12]/[0.98] px-4 py-4 shadow-[0_22px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white ${focusRing}`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={TONRA_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[#1687ff] px-5 text-sm font-extrabold text-[#03101f] ${focusRing}`}
              >
                {t('projects.tonraPage.nav.openTonra')}
                <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const EmptyPhone = ({ active }: { active: boolean }) => (
  <div className="relative aspect-[0.462] w-[176px] sm:w-[212px] lg:w-[238px] xl:w-[252px]">
    <div className="absolute inset-0 rounded-[36px] bg-[linear-gradient(160deg,#f8fafc_0%,#8c98a8_24%,#dfe6ee_50%,#566272_100%)] p-[5px] shadow-[0_30px_72px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.95)] sm:rounded-[44px] sm:p-[6px]">
      <div className="relative h-full w-full rounded-[31px] bg-[#03050a] p-[3px] sm:rounded-[38px]">
        <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[linear-gradient(155deg,#0c1421_0%,#050912_56%,#0a111c_100%)] sm:rounded-[35px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_24%,rgba(22,135,255,0.12),transparent_38%)]" />
          <div className="absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <motion.div
            aria-hidden
            animate={active ? { opacity: [0.15, 0.34, 0.15], x: ['-35%', '140%'] } : { opacity: 0 }}
            transition={active ? { duration: 5.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' } : { duration: 0.2 }}
            className="absolute -top-[20%] h-[140%] w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.055] to-transparent"
          />
        </div>
      </div>
    </div>
    <span aria-hidden className="absolute -left-[3px] top-[16%] h-[5%] w-[4px] rounded-s-md bg-slate-400" />
    <span aria-hidden className="absolute -left-[3px] top-[24%] h-[9%] w-[4px] rounded-s-md bg-slate-400" />
    <span aria-hidden className="absolute -left-[3px] top-[35%] h-[9%] w-[4px] rounded-s-md bg-slate-400" />
    <span aria-hidden className="absolute -right-[3px] top-[27%] h-[12%] w-[4px] rounded-e-md bg-slate-400" />
  </div>
);

const PhoneDeck = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const setSlide = (index: number) => {
    setActiveIndex((index + phoneSlides.length) % phoneSlides.length);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const intent = info.offset.x + info.velocity.x * 0.12;
    if (intent < -70) setSlide(activeIndex + 1);
    if (intent > 70) setSlide(activeIndex - 1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setSlide(activeIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setSlide(activeIndex + 1);
    }
  };

  const activeSlide: PhoneSlide = phoneSlides[activeIndex];

  return (
    <div className="relative mx-auto w-full max-w-[560px]" dir="ltr">
      <div
        role="group"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={t('projects.tonraPage.carousel.ariaLabel')}
        onKeyDown={handleKeyDown}
        className={`relative flex min-h-[410px] items-center justify-center overflow-hidden rounded-2xl sm:min-h-[510px] lg:min-h-[590px] ${focusRing}`}
      >
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[60%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[42%] bg-[#1687ff]/25 blur-[74px]" />
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          className="relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          {phoneSlides.map((slide, index) => {
            const position = (index - activeIndex + phoneSlides.length) % phoneSlides.length;
            const isActive = position === 0;
            const isRight = position === 1;
            const target = isActive
              ? { x: 0, y: 0, scale: 1, rotateY: 0, rotateZ: 0, opacity: 1, zIndex: 30 }
              : isRight
                ? { x: 96, y: 12, scale: 0.84, rotateY: -10, rotateZ: 1.6, opacity: 0.42, zIndex: 10 }
                : { x: -96, y: 12, scale: 0.84, rotateY: 10, rotateZ: -1.6, opacity: 0.42, zIndex: 10 };

            return (
              <motion.div
                key={slide.key}
                aria-hidden
                animate={target}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 145, damping: 22, mass: 0.82 }}
                className="absolute [transform-style:preserve-3d]"
              >
                <EmptyPhone active={isActive && !reduceMotion} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="relative z-[1] -mt-3 px-4 text-center sm:-mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.key}
            id={`tonra-panel-${activeSlide.key}`}
            role="tabpanel"
            aria-labelledby={`tonra-tab-${activeSlide.key}`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            aria-live="polite"
          >
            <h2 className="text-xl font-extrabold tracking-[-0.035em] text-white sm:text-2xl">
              {t(`projects.tonraPage.carousel.${activeSlide.key}.title`)}
            </h2>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm font-medium leading-6 text-slate-400">
              {t(`projects.tonraPage.carousel.${activeSlide.key}.body`)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setSlide(activeIndex - 1)}
            aria-label={t('projects.tonraPage.carousel.previous')}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-slate-200 transition-colors hover:bg-white/[0.1] active:translate-y-px ${focusRing}`}
          >
            <ChevronLeft aria-hidden className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <div role="tablist" aria-label={t('projects.tonraPage.carousel.tabsLabel')} className="flex items-center gap-2">
            {phoneSlides.map((slide, index) => (
              <button
                key={slide.key}
                id={`tonra-tab-${slide.key}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`tonra-panel-${slide.key}`}
                aria-label={t('projects.tonraPage.carousel.goTo', { number: index + 1 })}
                onClick={() => setSlide(index)}
                className={`h-2 rounded-full transition-[width,background-color] ${activeIndex === index ? 'w-7 bg-[#1687ff]' : 'w-2 bg-white/25 hover:bg-white/45'} ${focusRing}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSlide(activeIndex + 1)}
            aria-label={t('projects.tonraPage.carousel.next')}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-slate-200 transition-colors hover:bg-white/[0.1] active:translate-y-px ${focusRing}`}
          >
            <ChevronRight aria-hidden className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Reveal = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_42%,rgba(22,135,255,0.12),transparent_31%)]" />
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-6 lg:px-8 lg:py-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[1] mx-auto max-w-xl text-center lg:mx-0 lg:text-start"
        >
          <Link
            to="/#projects"
            className={`mb-7 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-slate-400 transition-colors hover:text-white ${focusRing}`}
          >
            <ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" strokeWidth={1.8} />
            {t('projects.tonraPage.hero.backToProjects')}
          </Link>
          <h1 className="text-balance text-[clamp(2.35rem,4.4vw,3.65rem)] font-extrabold leading-[0.98] tracking-[-0.065em] text-[#f4f7fb]">
            {t('projects.tonraPage.hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-[50ch] text-pretty text-base font-medium leading-7 text-slate-400 sm:text-lg lg:mx-0 lg:leading-8">
            {t('projects.tonraPage.hero.intro')}
          </p>
          <a
            href={TONRA_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 inline-flex min-h-12 items-center rounded-full bg-[#1687ff] px-6 text-sm font-extrabold whitespace-nowrap text-[#03101f] transition-transform hover:-translate-y-0.5 active:translate-y-px ${focusRing}`}
          >
            {t('projects.tonraPage.nav.openTonra')}
            <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
          </a>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0"
        >
          <PhoneDeck />
        </motion.div>
      </div>
    </section>
  );
};

const ChecksSection = () => {
  const { t } = useTranslation();
  const groups = [
    { key: 'wallets', asset: tonraMotionAssets.wallet },
    { key: 'assets', asset: tonraMotionAssets.ton },
    { key: 'campaigns', asset: tonraMotionAssets.scan },
  ] as const;

  return (
    <section id="checks" className="scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            {t('projects.tonraPage.checks.title')}
          </h2>
          <p className="mt-5 max-w-[58ch] text-base font-medium leading-7 text-slate-400 sm:text-lg">
            {t('projects.tonraPage.checks.body')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2">
          {groups.map((group, index) => (
            <Reveal
              key={group.key}
              className={
                index === 0
                  ? 'relative overflow-hidden rounded-2xl border border-[#1687ff]/25 bg-[#0a1626] p-7 md:col-span-7 md:row-span-2 md:min-h-[430px] sm:p-9'
                  : index === 1
                    ? 'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1019] p-7 md:col-span-5 sm:p-8'
                    : 'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(135deg,#0b1019,#0d1521)] p-7 md:col-span-5 sm:p-8'
              }
            >
              {index === 0 && <div aria-hidden className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#1687ff]/10" />}
              <div className={`relative flex h-full flex-col ${index === 0 ? 'min-h-[300px]' : 'min-h-[160px]'}`}>
                <ProjectMotionIcon asset={group.asset} className={index === 0 ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-16 w-16'} />
                <div className="mt-auto pt-16">
                  <h3 className={`${index === 0 ? 'text-3xl sm:text-4xl' : 'text-2xl'} font-extrabold tracking-[-0.04em] text-white`}>
                    {t(`projects.tonraPage.checks.groups.${group.key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[44ch] text-sm font-medium leading-6 text-slate-400 sm:text-base sm:leading-7">
                    {t(`projects.tonraPage.checks.groups.${group.key}.body`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkflowSection = () => {
  const { t } = useTranslation();
  const items = [
    { key: 'send', asset: tonraMotionAssets.connect },
    { key: 'review', asset: tonraMotionAssets.ai },
    { key: 'decide', asset: tonraMotionAssets.verified },
  ] as const;

  return (
    <section id="workflow" className="scroll-mt-16 border-y border-white/[0.08] bg-[#070b12] px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            {t('projects.tonraPage.workflow.title')}
          </h2>
          <p className="mt-5 max-w-[52ch] text-base font-medium leading-7 text-slate-400 sm:text-lg">
            {t('projects.tonraPage.workflow.body')}
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal
              key={item.key}
              className={`py-8 md:px-8 md:py-4 ${index > 0 ? 'border-t border-white/[0.08] md:border-l md:border-t-0 rtl:md:border-l-0 rtl:md:border-r' : ''}`}
            >
              <ProjectMotionIcon asset={item.asset} className="h-16 w-16" />
              <h3 className="mt-10 text-2xl font-extrabold tracking-[-0.04em] text-white">
                {t(`projects.tonraPage.workflow.items.${item.key}.title`)}
              </h3>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-400 sm:text-base sm:leading-7">
                {t(`projects.tonraPage.workflow.items.${item.key}.body`)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const SafetySection = () => {
  const { t } = useTranslation();
  const points = [
    { key: 'publicData', asset: tonraMotionAssets.blockchain },
    { key: 'noKeys', asset: tonraMotionAssets.wallet },
    { key: 'tonFocus', asset: tonraMotionAssets.ton },
  ] as const;

  return (
    <section id="safety" className="scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
        <Reveal>
          <div className="relative mx-auto flex aspect-square w-full max-w-[430px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d15]">
            <div aria-hidden className="absolute h-[58%] w-[58%] rounded-full bg-[#1687ff]/20 blur-[65px]" />
            <img src={tonraLogo} alt="TonRa" loading="lazy" className="relative w-[58%] object-contain drop-shadow-[0_20px_38px_rgba(0,0,0,0.32)]" />
          </div>
        </Reveal>

        <Reveal>
          <h2 className="text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            {t('projects.tonraPage.safety.title')}
          </h2>
          <p className="mt-5 max-w-[56ch] text-base font-medium leading-7 text-slate-400 sm:text-lg">
            {t('projects.tonraPage.safety.body')}
          </p>

          <div className="mt-10 space-y-0">
            {points.map((point) => (
              <div key={point.key} className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/[0.08] py-6 first:pt-0">
                <ProjectMotionIcon asset={point.asset} className="h-11 w-11" />
                <div>
                  <h3 className="text-base font-extrabold text-white sm:text-lg">
                    {t(`projects.tonraPage.safety.points.${point.key}.title`)}
                  </h3>
                  <p className="mt-1.5 max-w-[54ch] text-sm font-medium leading-6 text-slate-400">
                    {t(`projects.tonraPage.safety.points.${point.key}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const FinalCta = () => {
  const { t } = useTranslation();
  return (
    <section className="px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8 lg:pb-40">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#1687ff]/25 bg-[#0a1626] px-6 py-16 text-center sm:px-10 sm:py-20 lg:py-24">
        <div aria-hidden className="absolute left-1/2 top-full h-72 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1687ff]/18 blur-[90px]" />
        <div className="relative mx-auto max-w-3xl">
          <img src={tonraLogo} alt="" loading="lazy" className="mx-auto h-16 w-16 object-contain" />
          <h2 className="mt-7 text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            {t('projects.tonraPage.cta.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-[45ch] text-base font-medium leading-7 text-slate-400 sm:text-lg">
            {t('projects.tonraPage.cta.body')}
          </p>
          <a
            href={TONRA_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 inline-flex min-h-12 items-center rounded-full bg-[#1687ff] px-6 text-sm font-extrabold whitespace-nowrap text-[#03101f] transition-transform hover:-translate-y-0.5 active:translate-y-px ${focusRing}`}
          >
            {t('projects.tonraPage.nav.openTonra')}
            <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
          </a>
          <p className="mt-5 text-xs font-medium text-slate-500">{t('projects.tonraPage.cta.note')}</p>
        </div>
      </Reveal>
    </section>
  );
};

const PageFooter = () => {
  const { t } = useTranslation();
  const links = usePageLinks();

  return (
    <footer className="border-t border-white/[0.08] bg-[#05080f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={tonraLogo} alt="" loading="lazy" className="h-10 w-10 object-contain" />
            <span className="text-lg font-extrabold tracking-[-0.035em] text-white">TonRa</span>
          </div>
          <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-400">
            {t('projects.tonraPage.footer.tagline')}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-white">{t('projects.tonraPage.footer.product')}</h2>
          <ul className="mt-4 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={`rounded text-sm font-medium text-slate-400 transition-colors hover:text-white ${focusRing}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-white">{t('projects.tonraPage.footer.community')}</h2>
          <ul className="mt-4 space-y-3">
            <li><Link to="/" className={`rounded text-sm font-medium text-slate-400 transition-colors hover:text-white ${focusRing}`}>{t('projects.tonraPage.footer.utaabHome')}</Link></li>
            <li><Link to="/#projects" className={`rounded text-sm font-medium text-slate-400 transition-colors hover:text-white ${focusRing}`}>{t('projects.tonraPage.footer.projects')}</Link></li>
            <li><a href={TONRA_BOT_URL} target="_blank" rel="noopener noreferrer" className={`rounded text-sm font-medium text-slate-400 transition-colors hover:text-white ${focusRing}`}>{t('projects.tonraPage.nav.openTonra')}</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/[0.08] pt-6 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} UTAAB. {t('projects.tonraPage.footer.rights')}</span>
        <span>{t('projects.tonraPage.footer.ecosystem')}</span>
      </div>
    </footer>
  );
};

class TonRaErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[TonRaPage] render error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#05080f] px-6 text-center text-white">
        <img src={tonraLogo} alt="TonRa" className="mb-5 h-14 w-14 object-contain" />
        <h1 className="text-2xl font-extrabold">TonRa could not load</h1>
        <p className="mt-3 max-w-md text-slate-400">Something went wrong while rendering this page. Your session is safe.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className={`min-h-11 rounded-full bg-[#1687ff] px-5 text-sm font-extrabold text-[#03101f] ${focusRing}`}>Reload</button>
          <Link to="/" className={`inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white ${focusRing}`}>Back to UTAAB</Link>
        </div>
      </div>
    );
  }
}

const TonRaPageInner = () => {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtml = html.style.background;
    const previousBody = body.style.background;
    const previousLanguage = html.lang;
    const previousDirection = html.dir;
    html.style.background = '#05080f';
    body.style.background = '#05080f';
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
    return () => {
      html.style.background = previousHtml;
      body.style.background = previousBody;
      html.lang = previousLanguage;
      html.dir = previousDirection;
    };
  }, [language]);

  return (
    <div className="min-h-[100dvh] bg-[#05080f] font-sans text-[#f4f7fb] selection:bg-[#1687ff]/35 selection:text-white">
      <PageNavbar />
      <main>
        <Hero />
        <ChecksSection />
        <WorkflowSection />
        <SafetySection />
        <FinalCta />
      </main>
      <PageFooter />
    </div>
  );
};

const TonRaPage = () => (
  <TonRaErrorBoundary>
    <SEO
      title="TonRa | TON Security Bot by UTAAB"
      description="Check TON wallets, tokens, projects, and airdrops with TonRa directly inside Telegram before you interact."
      path="/projects/tonra"
      ogType="website"
      image="https://utaab.org/og-image.png"
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'TonRa',
          applicationCategory: 'SecurityApplication',
          operatingSystem: 'Telegram',
          url: TONRA_BOT_URL,
          description: 'A Telegram security and research bot for wallets, tokens, projects, and airdrops in the TON ecosystem.',
          publisher: { '@type': 'Organization', name: 'UTAAB', url: 'https://utaab.org' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is TonRa?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'TonRa is a Telegram security and research bot for the TON ecosystem. It helps users review wallets, tokens, projects, and airdrops before interacting.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does TonRa need my seed phrase or private key?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. TonRa works with public information and never needs your seed phrase or private keys.',
              },
            },
            {
              '@type': 'Question',
              name: 'Where can I use TonRa?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'TonRa is available through the @TonRa_Robot bot on Telegram.',
              },
            },
          ],
        },
      ]}
    />
    <TonRaPageInner />
  </TonRaErrorBoundary>
);

export default TonRaPage;

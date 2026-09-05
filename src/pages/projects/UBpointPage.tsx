import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  Linkedin,
  Mail,
  Menu,
  MonitorSmartphone,
  Send,
  Smartphone,
  Twitter,
  X,
} from 'lucide-react';
import SEO from '@/components/SEO';
import logoAsset from '@/assets/ubpoint-logo.png.asset.json';

const UBPOINT_APP_URL = 'https://ubpoint.app/';
const UBPOINT_LOGO_URL = `https://utaab.org${logoAsset.url}`;
const WHATSAPP_URL = 'https://chat.whatsapp.com/HnTcuJYiKAiDpLPnG33mEr';
const SPONSOR_EMAIL = 'mailto:contact@utaab.org?subject=UBpoint%20Sponsor%20Inquiry';
const BASE_WALLET = '0x4fF797906D7B56F9Bd2Db382BcB36C97d69A43A9';
const BASESCAN_URL = `https://basescan.org/address/${BASE_WALLET}`;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

type StoryStage = {
  key: string;
  anchor: string;
  href?: string;
  external?: boolean;
};

const storyStages: readonly StoryStage[] = [
  { key: 'participation', anchor: 'story', href: UBPOINT_APP_URL, external: true },
  { key: 'rewards', anchor: 'rewards' },
  { key: 'proof', anchor: 'verified', href: BASESCAN_URL, external: true },
  { key: 'sponsors', anchor: 'sponsors', href: SPONSOR_EMAIL, external: false },
];

const useNavLinks = () => {
  const { t } = useTranslation();
  return [
    { href: '#story', label: t('projects.ubpointPage.nav.story') },
    { href: '#rewards', label: t('projects.ubpointPage.nav.rewards') },
    { href: '#verified', label: t('projects.ubpointPage.nav.onChain') },
    { href: '#sponsors', label: t('projects.ubpointPage.nav.sponsors') },
    { href: '#download', label: t('projects.ubpointPage.nav.download') },
  ];
};

const PageNavbar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const links = useNavLinks();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200/80 bg-[#f8fafc]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className={`flex items-center gap-2.5 rounded-md ${focusRing}`}>
          <img src={UBPOINT_LOGO_URL} alt="" className="h-9 w-9 rounded-lg" />
          <span className="text-[15px] font-extrabold tracking-[-0.03em] text-slate-950">UBpoint</span>
        </Link>

        <nav aria-label={t('projects.ubpointPage.nav.ariaLabel')} className="hidden items-center gap-5 xl:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-md px-1 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950 ${focusRing}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={UBPOINT_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden min-h-10 items-center rounded-full bg-slate-950 px-5 text-sm font-bold whitespace-nowrap text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:inline-flex ${focusRing}`}
          >
            {t('projects.ubpointPage.nav.openApp')}
            <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="ubpoint-mobile-menu"
            aria-label={t('projects.ubpointPage.nav.toggleMenu')}
            onClick={() => setOpen((value) => !value)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 transition-colors hover:bg-slate-100 xl:hidden ${focusRing}`}
          >
            {open ? <X aria-hidden className="h-5 w-5" strokeWidth={1.8} /> : <Menu aria-hidden className="h-5 w-5" strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="ubpoint-mobile-menu"
            aria-label={t('projects.ubpointPage.nav.mobileAriaLabel')}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-16 border-b border-slate-200 bg-[#f8fafc]/[0.98] px-4 py-4 shadow-[0_18px_45px_rgba(30,64,175,0.08)] backdrop-blur-xl xl:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800 ${focusRing}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

interface EmptyPhoneProps {
  progress: MotionValue<number>;
  compact?: boolean;
}

const EmptyPhone = ({ progress, compact = false }: EmptyPhoneProps) => {
  const rotateY = useTransform(progress, [0, 0.34, 0.68, 1], [-5, 3, -4, 4]);
  const rotateZ = useTransform(progress, [0, 0.5, 1], [-0.8, 0.7, -0.4]);

  return (
    <div className="relative flex items-center justify-center [perspective:1100px]" aria-hidden>
      <div
        aria-hidden
        className="absolute h-[72%] w-[155%] rounded-full bg-blue-600/20 blur-[78px] sm:blur-[96px]"
      />
      <motion.div
        style={{ rotateY, rotateZ, transformStyle: 'preserve-3d' }}
        className={`relative aspect-[0.462] ${compact ? 'w-[184px] sm:w-[210px]' : 'w-[188px] sm:w-[225px] lg:w-[280px] xl:w-[300px]'}`}
      >
        <div className="absolute inset-0 rounded-[44px] bg-[linear-gradient(145deg,#f1f5f9_0%,#94a3b8_25%,#e2e8f0_52%,#64748b_100%)] p-[5px] shadow-[0_32px_80px_rgba(30,64,175,0.18),0_14px_28px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] sm:rounded-[52px] sm:p-[6px]">
          <div className="relative h-full w-full rounded-[39px] bg-slate-950 p-[3px] sm:rounded-[47px]">
            <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-[#f3f6fb] sm:rounded-[44px]">
              <div className="absolute left-1/2 top-2 h-[20px] w-[68px] -translate-x-1/2 rounded-full bg-slate-950 sm:h-[23px] sm:w-[78px]" />
            </div>
          </div>
        </div>
        <span aria-hidden className="absolute -left-[3px] top-[16%] h-[5%] w-[4px] rounded-s-md bg-slate-400" />
        <span aria-hidden className="absolute -left-[3px] top-[24%] h-[9%] w-[4px] rounded-s-md bg-slate-400" />
        <span aria-hidden className="absolute -left-[3px] top-[35%] h-[9%] w-[4px] rounded-s-md bg-slate-400" />
        <span aria-hidden className="absolute -right-[3px] top-[27%] h-[12%] w-[4px] rounded-e-md bg-slate-400" />
      </motion.div>
    </div>
  );
};

interface StageContentProps {
  stage: (typeof storyStages)[number];
}

const StageContent = ({ stage }: StageContentProps) => {
  const { t } = useTranslation();
  const key = `projects.ubpointPage.story.${stage.key}`;

  return (
    <motion.div
      key={stage.key}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -18, filter: 'blur(7px)' }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="relative max-w-[640px]"
    >
      <h1 className="max-w-[640px] text-balance text-[clamp(2rem,3.65vw,3.25rem)] font-extrabold leading-[1.04] tracking-[-0.055em] text-slate-950">
        {t(`${key}.title`)}
      </h1>
      <p className="mt-5 max-w-[540px] text-pretty text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
        {t(`${key}.body`)}
      </p>
      {stage.href && (
        <a
          href={stage.href}
          target={stage.external ? '_blank' : undefined}
          rel={stage.external ? 'noopener noreferrer' : undefined}
          className={`mt-7 inline-flex min-h-12 items-center rounded-full bg-slate-950 px-6 text-sm font-bold whitespace-nowrap text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 ${focusRing}`}
        >
          {t(`${key}.cta`)}
          {stage.external ? (
            <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
          ) : (
            <ArrowRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
          )}
        </a>
      )}
    </motion.div>
  );
};

const StoryProgress = ({ progress, activeIndex }: { progress: MotionValue<number>; activeIndex: number }) => {
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:bottom-9 md:left-[52%] md:translate-x-0">
        {storyStages.map((stage, index) => (
          <a
            key={stage.key}
            href={`#${stage.anchor}`}
            aria-label={t('projects.ubpointPage.story.goTo', { number: index + 1 })}
            aria-current={activeIndex === index ? 'step' : undefined}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${activeIndex === index ? 'w-7 bg-slate-950' : 'w-1.5 bg-slate-300'} ${focusRing}`}
          />
        ))}
      </div>
      <div aria-hidden className="absolute right-7 top-1/2 hidden h-[44%] w-px -translate-y-1/2 overflow-hidden bg-slate-200 md:block">
        <motion.div style={{ scaleY, transformOrigin: 'top' }} className="h-full w-full bg-blue-700" />
      </div>
    </>
  );
};

const AnimatedStory = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.35 });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const next = Math.min(storyStages.length - 1, Math.floor(latest * storyStages.length));
    if (activeIndexRef.current === next) return;
    activeIndexRef.current = next;
    setActiveIndex(next);
  });

  return (
    <section ref={sectionRef} className="relative h-[400dvh] bg-[#f8fafc]">
      {storyStages.map((stage, index) => (
        <span
          key={stage.anchor}
          id={stage.anchor}
          aria-hidden
          className="pointer-events-none absolute scroll-mt-16"
          style={{ top: `${index * 18.75}%` }}
        />
      ))}

      <div className="sticky top-16 min-h-[calc(100dvh-4rem)] overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl grid-rows-[minmax(0,0.9fr)_minmax(0,0.72fr)] items-center gap-4 px-4 pb-14 pt-5 sm:px-6 sm:pb-16 sm:pt-7 md:grid-cols-[45%_55%] md:grid-rows-1 md:gap-0 md:px-8 md:py-8">
          <div className="relative flex min-h-0 items-center justify-center">
            <EmptyPhone progress={progress} />
          </div>

          <div className="relative flex min-h-0 items-center px-2 text-center sm:px-6 md:h-full md:px-[8%] md:text-start">
            <div aria-hidden className="pointer-events-none absolute -bottom-[10%] end-0 select-none text-[clamp(9rem,25vw,22rem)] font-extrabold leading-none tracking-[-0.08em] text-slate-950/[0.045]">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
            <div className="relative z-[1] mx-auto md:mx-0">
              <AnimatePresence mode="wait">
                <StageContent stage={storyStages[activeIndex]} />
              </AnimatePresence>
            </div>
          </div>
        </div>
        <StoryProgress progress={progress} activeIndex={activeIndex} />
      </div>
    </section>
  );
};

const StaticStory = () => {
  const { t } = useTranslation();
  const progress = useMotionValue(0);

  return (
    <section className="bg-[#f8fafc] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div id="story" className="scroll-mt-20">
          <EmptyPhone progress={progress} compact />
        </div>
        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-x-14 md:gap-y-20">
          {storyStages.map((stage, index) => {
            const key = `projects.ubpointPage.story.${stage.key}`;
            return (
              <article key={stage.key} id={stage.anchor === 'story' ? undefined : stage.anchor} className="scroll-mt-20">
                <div className="text-sm font-extrabold text-blue-700">{String(index + 1).padStart(2, '0')}</div>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {t(`${key}.title`)}
                </h2>
                <p className="mt-4 max-w-[48ch] text-base font-medium leading-7 text-slate-600">{t(`${key}.body`)}</p>
                {stage.href && (
                  <a
                    href={stage.href}
                    target={stage.external ? '_blank' : undefined}
                    rel={stage.external ? 'noopener noreferrer' : undefined}
                    className={`mt-6 inline-flex min-h-12 items-center rounded-full bg-slate-950 px-6 text-sm font-bold text-white ${focusRing}`}
                  >
                    {t(`${key}.cta`)}
                    <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Story = () => {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticStory /> : <AnimatedStory />;
};

const AvailabilitySection = () => {
  const { t } = useTranslation();

  return (
    <section id="download" className="scroll-mt-16 bg-[#f8fafc] px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
            {t('projects.ubpointPage.availability.title')}
          </h2>
          <p className="mt-5 max-w-[52ch] text-base font-medium leading-7 text-slate-600 sm:text-lg">
            {t('projects.ubpointPage.availability.body')}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2">
          <div className="relative overflow-hidden rounded-2xl bg-blue-700 p-7 text-white shadow-[0_28px_80px_rgba(29,78,216,0.2)] sm:p-10 md:col-span-7 md:row-span-2 md:min-h-[440px] lg:p-12">
            <div aria-hidden className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-white/10" />
            <div className="relative flex h-full min-h-[300px] flex-col">
              <MonitorSmartphone aria-hidden className="h-11 w-11" strokeWidth={1.5} />
              <div className="mt-auto pt-20">
                <div className="text-sm font-bold text-blue-100">{t('projects.ubpointPage.availability.availableNow')}</div>
                <h3 className="mt-2 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
                  {t('projects.ubpointPage.availability.webApp')}
                </h3>
                <a
                  href={UBPOINT_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-7 inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-extrabold whitespace-nowrap text-blue-800 transition-transform hover:-translate-y-0.5 active:translate-y-0 ${focusRing}`}
                >
                  {t('projects.ubpointPage.nav.openApp')}
                  <ArrowUpRight aria-hidden className="ms-2 h-4 w-4" strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </div>

          {[
            { key: 'ios', icon: Apple },
            { key: 'android', icon: Smartphone },
          ].map((platform) => (
            <div
              key={platform.key}
              className="flex min-h-[210px] flex-col rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 md:col-span-5"
            >
              <platform.icon aria-hidden className="h-9 w-9 text-slate-800" strokeWidth={1.5} />
              <div className="mt-auto pt-12">
                <h3 className="text-2xl font-extrabold tracking-[-0.035em] text-slate-950">
                  {t(`projects.ubpointPage.availability.${platform.key}`)}
                </h3>
                <span aria-disabled="true" className="mt-3 inline-flex text-sm font-bold text-slate-500">
                  {t('projects.ubpointPage.availability.comingSoon')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PageFooter = () => {
  const { t } = useTranslation();
  const links = useNavLinks();
  const socialLinks = [
    { href: 'https://www.linkedin.com/company/utaa-blockchain/', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://t.me/utaa_blockchain', label: 'Telegram', icon: Send },
    { href: 'https://x.com/utaa_blockchain?s=11', label: 'X', icon: Twitter },
    { href: 'mailto:contact@utaab.org', label: 'Email', icon: Mail },
  ];

  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={UBPOINT_LOGO_URL} alt="" className="h-10 w-10 rounded-[10px]" />
            <span className="text-lg font-extrabold tracking-[-0.03em] text-slate-950">UBpoint</span>
          </div>
          <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-600">
            {t('projects.ubpointPage.footer.tagline')}
          </p>
          <div className="mt-6 flex gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={social.label}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-blue-200 hover:text-blue-700 ${focusRing}`}
              >
                <social.icon aria-hidden className="h-4 w-4" strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-slate-950">{t('projects.ubpointPage.footer.product')}</h2>
          <ul className="mt-4 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={`rounded text-sm font-medium text-slate-600 hover:text-blue-700 ${focusRing}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-slate-950">{t('projects.ubpointPage.footer.community')}</h2>
          <ul className="mt-4 space-y-3 text-sm font-medium">
            <li><Link to="/" className={`rounded text-slate-600 hover:text-blue-700 ${focusRing}`}>{t('projects.ubpointPage.footer.utaabHome')}</Link></li>
            <li><Link to="/projects" className={`rounded text-slate-600 hover:text-blue-700 ${focusRing}`}>{t('projects.ubpointPage.footer.allProjects')}</Link></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`rounded text-slate-600 hover:text-blue-700 ${focusRing}`}>{t('projects.ubpointPage.footer.whatsapp')}</a></li>
            <li><a href={SPONSOR_EMAIL} className={`rounded text-slate-600 hover:text-blue-700 ${focusRing}`}>{t('projects.ubpointPage.footer.becomeSponsor')}</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-slate-200 pt-6 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} UTAAB · UBpoint. {t('projects.ubpointPage.footer.rights')}</span>
        <span>{t('projects.ubpointPage.footer.builtOn')}</span>
      </div>
    </footer>
  );
};

class UBpointErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[UBpointPage] render error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#f8fafc] px-6 text-center text-slate-950">
        <img src={UBPOINT_LOGO_URL} alt="" className="mb-5 h-12 w-12 rounded-xl" />
        <h1 className="text-2xl font-extrabold">UBpoint hit a snag</h1>
        <p className="mt-3 max-w-md text-slate-600">Something went wrong while rendering this page. Your session is safe.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`min-h-11 rounded-full bg-slate-950 px-5 text-sm font-bold text-white ${focusRing}`}
          >
            Reload
          </button>
          <Link to="/" className={`inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 ${focusRing}`}>
            Back to UTAAB
          </Link>
        </div>
      </div>
    );
  }
}

const UBpointPageInner = () => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtml = html.style.background;
    const previousBody = body.style.background;
    html.style.background = '#f8fafc';
    body.style.background = '#f8fafc';
    return () => {
      html.style.background = previousHtml;
      body.style.background = previousBody;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] font-sans text-slate-950 selection:bg-blue-200 selection:text-blue-950">
      <PageNavbar />
      <main>
        <Story />
        <AvailabilitySection />
      </main>
      <PageFooter />
    </div>
  );
};

const UBpointPage = () => (
  <UBpointErrorBoundary>
    <SEO
      title="UBpoint | Community Rewards by UTAAB"
      description="Earn UBpoint through learning, events, and community contributions. Use the web app now, with iOS and Android apps coming soon."
      path="/projects/ubpoint"
      ogType="website"
      image="https://utaab.org/og-image.png"
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'UBpoint',
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web',
          url: UBPOINT_APP_URL,
          description: 'UTAAB community rewards platform for learning, contributions, events, and verifiable engagement.',
          brand: { '@type': 'Organization', name: 'UTAAB', url: 'https://utaab.org' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is UBpoint?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'UBpoint is the UTAAB community rewards platform for learning, contributions, events, and student engagement.',
              },
            },
            {
              '@type': 'Question',
              name: 'Where can I use UBpoint?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The UBpoint web app is available now. Native iOS and Android apps are coming soon.',
              },
            },
          ],
        },
      ]}
    />
    <UBpointPageInner />
  </UBpointErrorBoundary>
);

export default UBpointPage;

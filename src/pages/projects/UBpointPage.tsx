import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ---------- Splash intro context ---------- */
const SplashContext = createContext<{ ready: boolean }>({ ready: true });
const useSplash = () => useContext(SplashContext);
const splashTransition = (i: number) => ({
  delay: 0.25 + i * 0.13,
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
});

import {
  NavArrowRight,
  ArrowUpRight,
  Gift,
  ShieldCheck,
  Trophy,
  GraduationCap,
  Sparks,
  Coins,
  CheckCircle,
  X as XIcon,
  ChatBubble,
  SendDiagonal,
  Building,
  FireFlame,
  GraphUp,
  Menu as MenuIcon,
  Xmark,
  Linkedin,
  Send,
  Mail,
  Copy,
  OpenNewWindow,
} from 'iconoir-react';
import { Button } from '@/components/ui/button';
import logoAsset from '@/assets/ubpoint-logo.png.asset.json';

import mockupAsset from '@/assets/ubpoint-mockup.png.asset.json';
import utaabCoinAsset from '@/assets/coins/utaab-coin.png.asset.json';

import tonCoinAsset from '@/assets/coins/ton.png.asset.json';
import ethCoinAsset from '@/assets/coins/eth.png.asset.json';
import btcCoinAsset from '@/assets/coins/btc.png.asset.json';
import goldCoinAsset from '@/assets/coins/gold-coin.png.asset.json';
import goldBarAsset from '@/assets/coins/gold-bar.png.asset.json';
import steamAsset from '@/assets/coins/steam.png.asset.json';
import titaniumBarAsset from '@/assets/coins/titanium-bar.png.asset.json';
import silverBarAsset from '@/assets/coins/silver-bar.png.asset.json';
import gamepadAsset from '@/assets/coins/gamepad.png.asset.json';
import usdtAngleAsset from '@/assets/coins/ubp-usdt-angle.png.asset.json';
import tryAngleAsset from '@/assets/coins/ubp-try-angle.png.asset.json';

const WHATSAPP_URL = 'https://chat.whatsapp.com/HnTcuJYiKAiDpLPnG33mEr';
const SPONSOR_EMAIL = 'mailto:info@utaab.org?subject=UBpoint%20Sponsor%20Inquiry';
const UBPOINT_APP_URL = 'https://ubpoint.app/';

/* Shared icon defaults — thin editorial stroke */
const ICON_STROKE = 1.5;

/* ---------- Light Navbar (page-local) ---------- */
const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#showcase', label: 'Inside the app' },
  { href: '#sponsors', label: 'Sponsors' },
  { href: '#rewards', label: 'Rewards' },
];

const LightNavbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl bg-white/85 transition-colors ${
        scrolled ? 'border-b border-slate-200/70' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="UBpoint" className="h-8 w-auto" />
          <span className="text-base font-bold tracking-tight text-slate-900">UBpoint</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block group">
            <Button className="h-9 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold">
              Open app
              <NavArrowRight width={14} height={14} strokeWidth={ICON_STROKE} className="ml-0.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </a>
          <button
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <Xmark width={20} height={20} strokeWidth={ICON_STROKE} /> : <MenuIcon width={20} height={20} strokeWidth={ICON_STROKE} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200/70 bg-white/95 backdrop-blur-xl">
          <div className="px-5 py-3 flex flex-col">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-1 py-3 text-[14px] font-medium text-slate-700 hover:text-slate-900 border-b border-slate-100 last:border-0"
              >
                {l.label}
              </a>
            ))}
            <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer" className="mt-4">
              <Button className="w-full h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold">
                Open app
                <NavArrowRight width={14} height={14} strokeWidth={ICON_STROKE} className="ml-0.5" />
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

/* ---------- Light Footer (page-local) ---------- */
const LightFooter = () => (
  <footer className="relative bg-white border-t border-slate-200/70">
    <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="UBpoint" className="h-8 w-auto" />
          <span className="text-base font-bold tracking-tight text-slate-900">UBpoint</span>
        </div>
        <p className="mt-4 text-sm text-slate-500 max-w-md leading-relaxed">
          UTAAB's blockchain-powered student engagement platform. Earn UBP, unlock rewards,
          and verify every action on-chain.
        </p>
        <div className="mt-5 flex items-center gap-2">
          {[
            { href: 'https://www.linkedin.com/company/utaa-blockchain/', icon: Linkedin, label: 'LinkedIn' },
            { href: 'https://t.me/utaa_blockchain', icon: Send, label: 'Telegram' },
            { href: 'https://x.com/utaa_blockchain?s=11', icon: XIcon, label: 'X' },
            { href: 'mailto:info@utaab.org', icon: Mail, label: 'Email' },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors"
            >
              <s.icon width={15} height={15} strokeWidth={ICON_STROKE} />
            </a>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-4">Product</div>
        <ul className="space-y-2.5 text-sm">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-slate-600 hover:text-slate-900">{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-4">Community</div>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/" className="text-slate-600 hover:text-slate-900">UTAAB Home</Link></li>
          <li><Link to="/projects" className="text-slate-600 hover:text-slate-900">All Projects</Link></li>
          <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900">WhatsApp Community</a></li>
          <li><a href={SPONSOR_EMAIL} className="text-slate-600 hover:text-slate-900">Become a Sponsor</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} UTAAB · UBpoint. All rights reserved.</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Built on Base · utaab.org
        </div>
      </div>
    </div>
  </footer>
);

/* ---------- Decorative background ---------- */
const HeroBackground = () => (
  <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/60 to-white" />
    {/* dot grid */}
    <div
      className="absolute inset-0 opacity-[0.5]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(15,23,42,0.10) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage:
          'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0,0,0,0.9), transparent 75%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0,0,0,0.9), transparent 75%)',
      }}
    />
    {/* single soft glow behind the device */}
    <div className="absolute right-[-10%] top-1/4 w-[520px] h-[520px] rounded-full bg-blue-400/20 blur-3xl" />
  </div>
);

/* ---------- Floating iPhone device ---------- */
const FloatingDevice = () => {
  const { ready } = useSplash();
  const backCoins = [
    { src: usdtAngleAsset.url, cls: 'top-2 -left-4 md:-left-10 w-16 md:w-24', glow: 'rgba(16,185,129,0.45)', dur: 9, delay: 0 },
    { src: tryAngleAsset.url, cls: 'top-10 -right-6 md:-right-14 w-16 md:w-24', glow: 'rgba(220,38,38,0.4)', dur: 10, delay: 0.4 },
    { src: ethCoinAsset.url, cls: 'top-1/2 -left-10 md:-left-20 w-14 md:w-20', glow: 'rgba(100,116,139,0.45)', dur: 11, delay: 0.8 },
    { src: goldCoinAsset.url, cls: 'bottom-12 -right-8 md:-right-16 w-14 md:w-20', glow: 'rgba(202,138,4,0.5)', dur: 12, delay: 0.2 },
    { src: silverBarAsset.url, cls: 'bottom-2 left-6 md:left-2 w-16 md:w-20', glow: 'rgba(148,163,184,0.5)', dur: 13, delay: 1 },
    { src: steamAsset.url, cls: 'top-4 -left-8 md:-left-16 w-16 md:w-24', glow: 'rgba(37,99,235,0.45)', dur: 10, delay: 1.3 },
    { src: gamepadAsset.url, cls: 'bottom-8 -right-10 md:-right-20 w-20 md:w-28', glow: 'rgba(96,165,250,0.4)', dur: 11, delay: 0.6 },
  ];

  return (
    <div className="relative w-full max-w-[360px] md:max-w-[420px] mx-auto">
      {/* glow */}
      <div className="absolute inset-0 -m-10 bg-gradient-to-br from-blue-400/30 via-blue-500/20 to-blue-600/10 blur-3xl rounded-full" />

      {/* back-layer coin cluster behind the phone */}
      <div aria-hidden className="absolute inset-0 -m-16 md:-m-24 pointer-events-none">
        {backCoins.map((c, i) => (
          <motion.div
            key={i}
            className={`absolute ${c.cls}`}
            initial={{ opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
            animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
            transition={splashTransition(i + 2)}
          >
            <motion.img
              src={c.src}
              alt=""
              className="w-full select-none"
              style={{ filter: `drop-shadow(0 14px 26px ${c.glow})` }}
              animate={ready ? { y: [0, -10, 0], rotateZ: [-5, 5, -5] } : undefined}
              transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={ready ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={ready ? { y: [0, -14, 0], rotateZ: [-1.5, 1.5, -1.5] } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={mockupAsset.url}
            alt="UBpoint mobile app interface"
            className="w-full h-auto drop-shadow-[0_30px_60px_rgba(15,23,42,0.25)]"
            loading="eager"
          />
        </motion.div>
      </motion.div>

      {/* orbiting toast — flat editorial */}
      <motion.div
        className="absolute -left-4 md:-left-12 top-12 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-12px_rgba(15,23,42,0.18)] flex items-center gap-2.5"
        initial={{ opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        transition={splashTransition(9)}
      >
        <motion.div
          className="flex items-center gap-2.5"
          animate={ready ? { y: [0, -8, 0] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Sparks width={14} height={14} strokeWidth={ICON_STROKE} className="text-blue-600" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">Earned</div>
            <div className="text-[13px] font-semibold text-slate-900 tabular-nums">+50 UBP</div>
          </div>
        </motion.div>
      </motion.div>

      {/* orbiting verify badge */}
      <motion.div
        className="absolute -right-2 md:-right-10 bottom-24 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-12px_rgba(15,23,42,0.18)] flex items-center gap-2.5"
        initial={{ opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        transition={splashTransition(10)}
      >
        <motion.div
          className="flex items-center gap-2.5"
          animate={ready ? { y: [0, 10, 0] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <ShieldCheck width={14} height={14} strokeWidth={ICON_STROKE} className="text-blue-600" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">On-chain</div>
            <div className="text-[13px] font-semibold text-slate-900">Verified · Base</div>
          </div>
        </motion.div>
      </motion.div>

      {/* floating UTAAB coin */}
      <motion.div
        className="absolute -left-10 md:-left-20 bottom-4 w-24 md:w-32 pointer-events-none"
        initial={{ opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
        transition={splashTransition(0)}
      >
        <motion.img
          src={utaabCoinAsset.url}
          alt=""
          aria-hidden
          className="w-full drop-shadow-[0_20px_40px_rgba(37,99,235,0.35)]"
          animate={ready ? { y: [0, -12, 0], rotateZ: [-6, 6, -6] } : undefined}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      <motion.div
        className="absolute -right-6 md:-right-12 top-4 w-20 md:w-28 pointer-events-none"
        initial={{ opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
        transition={splashTransition(1)}
      >
        <motion.img
          src={tonCoinAsset.url}
          alt=""
          aria-hidden
          className="w-full drop-shadow-[0_15px_30px_rgba(37,99,235,0.45)]"
          animate={ready ? { y: [0, 10, 0], rotateZ: [4, -4, 4] } : undefined}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </motion.div>
      <motion.div
        className="absolute -right-6 md:-right-14 bottom-2 md:bottom-6 w-14 md:w-20 pointer-events-none"
        initial={{ opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.2, filter: 'blur(8px)' }}
        transition={splashTransition(11)}
      >
        <motion.img
          src={btcCoinAsset.url}
          alt=""
          aria-hidden
          className="w-full drop-shadow-[0_15px_30px_rgba(202,138,4,0.4)]"
          animate={ready ? { y: [0, -10, 0], rotateZ: [-5, 5, -5] } : undefined}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
      </motion.div>
    </div>
  );
};

/* ---------- Reusable Eyebrow ---------- */
const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 ${className}`}>
    {children}
  </div>
);

/* ---------- Hero ---------- */
const Hero = () => (
  <section className="relative pt-24 md:pt-32 pb-20 md:pb-32 overflow-hidden">
    <HeroBackground />
    <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 mb-8">
          <img src={logoAsset.url} alt="UBpoint" className="h-12 md:h-14 w-auto" />
          <div className="h-8 w-px bg-slate-200" />
          <Eyebrow>UTAAB · Engagement Platform</Eyebrow>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-slate-900 leading-[1.02]">
          Turn participation into{' '}
          <span className="text-blue-600">opportunity.</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-500 max-w-xl leading-relaxed">
          UBpoint is UTAAB's blockchain-powered student engagement platform. Attend events,
          contribute to projects, join hackathons — and earn verifiable on-chain rewards.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer" className="group">
            <Button className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full">
              Launch app
              <NavArrowRight width={15} height={15} strokeWidth={ICON_STROKE} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </a>
          <a href="#rewards" className="group">
            <Button
              variant="outline"
              className="h-11 px-5 rounded-full !bg-white !text-slate-900 border-slate-200 hover:!bg-slate-50 hover:!text-slate-900 text-sm font-semibold"
            >
              View rewards
              <ArrowUpRight width={15} height={15} strokeWidth={ICON_STROKE} className="ml-0.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            Live on Base
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck width={14} height={14} strokeWidth={ICON_STROKE} className="text-slate-400" />
            On-chain verified
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono">utaablockchain.base.eth</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
      >
        <FloatingDevice />
      </motion.div>
    </div>
  </section>
);

/* ---------- Feature index (editorial numbered list) ---------- */
const features = [
  { icon: Coins, title: 'Earn UBP', desc: 'Receive points for attending events, contributing to community projects, and participating in hackathons.' },
  { icon: Gift, title: 'Unlock rewards', desc: 'Redeem UBP for partner discounts, Steam gift cards, tokenized assets, silver, gold, and future ecosystem rewards.' },
  { icon: ShieldCheck, title: 'On-chain verification', desc: 'Every UBpoint transaction is verifiable on Base. See our official identifiers below.' },
  { icon: GraduationCap, title: 'Student identity', desc: 'Build a verifiable portfolio of participation, contributions, and achievements.' },
  { icon: Trophy, title: 'Leaderboards', desc: 'Compete with community members and climb the rankings.' },
  { icon: Sparks, title: 'Campus engagement', desc: 'Transform university activities into measurable, on-chain achievements.' },
];

const FeatureGrid = () => (
  <section id="features" className="relative py-24 md:py-32 bg-white border-t border-slate-100">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.45 }}
        className="max-w-2xl mb-16"
      >
        <Eyebrow className="mb-4">The platform</Eyebrow>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-[-0.025em] leading-[1.05]">
          Built for the next generation of students.
        </h2>
        <p className="mt-5 text-slate-500 md:text-lg leading-relaxed">
          Six pillars that turn every event, hackathon, and contribution into measurable, on-chain value.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55 }}
        className="border-t border-slate-200/70"
      >
        {features.map((f, i) => (
          <div
            key={f.title}
            className="group grid grid-cols-[44px_1fr_auto] md:grid-cols-[64px_240px_1fr_auto] items-center gap-4 md:gap-8 py-6 md:py-7 border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
          >
            <div className="font-mono text-[11px] text-slate-400 tabular-nums tracking-wider">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="text-[15px] md:text-base font-semibold text-slate-900">
              {f.title}
            </div>
            <div className="hidden md:block text-sm text-slate-500 leading-relaxed max-w-xl">
              {f.desc}
            </div>
            <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
              <f.icon width={16} height={16} strokeWidth={ICON_STROKE} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* mobile descriptions (since hidden in row above) */}
      <div className="md:hidden mt-6 space-y-4">
        {features.map((f, i) => (
          <div key={f.title} className="text-sm text-slate-500 leading-relaxed">
            <span className="font-mono text-[11px] text-slate-400 mr-2">{String(i + 1).padStart(2, '0')}</span>
            {f.desc}
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Verified On-Chain ---------- */
const BASE_NAME = 'utaablockchain.base.eth';
const BASE_WALLET = '0x4fF797906D7B56F9Bd2Db382BcB36C97d69A43A9';
const BASESCAN_URL = `https://basescan.org/address/${BASE_WALLET}`;

const VerifiedOnChain = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section id="verified" className="relative py-24 md:py-28 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl mb-12"
        >
          <Eyebrow className="mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Trust · Live on Base
          </Eyebrow>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-[-0.025em] leading-[1.05]">
            Verified on-chain.
          </h2>
          <p className="mt-5 text-slate-500 md:text-lg leading-relaxed">
            Stay safu. Always verify before you interact. UBpoint is officially registered on Base —
            these are our only verified identifiers. Do not trust any other address claiming to be UBpoint.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Base name', value: BASE_NAME, key: 'name', mono: true },
            { label: 'Official wallet', value: BASE_WALLET, display: '0x4fF7…43A9', key: 'wallet', mono: true },
          ].map((item) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-3">
                {item.label}
              </div>
              <div className={`text-sm md:text-base text-slate-900 font-medium break-all bg-slate-50 border border-slate-200/70 rounded-lg px-3 py-2.5 ${item.mono ? 'font-mono' : ''}`}>
                {item.display ?? item.value}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(item.value, item.key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:border-slate-300 hover:text-slate-900 transition-colors"
                >
                  <Copy width={13} height={13} strokeWidth={ICON_STROKE} />
                  {copied === item.key ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={BASESCAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:border-slate-300 hover:text-slate-900 transition-colors"
                >
                  <OpenNewWindow width={13} height={13} strokeWidth={ICON_STROKE} />
                  View on Basescan
                </a>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/70 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Network</div>
              <div className="text-sm font-semibold text-slate-900">Base · L2 on Ethereum</div>
            </div>
            <div className="text-xs text-slate-500 hidden sm:block">Chain ID 8453</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Inside the app — horizontal scroll showcase ---------- */
const showcase = [
  { title: 'Home dashboard', hint: 'Your UBP balance and progress at a glance', kind: 'real' as const },
  { title: 'Rewards marketplace', hint: 'Redeem points for partner perks', kind: 'rewards' as const },
  { title: 'Student wallet', hint: 'Verified, stay safe', kind: 'wallet' as const },
  { title: 'Leaderboard', hint: 'See where you rank on campus', kind: 'leaderboard' as const },
  { title: 'Events', hint: 'Discover and check in on-chain', kind: 'events' as const },
  { title: 'Profile analytics', hint: 'Your verified contribution history', kind: 'analytics' as const },
];

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative mx-auto w-[250px] h-[510px] rounded-[52px] bg-slate-950 p-[2px] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/10">
    <div className="relative w-full h-full rounded-[50px] bg-black p-[2px] overflow-hidden">
      <div className="relative w-full h-full rounded-[48px] bg-white overflow-hidden">
        {children}
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[78px] h-[22px] rounded-full bg-black z-20" />
        {/* subtle top reflection */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/30 to-transparent z-10" />
      </div>
    </div>
    {/* side buttons */}
    <span className="absolute left-[-2px] top-[110px] h-7 w-[2px] rounded-l-sm bg-slate-800" />
    <span className="absolute left-[-2px] top-[160px] h-12 w-[2px] rounded-l-sm bg-slate-800" />
    <span className="absolute left-[-2px] top-[220px] h-12 w-[2px] rounded-l-sm bg-slate-800" />
    <span className="absolute right-[-2px] top-[170px] h-16 w-[2px] rounded-r-sm bg-slate-800" />
  </div>
);


const MockScreen: React.FC<{ kind: typeof showcase[number]['kind'] }> = ({ kind }) => {
  const Header = (
    <div className="px-4 pt-10 pb-3 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-1.5">
        <img src={logoAsset.url} alt="UBpoint" className="h-4 w-auto object-contain" />
        <span className="text-[11px] font-bold text-slate-900">UBpoint</span>
      </div>
      <div className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-semibold text-slate-700 tabular-nums">200 UBP</div>
    </div>
  );

  if (kind === 'real') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {Header}
        <div className="p-3 space-y-2.5 overflow-hidden">
          <div>
            <div className="text-[9px] uppercase font-semibold tracking-wider text-slate-400">Good morning</div>
            <div className="text-[12px] font-bold text-slate-900">Alex Karimov</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 text-white">
            <div className="text-[9px] opacity-60 uppercase tracking-wider">Total UBP</div>
            <div className="text-2xl font-bold mt-0.5 leading-tight tabular-nums">200.00</div>
            <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold">
              <GraphUp width={10} height={10} strokeWidth={ICON_STROKE} /> +50 this week
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { icon: Coins, label: 'Earn' },
              { icon: Gift, label: 'Redeem' },
              { icon: Send, label: 'Send' },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                <a.icon width={14} height={14} strokeWidth={ICON_STROKE} className="text-slate-700" />
                <div className="text-[9px] font-semibold text-slate-700">{a.label}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[9px] uppercase font-semibold tracking-wider text-slate-400 mb-1">Recent</div>
            <div className="space-y-1">
              {[
                { l: 'Hackathon', a: '+50', pos: true },
                { l: 'Workshop', a: '+25', pos: true },
                { l: 'Reward', a: '-100', pos: false },
              ].map((t) => (
                <div key={t.l} className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${t.pos ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                      <Sparks width={10} height={10} strokeWidth={ICON_STROKE} className={t.pos ? 'text-emerald-600' : 'text-slate-500'} />
                    </div>
                    <div className="text-[10px] font-medium text-slate-800">{t.l}</div>
                  </div>
                  <div className={`text-[10px] font-semibold tabular-nums ${t.pos ? 'text-emerald-600' : 'text-slate-900'}`}>{t.a} UBP</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <FireFlame width={14} height={14} strokeWidth={ICON_STROKE} className="text-orange-500" />
            <div className="text-[10px] font-semibold text-slate-800">5 day streak</div>
            <div className="ml-auto text-[9px] text-slate-400 font-medium">Keep going</div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'rewards') {
    const rewardItems = [
      { label: 'Steam gift card', price: '500 UBP', img: steamAsset.url },
      { label: 'Silver token', price: '1,200 UBP', img: titaniumBarAsset.url },
      { label: 'Partner discount', price: '250 UBP', img: goldCoinAsset.url },
      { label: 'Gold token', price: '5,000 UBP', img: goldBarAsset.url },
    ];
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {Header}
        <div className="p-3 space-y-2 overflow-hidden">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Rewards</div>
          {rewardItems.map((r) => (
            <div key={r.label} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
              <div className="flex items-center gap-2">
                <img src={r.img} alt="" className="w-7 h-7 object-contain" />
                <div className="text-[10px] font-medium text-slate-900">{r.label}</div>
              </div>
              <div className="text-[9px] font-semibold text-slate-700 tabular-nums">{r.price}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === 'wallet') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {Header}
        <div className="p-4 overflow-hidden">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Wallet</div>
          <div className="mt-2 p-4 rounded-2xl bg-slate-950 text-white">
            <div className="text-[10px] opacity-60 uppercase tracking-wider">UBP token</div>
            <div className="text-3xl font-bold mt-1 tabular-nums">200.00</div>
            <div className="text-[9px] mt-3 opacity-60 font-mono">utaablockchain.base.eth</div>
          </div>
          <div className="mt-3 space-y-1.5">
            {[['+50 UBP', 'Hackathon'], ['+25 UBP', 'Workshop'], ['-100 UBP', 'Reward redeem']].map(([a, l]) => (
              <div key={l} className="flex justify-between text-[10px] py-1 border-b border-slate-100">
                <span className="text-slate-500">{l}</span>
                <span className={`tabular-nums ${a.startsWith('+') ? 'text-emerald-600 font-semibold' : 'text-slate-900 font-semibold'}`}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'leaderboard') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {Header}
        <div className="p-3 overflow-hidden">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-2">Leaderboard</div>
          {[['1', 'cryptostudent.eth', '1,820'], ['2', 'utaab.devon', '1,540'], ['3', 'you', '1,210'], ['4', 'web3.zara', '980'], ['5', 'base.kai', '740']].map(([r, n, p]) => (
            <div key={r} className={`flex items-center gap-2 p-2 rounded-lg mb-1.5 ${n === 'you' ? 'bg-blue-50/70 border border-blue-100' : 'bg-white border border-slate-100'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${r === '1' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{r}</div>
              <div className="flex-1 text-[10px] font-medium text-slate-900 truncate">{n}</div>
              <div className="text-[10px] font-semibold text-slate-700 tabular-nums">{p}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === 'events') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {Header}
        <div className="p-3 space-y-2 overflow-hidden">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Upcoming</div>
          {[
            { d: 'NOV 12', t: 'Base builders meetup', r: '+30 UBP' },
            { d: 'NOV 18', t: 'Solidity workshop', r: '+25 UBP' },
            { d: 'NOV 24', t: 'UTAAB hackathon', r: '+100 UBP' },
            { d: 'DEC 02', t: 'Campus mixer', r: '+15 UBP' },
          ].map((e) => (
            <div key={e.t} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <div className="text-[7px] font-semibold text-slate-400 tracking-wider">{e.d.split(' ')[0]}</div>
                <div className="text-[10px] font-bold text-slate-900">{e.d.split(' ')[1]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-slate-900 truncate">{e.t}</div>
                <div className="text-[8px] text-slate-400">Check in on-chain</div>
              </div>
              <div className="text-[9px] font-semibold text-blue-600 tabular-nums">{e.r}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // analytics
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {Header}
      <div className="p-3 space-y-2 overflow-hidden">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">This semester</div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[9px] text-slate-400 uppercase tracking-wider">Total earned</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">1,210 UBP</div>
          {/* sparkline */}
          <svg viewBox="0 0 100 30" className="mt-2 w-full h-8 text-blue-500">
            <polyline points="0,24 12,20 25,22 38,14 50,16 62,10 75,12 88,6 100,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ['Events', '12'],
            ['Hackathons', '3'],
            ['Workshops', '7'],
            ['Tasks', '24'],
          ].map(([l, v]) => (
            <div key={l} className="p-2 rounded-lg bg-white border border-slate-100">
              <div className="text-[8px] uppercase font-semibold tracking-wider text-slate-400">{l}</div>
              <div className="text-base font-bold text-slate-900 tabular-nums leading-tight">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-blue-50/60 border border-blue-100">
          <ShieldCheck width={12} height={12} strokeWidth={ICON_STROKE} className="text-blue-600" />
          <div className="text-[9px] font-medium text-slate-800">All actions verified on Base</div>
        </div>
      </div>
    </div>
  );
};


const Showcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-30%']);

  return (
    <section id="showcase" className="relative py-24 md:py-32 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <Eyebrow className="mb-4">Inside the app</Eyebrow>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-[-0.025em] leading-[1.05] max-w-2xl">
          A pocket-sized student economy.
        </h2>
      </div>
      <div ref={ref} className="overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 md:gap-16 px-6 pt-6 pb-10">
          {showcase.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="shrink-0 w-[260px] md:w-[300px] group"
            >
              <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
                {/* floor shadow — neutral */}
                <div aria-hidden className="absolute left-1/2 -translate-x-1/2 bottom-[-24px] w-[70%] h-10 rounded-full bg-slate-900/[0.08] blur-2xl" />
                <PhoneFrame>
                  <MockScreen kind={s.kind} />
                </PhoneFrame>
              </div>
              <div className="mt-8 text-left pl-2">
                <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                <div className="mt-1 h-px w-6 bg-slate-300" />
                <div className="text-xs text-slate-500 mt-2">{s.hint}</div>
              </div>
            </motion.div>
          ))}
          <div className="shrink-0 w-12" />
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- For Brands / Sponsors ---------- */
const sponsorTasks = [
  { icon: XIcon, label: 'Follow on X', reward: 10 },
  { icon: ChatBubble, label: 'Join Discord', reward: 25 },
  { icon: SendDiagonal, label: 'Try the app', reward: 50 },
];


const Sponsors = () => (
  <section id="sponsors" className="relative py-24 md:py-32 bg-slate-50/60 border-t border-slate-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Eyebrow className="mb-4 flex items-center gap-2">
          <Building width={12} height={12} strokeWidth={ICON_STROKE} />
          For brands & sponsors
        </Eyebrow>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-[-0.025em] leading-[1.05]">
          Real students. Real engagement.{' '}
          <span className="text-blue-600">On-chain proof.</span>
        </h2>
        <p className="mt-5 text-slate-500 md:text-lg leading-relaxed">
          Companies fund task bounties on UBpoint to acquire and activate verified student users.
          Each completion is recorded on Base — so every follow, signup, install, and event
          attendance is provable, attributable, and free of bots.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            'Verified university audience — no fake clicks',
            'Pay only for completed, on-chain proven actions',
            'Real retention, not vanity downloads',
            'Sponsor dashboard with live conversion data',
          ].map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CheckCircle width={18} height={18} strokeWidth={ICON_STROKE} className="text-blue-600 shrink-0 mt-0.5" />
              {p}
            </li>
          ))}
        </ul>
        <a href={SPONSOR_EMAIL} className="inline-block mt-8 group">
          <Button className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-semibold">
            Become a sponsor
            <NavArrowRight width={15} height={15} strokeWidth={ICON_STROKE} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <Eyebrow className="mb-2 px-1">Live sponsored tasks</Eyebrow>
        {sponsorTasks.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <t.icon width={18} height={18} strokeWidth={ICON_STROKE} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                  <ShieldCheck width={10} height={10} strokeWidth={ICON_STROKE} /> Verified
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Sponsored · Partner brand</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900 tabular-nums">+{t.reward}</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">UBP</div>
            </div>
          </motion.div>
        ))}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-900">How it works · </span>
          Sponsors define a task and a UBP bounty. Students complete the action; UBpoint validates
          and records each completion on Base. Brands receive verified user acquisition data without
          paying for bots.
        </div>
      </motion.div>
    </div>
  </section>
);

/* ---------- Metrics ---------- */
const CountUp: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const Metrics = () => (
  <section id="rewards" className="relative py-24 md:py-32 bg-white border-t border-slate-100 overflow-hidden">
    {/* 3 quiet static accents */}
    <img
      src={utaabCoinAsset.url}
      alt=""
      aria-hidden
      className="hidden md:block absolute -left-10 top-12 w-28 opacity-[0.35] pointer-events-none select-none"
    />
    <img
      src={goldBarAsset.url}
      alt=""
      aria-hidden
      className="hidden md:block absolute -right-6 bottom-12 w-24 opacity-[0.30] pointer-events-none select-none"
    />
    <img
      src={ethCoinAsset.url}
      alt=""
      aria-hidden
      className="hidden md:block absolute right-1/4 top-8 w-16 opacity-[0.25] pointer-events-none select-none"
    />
    <div className="max-w-6xl mx-auto px-6 relative">
      <div className="max-w-2xl mb-14">
        <Eyebrow className="mb-4">By the numbers</Eyebrow>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-[-0.025em] leading-[1.05]">
          A growing on-chain economy.
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { value: <><CountUp to={200} />+</>, label: 'UBP distributed' },
          { value: <><CountUp to={1} />+</>, label: 'Campus events' },
          { value: <><CountUp to={100} suffix="%" /></>, label: 'On-chain recorded' },
          { value: '∞', label: 'Future ecosystem' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            <div className="text-4xl md:text-5xl font-bold text-slate-900 tabular-nums tracking-[-0.02em]">
              {m.value}
            </div>
            <div className="mt-3 text-xs md:text-sm text-slate-500 font-medium">{m.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Final CTA ---------- */
const FinalCTA = () => (
  <section className="relative py-24 md:py-32 overflow-hidden bg-slate-950">
    {/* thin top accent stripe */}
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 70%)',
        }}
      />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/15 blur-3xl" />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative max-w-3xl mx-auto px-6 text-center"
    >
      <Eyebrow className="mb-6 text-slate-400 inline-flex items-center justify-center gap-2 w-full">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        Future student economy
      </Eyebrow>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.025em] text-white leading-[1.05]">
        Participation, made verifiable.
      </h2>
      <p className="mt-6 text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
        UBpoint bridges student engagement and blockchain technology by transforming participation
        into verifiable digital value.
      </p>
      <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-10 group">
        <Button className="h-12 px-7 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-sm font-semibold">
          Launch UBpoint
          <NavArrowRight width={16} height={16} strokeWidth={ICON_STROKE} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Button>
      </a>
      <div className="mt-6 text-xs text-slate-500">
        <Link to="/projects" className="underline-offset-4 hover:underline hover:text-slate-300">Back to all projects</Link>
      </div>
    </motion.div>
  </section>
);

/* ---------- Page ---------- */
const UBpointPage = () => {
  const alreadySplashed =
    typeof window !== 'undefined' && sessionStorage.getItem('ubpoint-splashed') === '1';
  const [ready, setReady] = useState(alreadySplashed);

  useEffect(() => {
    const prev = document.title;
    document.title = 'UBpoint — Blockchain Student Engagement | UTAAB';
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';
    meta?.setAttribute(
      'content',
      "UBpoint is UTAAB's blockchain-powered student engagement platform. Earn UBP, unlock rewards, and verify everything on-chain.",
    );
    return () => {
      document.title = prev;
      meta?.setAttribute('content', prevDesc);
    };
  }, []);

  useEffect(() => {
    if (ready) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'auto' });
    const t = window.setTimeout(() => {
      setReady(true);
      sessionStorage.setItem('ubpoint-splashed', '1');
    }, 2400);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [ready]);

  return (
    <SplashContext.Provider value={{ ready }}>
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <LightNavbar />
        <main>
          <Hero />
          <FeatureGrid />
          <VerifiedOnChain />
          <Showcase />
          <Sponsors />
          <Metrics />
          <FinalCTA />
        </main>
        <LightFooter />

        <AnimatePresence>
          {!ready && (
            <motion.div
              key="ubpoint-splash-overlay"
              className="fixed inset-0 z-[60] cursor-wait"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onWheelCapture={(e) => e.preventDefault()}
              onTouchMoveCapture={(e) => e.preventDefault()}
              style={{ touchAction: 'none' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/60 via-slate-50/30 to-white/0 backdrop-blur-[2px]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200 shadow-sm backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Initializing UBpoint
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SplashContext.Provider>
  );
};

export default UBpointPage;

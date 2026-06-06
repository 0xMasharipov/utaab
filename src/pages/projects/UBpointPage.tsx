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
  ArrowRight,
  Gift,
  ShieldCheck,
  Trophy,
  GraduationCap,
  Sparkles,
  Coins,
  CheckCircle2,
  Twitter,
  MessageCircle,
  Rocket,
  Building2,
  ArrowUpRight,
  Flame,
  TrendingUp,
  Menu,
  X,
  Linkedin,
  Send,
  Mail,
  Copy,
  ExternalLink,
} from 'lucide-react';
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

/* ---------- Light Navbar (page-local) ---------- */
const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#showcase', label: 'Inside the app' },
  { href: '#sponsors', label: 'Sponsors' },
  { href: '#rewards', label: 'Rewards' },
];

const LightNavbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="UBpoint" className="h-9 w-auto" />
          <span className="text-base font-extrabold tracking-tight text-slate-900">UBpoint</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block">
            <Button className="h-9 px-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-semibold shadow-[0_8px_24px_-10px_rgba(37,99,235,0.6)]">
              Open App
            </Button>
          </a>
          <button
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-blue-50"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-xl">
          <div className="px-5 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {l.label}
              </a>
            ))}
            <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer" className="mt-2">
              <Button className="w-full h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold">
                Open App
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
  <footer className="relative bg-blue-50/60 border-t border-blue-100">
    <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="UBpoint" className="h-9 w-auto" />
          <span className="text-lg font-extrabold tracking-tight text-slate-900">UBpoint</span>
        </div>
        <p className="mt-4 text-sm text-slate-600 max-w-md leading-relaxed">
          UTAAB's blockchain-powered student engagement platform. Earn UBP, unlock rewards,
          and verify every action on-chain.
        </p>
        <div className="mt-5 flex items-center gap-2">
          {[
            { href: 'https://www.linkedin.com/company/utaa-blockchain/', icon: Linkedin },
            { href: 'https://t.me/utaa_blockchain', icon: Send },
            { href: 'https://x.com/utaa_blockchain?s=11', icon: Twitter },
            { href: 'mailto:info@utaab.org', icon: Mail },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Product</div>
        <ul className="space-y-2 text-sm">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-slate-700 hover:text-blue-600">{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Community</div>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="text-slate-700 hover:text-blue-600">UTAAB Home</Link></li>
          <li><Link to="/projects" className="text-slate-700 hover:text-blue-600">All Projects</Link></li>
          <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-blue-600">WhatsApp Community</a></li>
          <li><a href={SPONSOR_EMAIL} className="text-slate-700 hover:text-blue-600">Become a Sponsor</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} UTAAB · UBpoint. All rights reserved.</div>
        <div>Built on Base · utaab.org</div>
      </div>
    </div>
  </footer>
);

/* ---------- Decorative background ---------- */
const HeroBackground = () => (
  <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/60 to-white" />
    {/* grid */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          'linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage:
          'radial-gradient(ellipse at center, rgba(0,0,0,0.9), transparent 75%)',
      }}
    />
    {/* orbs */}
    <motion.div
      className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-blue-400/30 blur-3xl"
      animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-blue-500/20 blur-3xl"
      animate={{ y: [0, -40, 0], x: [0, -25, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full bg-blue-300/30 blur-3xl"
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* particles */}
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-blue-500/40"
        style={{
          left: `${(i * 53) % 100}%`,
          top: `${(i * 37) % 100}%`,
        }}
        animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
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
      <div className="absolute inset-0 -m-10 bg-gradient-to-br from-blue-400/40 via-blue-500/30 to-blue-600/20 blur-3xl rounded-full" />

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
            className="w-full h-auto drop-shadow-[0_30px_60px_rgba(37,99,235,0.35)]"
            loading="eager"
          />
        </motion.div>
      </motion.div>

      {/* orbiting toast */}
      <motion.div
        className="absolute -left-4 md:-left-12 top-12 backdrop-blur-xl bg-white/80 border border-blue-100 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        transition={splashTransition(9)}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={ready ? { y: [0, -8, 0] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Earned</div>
            <div className="text-sm font-bold text-slate-900">+50 UBP</div>
          </div>
        </motion.div>
      </motion.div>

      {/* orbiting verify badge */}
      <motion.div
        className="absolute -right-2 md:-right-10 bottom-24 backdrop-blur-xl bg-white/80 border border-blue-100 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
        transition={splashTransition(10)}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={ready ? { y: [0, 10, 0] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">On-chain</div>
            <div className="text-sm font-bold text-slate-900">Verified · Base</div>
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

/* ---------- Hero ---------- */
const Hero = () => (
  <section className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden">
    <HeroBackground />
    <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <img
          src={logoAsset.url}
          alt="UBpoint"
          className="h-16 md:h-20 w-auto mb-6 drop-shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
        />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          UTAAB · Blockchain Engagement Platform
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
          Turn Participation Into{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Opportunity
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
          UBpoint is UTAAB's blockchain-powered student engagement platform. Attend events,
          contribute to projects, join hackathons, and earn verifiable on-chain rewards.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer">
            <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] rounded-full">
              Launch App
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </a>
          <a href="#rewards">
            <Button
              variant="outline"
              className="h-12 px-6 rounded-full !bg-white !text-slate-900 border-blue-200 hover:!bg-blue-50 hover:!text-slate-900 shadow-[0_8px_24px_-12px_rgba(37,99,235,0.4)]"
            >
              View Rewards
            </Button>
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live on Base
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            On-chain verified
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

/* ---------- Feature grid ---------- */
const features = [
  { icon: Coins, title: 'Earn UBP', desc: 'Receive points for attending events, contributing to community projects, and participating in hackathons.' },
  { icon: Gift, title: 'Unlock Rewards', desc: 'Redeem UBP for partner discounts, Steam gift cards, tokenized assets, silver, gold, and future ecosystem rewards.' },
  { icon: ShieldCheck, title: 'On-Chain Verification', desc: 'Every UBpoint transaction is verifiable on Base. See our official identifiers below.' },
  { icon: GraduationCap, title: 'Student Identity', desc: 'Build a verifiable portfolio of participation, contributions, and achievements.' },
  { icon: Trophy, title: 'Leaderboards', desc: 'Compete with community members and climb the rankings.' },
  { icon: Sparkles, title: 'Campus Engagement', desc: 'Transform university activities into measurable achievements.' },
];

const FeatureGrid = () => (
  <section id="features" className="relative py-24 md:py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
          The platform
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Built for the next generation of students
        </h2>
        <p className="mt-4 text-slate-600 md:text-lg">
          Six pillars that turn every event, hackathon, and contribution into measurable, on-chain value.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-blue-100 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.25)] hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.45)] hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <f.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
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
    <section id="verified" className="relative py-24 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live on Base
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            Verified On-Chain
          </h2>
          <p className="mt-4 text-slate-600 md:text-lg leading-relaxed">
            Stay safu. Always verify before you interact. UBpoint is officially registered on Base —
            these are our only verified identifiers. Do not trust any other address claiming to be UBpoint.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { label: 'Base Name', value: BASE_NAME, key: 'name', mono: false },
            { label: 'Official Wallet', value: BASE_WALLET, display: '0x4fF7…43A9', key: 'wallet', mono: true },
          ].map((item) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-white border border-blue-100 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.25)]"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">
                {item.label}
              </div>
              <div className={`text-base md:text-lg text-slate-900 font-bold break-all ${item.mono ? 'font-mono' : ''}`}>
                {item.display ?? item.value}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(item.value, item.key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied === item.key ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={BASESCAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-100 text-slate-600 text-xs font-semibold hover:text-blue-700 hover:border-blue-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on Basescan
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



/* ---------- Inside the app — horizontal scroll showcase ---------- */
const showcase = [
  { title: 'Home Dashboard', hint: 'Your UBP balance and progress at a glance', kind: 'real' as const },
  { title: 'Rewards Marketplace', hint: 'Redeem points for partner perks', kind: 'rewards' as const },
  { title: 'Student Wallet', hint: 'Verified, stay safe', kind: 'wallet' as const },
  { title: 'Leaderboard', hint: 'See where you rank on campus', kind: 'leaderboard' as const },
  { title: 'Events', hint: 'Discover and check in on-chain', kind: 'events' as const },
  { title: 'Profile Analytics', hint: 'Your verified contribution history', kind: 'analytics' as const },
];

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative mx-auto w-[250px] h-[510px] rounded-[52px] bg-gradient-to-b from-slate-700 via-slate-900 to-black p-[3px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.55)] ring-1 ring-white/10">
    {/* metallic inner bezel */}
    <div className="relative w-full h-full rounded-[49px] bg-black p-[2px] overflow-hidden">
      {/* screen */}
      <div className="relative w-full h-full rounded-[47px] bg-white overflow-hidden">
        {children}
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[78px] h-[22px] rounded-full bg-black z-20 shadow-[inset_0_0_2px_rgba(255,255,255,0.15)]" />
        {/* top reflection */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/40 to-transparent z-10" />
      </div>
    </div>
    {/* side buttons */}
    <span className="absolute left-[-2px] top-[110px] h-7 w-[3px] rounded-l-sm bg-slate-700" />
    <span className="absolute left-[-2px] top-[160px] h-12 w-[3px] rounded-l-sm bg-slate-700" />
    <span className="absolute left-[-2px] top-[220px] h-12 w-[3px] rounded-l-sm bg-slate-700" />
    <span className="absolute right-[-2px] top-[170px] h-16 w-[3px] rounded-r-sm bg-slate-700" />
  </div>
);


const MockScreen: React.FC<{ kind: typeof showcase[number]['kind'] }> = ({ kind }) => {
  const Header = (
    <div className="px-4 pt-10 pb-3 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-1.5">
        <img src={logoAsset.url} alt="UBpoint" className="h-4 w-auto object-contain" />
        <span className="text-[11px] font-bold text-slate-900">UBpoint.</span>
      </div>
      <div className="px-2 py-0.5 rounded-full bg-blue-50 text-[9px] font-bold text-blue-700">200 UBP</div>
    </div>
  );


  if (kind === 'real') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {Header}
        <div className="p-3 space-y-2.5 overflow-hidden">
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-500">Good morning</div>
            <div className="text-[12px] font-extrabold text-slate-900">Alex Karimov</div>
          </div>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white">
            <div className="text-[9px] opacity-80">Total UBP</div>
            <div className="text-2xl font-extrabold mt-0.5 leading-tight">200.00</div>
            <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">
              <TrendingUp className="w-2.5 h-2.5" /> +50 this week
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { icon: Coins, label: 'Earn' },
              { icon: Gift, label: 'Redeem' },
              { icon: Send, label: 'Send' },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-blue-50/60 border border-blue-100">
                <a.icon className="w-3.5 h-3.5 text-blue-600" />
                <div className="text-[9px] font-bold text-slate-700">{a.label}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-500 mb-1">Recent</div>
            <div className="space-y-1">
              {[
                { l: 'Hackathon', a: '+50', pos: true },
                { l: 'Workshop', a: '+25', pos: true },
                { l: 'Reward', a: '-100', pos: false },
              ].map((t) => (
                <div key={t.l} className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${t.pos ? 'bg-green-50' : 'bg-slate-100'}`}>
                      <Sparkles className={`w-2.5 h-2.5 ${t.pos ? 'text-green-600' : 'text-slate-500'}`} />
                    </div>
                    <div className="text-[10px] font-semibold text-slate-800">{t.l}</div>
                  </div>
                  <div className={`text-[10px] font-bold ${t.pos ? 'text-green-600' : 'text-slate-900'}`}>{t.a} UBP</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-[10px] font-bold text-slate-800">5 day streak</div>
            <div className="ml-auto text-[9px] text-slate-500 font-semibold">Keep going</div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'rewards') {
    const rewardItems = [
      { label: 'Steam Gift Card', price: '500 UBP', img: steamAsset.url },
      { label: 'Silver Token', price: '1,200 UBP', img: titaniumBarAsset.url },
      { label: 'Partner Discount', price: '250 UBP', img: goldCoinAsset.url },
      { label: 'Gold Token', price: '5,000 UBP', img: goldBarAsset.url },
    ];
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {Header}
        <div className="p-3 space-y-2 overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-slate-500">Rewards</div>
          {rewardItems.map((r) => (
            <div key={r.label} className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2">
                <img src={r.img} alt="" className="w-7 h-7 object-contain drop-shadow" />
                <div className="text-[10px] font-semibold text-slate-900">{r.label}</div>
              </div>
              <div className="text-[9px] font-bold text-blue-700">{r.price}</div>
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
          <div className="text-[10px] uppercase font-bold text-slate-500">Wallet</div>
          <div className="mt-2 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white">
            <div className="text-[10px] opacity-80">UBP Token</div>
            <div className="text-3xl font-extrabold mt-1">200.00</div>
            <div className="text-[9px] mt-3 opacity-80">utaablockchain.base.eth · Base</div>
          </div>
          <div className="mt-3 space-y-1.5">
            {[['+50 UBP', 'Hackathon'], ['+25 UBP', 'Workshop'], ['-100 UBP', 'Reward redeem']].map(([a, l]) => (
              <div key={l} className="flex justify-between text-[10px] py-1 border-b border-slate-100">
                <span className="text-slate-600">{l}</span>
                <span className={a.startsWith('+') ? 'text-green-600 font-bold' : 'text-slate-900 font-bold'}>{a}</span>
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
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Leaderboard</div>
          {[['1', 'cryptostudent.eth', '1,820'], ['2', 'utaab.devon', '1,540'], ['3', 'you', '1,210'], ['4', 'web3.zara', '980'], ['5', 'base.kai', '740']].map(([r, n, p]) => (
            <div key={r} className={`flex items-center gap-2 p-2 rounded-lg mb-1.5 ${n === 'you' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${r === '1' ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-700'}`}>{r}</div>
              <div className="flex-1 text-[10px] font-semibold text-slate-900">{n}</div>
              <div className="text-[10px] font-bold text-blue-700">{p}</div>
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
          <div className="text-[10px] uppercase font-bold text-slate-500">Upcoming</div>
          {[['Web3 Hackathon', 'Nov 12 · +100 UBP'], ['Solidity Workshop', 'Nov 18 · +30 UBP'], ['Base Meetup', 'Nov 25 · +25 UBP']].map(([t, d]) => (
            <div key={t} className="p-2.5 rounded-xl bg-white border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-900">{t}</div>
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                  <ArrowUpRight className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              <div className="text-[9px] text-slate-500 mt-1">{d}</div>
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
      <div className="p-3 overflow-hidden">
        <div className="text-[10px] uppercase font-bold text-slate-500">Your activity</div>
        <div className="mt-3 flex items-end gap-1.5 h-24">
          {[40, 60, 35, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-blue-200 to-blue-600" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[['Events', '12'], ['Hackathons', '3'], ['Projects', '5'], ['Rank', '#3']].map(([l, v]) => (
            <div key={l} className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="text-[9px] uppercase font-bold text-slate-500">{l}</div>
              <div className="text-base font-extrabold text-slate-900">{v}</div>
            </div>
          ))}
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
    <section id="showcase" className="relative py-24 md:py-32 bg-gradient-to-b from-white via-blue-50/40 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
          Inside the app
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          A pocket-sized student economy
        </h2>
      </div>
      <div ref={ref} className="overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 md:gap-16 px-6 pt-6 pb-10">
          {showcase.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="shrink-0 w-[260px] md:w-[300px] group"
            >
              <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
                {/* floor glow */}
                <div aria-hidden className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] w-[80%] h-12 rounded-full bg-blue-500/30 blur-2xl" />
                <PhoneFrame>
                  <MockScreen kind={s.kind} />
                </PhoneFrame>
              </div>
              <div className="mt-8 text-center">
                <div className="text-base font-bold text-slate-900">{s.title}</div>
                <div className="text-xs text-slate-500 mt-1">{s.hint}</div>
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
  { icon: Twitter, label: 'Follow on X', reward: 10 },
  { icon: MessageCircle, label: 'Join Discord', reward: 25 },
  { icon: Rocket, label: 'Try the app', reward: 50 },
];


const Sponsors = () => (
  <section id="sponsors" className="relative py-24 md:py-32 bg-white overflow-hidden">
    <motion.img
      src={goldCoinAsset.url}
      alt=""
      aria-hidden
      className="hidden md:block absolute -left-10 bottom-10 w-32 opacity-70 drop-shadow-[0_20px_40px_rgba(202,138,4,0.35)] pointer-events-none"
      animate={{ y: [0, -14, 0], rotateZ: [-6, 6, -6] }}
      transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-5">
          <Building2 className="w-3.5 h-3.5" />
          For Brands & Sponsors
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Real students. Real engagement.{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            On-chain proof.
          </span>
        </h2>
        <p className="mt-5 text-slate-600 md:text-lg leading-relaxed">
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
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              {p}
            </li>
          ))}
        </ul>
        <a href={SPONSOR_EMAIL} className="inline-block mt-8">
          <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]">
            Become a Sponsor
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-3"
      >
        <div className="text-xs uppercase tracking-wider font-bold text-slate-500 px-2">
          Live sponsored tasks
        </div>
        {sponsorTasks.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-blue-100 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.25)] hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.4)] transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
              <t.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-slate-900">{t.label}</div>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-blue-700">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Sponsored · Partner Brand</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-extrabold text-blue-600">+{t.reward}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">UBP</div>
            </div>
          </motion.div>
        ))}
        <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600">
          <span className="font-bold text-slate-900">How it works:</span> Sponsors define a task and
          a UBP bounty. Students complete the action; UBpoint validates and records each completion
          on Base. Brands receive verified user acquisition data without paying for bots.
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
  <section id="rewards" className="relative py-24 md:py-32 bg-gradient-to-b from-white to-blue-50/50 overflow-hidden">
    {[
      { src: utaabCoinAsset.url, cls: 'hidden md:block -left-12 top-1/2 -translate-y-1/2 w-44', glow: 'rgba(37,99,235,0.4)', dur: 9, delay: 0 },
      { src: goldBarAsset.url, cls: 'hidden md:block -right-10 top-12 w-36', glow: 'rgba(202,138,4,0.45)', dur: 11, delay: 0.3 },
      { src: titaniumBarAsset.url, cls: 'hidden md:block right-20 top-2 w-24', glow: 'rgba(148,163,184,0.45)', dur: 10, delay: 1.1 },
      { src: silverBarAsset.url, cls: 'hidden md:block left-24 bottom-4 w-24', glow: 'rgba(148,163,184,0.45)', dur: 12, delay: 0.6 },
      { src: ethCoinAsset.url, cls: 'hidden md:block right-12 bottom-10 w-24', glow: 'rgba(100,116,139,0.4)', dur: 10, delay: 0.7 },
      { src: btcCoinAsset.url, cls: 'absolute left-2 md:left-1/3 -top-2 md:top-4 w-14 md:w-20', glow: 'rgba(202,138,4,0.45)', dur: 9, delay: 0.4 },
      { src: tonCoinAsset.url, cls: 'absolute right-2 md:right-1/3 -top-2 md:top-6 w-14 md:w-20', glow: 'rgba(37,99,235,0.5)', dur: 11, delay: 0.9 },
      { src: usdtAngleAsset.url, cls: 'hidden md:block left-1/4 bottom-2 w-24', glow: 'rgba(16,185,129,0.45)', dur: 10, delay: 1.4 },
      { src: tryAngleAsset.url, cls: 'hidden md:block right-1/4 top-1/3 w-24', glow: 'rgba(220,38,38,0.4)', dur: 12, delay: 0.2 },
      { src: goldCoinAsset.url, cls: 'absolute right-4 md:left-10 bottom-2 md:bottom-16 w-12 md:w-20', glow: 'rgba(202,138,4,0.5)', dur: 10, delay: 0.5 },
      { src: steamAsset.url, cls: 'hidden md:block right-8 top-8 w-24', glow: 'rgba(37,99,235,0.45)', dur: 11, delay: 1.6 },
      { src: gamepadAsset.url, cls: 'absolute left-2 md:left-1/4 bottom-2 md:bottom-10 w-20 md:w-32', glow: 'rgba(96,165,250,0.4)', dur: 9, delay: 0.8 },

    ].map((c, i) => (
      <motion.img
        key={i}
        src={c.src}
        alt=""
        aria-hidden
        className={`absolute ${c.cls} pointer-events-none select-none`}
        style={{ filter: `drop-shadow(0 18px 32px ${c.glow})` }}
        animate={{ y: [0, i % 2 === 0 ? -16 : 16, 0], rotateZ: [0, i % 2 === 0 ? 8 : -8, 0] }}
        transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
      />
    ))}
    <div className="max-w-6xl mx-auto px-6 relative">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          A growing on-chain economy
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { value: <><CountUp to={200} />+</>, label: 'UBP Distributed' },
          { value: <><CountUp to={1} />+</>, label: 'Campus Events' },
          { value: <><CountUp to={100} suffix="%" /></>, label: 'On-Chain Recorded' },
          { value: '∞', label: 'Future Ecosystem' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-blue-100 text-center shadow-[0_10px_30px_-15px_rgba(37,99,235,0.25)]"
          >
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {m.value}
            </div>
            <div className="mt-2 text-xs md:text-sm text-slate-600 font-semibold">{m.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Final CTA ---------- */
const FinalCTA = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500" />
    <div aria-hidden className="absolute inset-0">
      <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative max-w-3xl mx-auto px-6 text-center text-white"
    >
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
        The Future Student Economy Starts Here
      </h2>
      <p className="mt-6 text-base md:text-lg text-blue-50/90 leading-relaxed">
        UBpoint bridges student engagement and blockchain technology by transforming participation
        into verifiable digital value.
      </p>
      <a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-10">
        <Button className="h-14 px-8 bg-white text-blue-700 hover:bg-blue-50 rounded-full text-base font-bold shadow-2xl">
          Launch UBpoint App
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </a>
      <div className="mt-6 text-xs text-blue-100/70">
        <Link to="/projects" className="underline-offset-4 hover:underline">Back to all projects</Link>
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
                className="absolute inset-0 bg-gradient-to-b from-white/60 via-blue-50/30 to-white/0 backdrop-blur-[2px]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-blue-100 shadow-lg backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700 tracking-wide">
                    Initializing UBpoint…
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

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Clock, ChevronRight, ExternalLink, Layers, Shield, Code, Globe, Wallet, FileText, Cpu, Network, Boxes, Zap, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 }
  })
};

interface GuideCard {
  title: string;
  description: string;
  icon: React.ElementType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
}

const Section = ({ id, title, subtitle, cards }: { id: string; title: string; subtitle: string; cards: GuideCard[] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

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
            key={card.title}
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
                {card.difficulty}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">{card.description}</p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.08]">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {card.readTime}
              </span>
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 gap-1 text-xs px-2 h-7">
                Read Guide <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const startHereCards: GuideCard[] = [
  { title: 'What Is Blockchain?', description: 'Understand the foundational technology behind decentralized systems and why it matters for the future of the internet.', icon: Layers, difficulty: 'Beginner', readTime: '5 min' },
  { title: 'How Does a Blockchain Work?', description: 'Learn how blocks, nodes, and consensus mechanisms come together to create an immutable, transparent ledger.', icon: Cpu, difficulty: 'Beginner', readTime: '7 min' },
  { title: 'What Is Web3?', description: 'Discover the next evolution of the internet — ownership, decentralization, and user-controlled data.', icon: Globe, difficulty: 'Beginner', readTime: '4 min' },
  { title: 'Wallets, Tokens, and Transactions', description: 'Learn what crypto wallets are, how tokens work, and how transactions flow through a blockchain network.', icon: Wallet, difficulty: 'Beginner', readTime: '6 min' },
  { title: 'Public vs Private Keys', description: 'Understand the cryptographic key pairs that secure your identity and assets on blockchain networks.', icon: Shield, difficulty: 'Beginner', readTime: '4 min' },
  { title: 'Common Terms You Should Know', description: 'A glossary of essential blockchain terminology — from gas fees to smart contracts to consensus.', icon: FileText, difficulty: 'Beginner', readTime: '5 min' },
];

const ethereumCards: GuideCard[] = [
  { title: 'What Is Ethereum?', description: 'Explore the world\'s leading smart contract platform and why it serves as the backbone of decentralized finance and applications.', icon: Layers, difficulty: 'Intermediate', readTime: '6 min' },
  { title: 'How Ethereum Differs from Bitcoin', description: 'Compare the two largest blockchain networks — from purpose and architecture to consensus mechanisms.', icon: Boxes, difficulty: 'Intermediate', readTime: '5 min' },
  { title: 'Smart Contracts Explained', description: 'Understand self-executing contracts on the blockchain — how they work, why they matter, and where they\'re used.', icon: Code, difficulty: 'Intermediate', readTime: '7 min' },
  { title: 'Gas Fees and Transactions', description: 'Learn how transaction costs are calculated on Ethereum and strategies to optimize gas usage.', icon: Zap, difficulty: 'Intermediate', readTime: '5 min' },
  { title: 'Ethereum Accounts and Wallet Interaction', description: 'Discover the differences between EOAs and contract accounts, and how wallets interact with the network.', icon: Wallet, difficulty: 'Intermediate', readTime: '6 min' },
  { title: 'Intro to Ethereum Development', description: 'Get started with Ethereum development tools, languages, and frameworks used to build decentralized applications.', icon: Code, difficulty: 'Intermediate', readTime: '8 min' },
];

const buildCards: GuideCard[] = [
  { title: 'Intro to dApps', description: 'Understand what decentralized applications are, how they differ from traditional apps, and real-world use cases.', icon: Globe, difficulty: 'Intermediate', readTime: '6 min' },
  { title: 'What Are DAOs?', description: 'Learn about Decentralized Autonomous Organizations — community-governed entities powered by smart contracts.', icon: Network, difficulty: 'Intermediate', readTime: '5 min' },
  { title: 'Web2 vs Web3', description: 'A clear comparison of centralized and decentralized paradigms across infrastructure, identity, and ownership.', icon: Boxes, difficulty: 'Beginner', readTime: '4 min' },
  { title: 'Blockchain Networks and Testnets', description: 'Explore mainnet vs testnet environments and learn how developers safely experiment before deployment.', icon: Cpu, difficulty: 'Advanced', readTime: '7 min' },
  { title: 'Intro to Developer Tooling', description: 'An overview of essential tools — Hardhat, Foundry, Remix, Alchemy — that power blockchain development workflows.', icon: Code, difficulty: 'Advanced', readTime: '8 min' },
  { title: 'Security Basics for New Builders', description: 'Learn common vulnerabilities, best practices, and security patterns every Web3 developer should know.', icon: Shield, difficulty: 'Advanced', readTime: '7 min' },
];

const ecosystemResources = [
  {
    name: 'Ethereum',
    description: 'Foundational educational resources for understanding blockchain, smart contracts, wallets, and development — directly from the Ethereum ecosystem.',
    url: 'https://ethereum.org/en/learn/',
    color: 'from-[hsl(213,60%,50%)] to-[hsl(260,50%,45%)]',
  },
  {
    name: 'Binance Academy',
    description: 'Accessible educational articles, glossaries, and beginner-friendly content covering blockchain, crypto, Web3 concepts, and trading fundamentals.',
    url: 'https://academy.binance.com/',
    color: 'from-[hsl(45,90%,50%)] to-[hsl(35,85%,45%)]',
  },
  {
    name: 'Solana',
    description: 'Both no-code learning paths and developer-oriented resources for ecosystem exploration, building on Solana, and understanding high-performance blockchains.',
    url: 'https://solana.com/learn',
    color: 'from-[hsl(280,70%,55%)] to-[hsl(190,80%,50%)]',
  },
];

const journeySteps = [
  'Learn blockchain basics',
  'Understand wallets and transactions',
  'Explore Ethereum fundamentals',
  'Learn smart contracts and dApps',
  'Discover ecosystems and tools',
  'Join workshops and future bootcamps',
];

const EducationalGuides = () => {
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
              <BookOpen className="h-4 w-4" /> Educational Hub
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 text-foreground">
              Learn & <span className="text-accent">Grow</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-3">
              Structured educational materials to help you start, understand, and build in blockchain.
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto">
              Explore foundational guides, ecosystem knowledge, and curated learning paths inspired by leading blockchain education platforms.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section-container pb-20">
        {/* Section A */}
        <Section id="start-here" title="Start Here" subtitle="New to blockchain? Begin your journey with these foundational guides." cards={startHereCards} />

        {/* Section B */}
        <Section id="ethereum" title="Ethereum Fundamentals" subtitle="Dive into the world's most important smart contract platform." cards={ethereumCards} />

        {/* Section C */}
        <Section id="build" title="Build & Explore" subtitle="Go deeper into ecosystems, developer tools, and Web3 architecture." cards={buildCards} />

        {/* Section D — Ecosystem Resources */}
        <section ref={ecosystemRef} className="py-12 md:py-16">
          <motion.div initial="hidden" animate={ecosystemInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Recommended Learning Sources</h2>
            <p className="text-muted-foreground max-w-2xl">Trusted ecosystems and platforms curated by UTAAB for your learning journey.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ecosystemResources.map((res, i) => (
              <motion.a
                key={res.name}
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
                <h3 className="text-xl font-bold text-foreground mb-2">{res.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{res.description}</p>
                <span className="flex items-center gap-1.5 text-accent text-sm font-medium group-hover:gap-2.5 transition-all">
                  Visit Resource <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Section E — Learning Journey */}
        <section ref={journeyRef} className="py-12 md:py-20">
          <motion.div initial="hidden" animate={journeyInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Your Learning Journey</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Follow this suggested path from beginner to builder.</p>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            {journeySteps.map((step, i) => (
              <motion.div
                key={step}
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
                  {i < journeySteps.length - 1 && <div className="w-px h-8 bg-accent/20 mt-1" />}
                </div>
                <div className="pt-2">
                  <p className="text-foreground font-medium">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default EducationalGuides;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import GlassCard from '@/components/glass/GlassCard';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { Button } from '@/components/ui/button';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  cta: string;
  to?: string;
  href?: string;
  external?: boolean;
  badge?: string;
}

const ResourcesPage = () => {
  const { t } = useTranslation();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  const resources: ResourceItem[] = [
    {
      id: 'whitepaper',

      title: t('resourcesPage.items.whitepaper.title', 'Whitepaper'),
      description: t('resourcesPage.items.whitepaper.description', 'A visual summary of UTAAB\u2019s vision, the technology behind our work, and the roadmap that guides what we build next.'),
      cta: t('resourcesPage.items.whitepaper.cta', 'Read whitepaper'),
      to: '/whitepaper',
    },
    {
      id: 'guides',

      title: t('resourcesPage.items.guides.title', 'Documentation & Guides'),
      description: t('resourcesPage.items.guides.description', 'Beginner-friendly articles covering blockchain basics, wallets, smart contracts, and more — written by our team.'),
      cta: t('resourcesPage.items.guides.cta', 'Open guides'),
      to: '/learn/guides',
    },
    {
      id: 'tokenomics',

      title: t('resourcesPage.items.tokenomics.title', 'Tokenomics'),
      description: t('resourcesPage.items.tokenomics.description', 'A detailed token model is in active design. We\u2019ll publish the full breakdown here as soon as it\u2019s reviewed and finalized.'),
      cta: t('resourcesPage.items.tokenomics.cta', 'Coming soon'),
      to: '/whitepaper',
      badge: t('resourcesPage.comingSoon', 'Coming soon'),
    },
    {
      id: 'blog',

      title: t('resourcesPage.items.blog.title', 'Blog & Updates'),
      description: t('resourcesPage.items.blog.description', 'Latest announcements, project updates, event recaps, and educational deep-dives from the UTAAB community.'),
      cta: t('resourcesPage.items.blog.cta', 'Read the blog'),
      to: '/blog',
    },
    {
      id: 'faq',

      title: t('resourcesPage.items.faq.title', 'Frequently Asked Questions'),
      description: t('resourcesPage.items.faq.description', 'Honest answers to the most common questions about UTAAB, our community, and getting started in Web3.'),
      cta: t('resourcesPage.items.faq.cta', 'See FAQs'),
      to: '/faq',
    },
    {
      id: 'developers',

      title: t('resourcesPage.items.developers.title', 'Developer Resources'),
      description: t('resourcesPage.items.developers.description', 'Open-source code, contribution guides, and technical references for developers building on or with UTAAB.'),
      cta: t('resourcesPage.items.developers.cta', 'Visit GitHub'),
      href: 'https://github.com/UTAA-Blockchain',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="section-container text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-5">
              {t('resourcesPage.hero.badge', 'Knowledge Hub')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight">
              {t('resourcesPage.hero.title', 'Everything you need, in one place.')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('resourcesPage.hero.subtitle', 'Documentation, guides, the whitepaper, FAQs, and developer resources — all curated and free to read.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resources grid */}
      <section className="pb-16 md:pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res, i) => (
              <motion.div
                key={res.id}
                id={res.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <GlassCard variant="subtle" hover className="p-6 md:p-7 h-full flex flex-col">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-2xl font-extralight text-foreground/25 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {res.badge && (
                      <span className="text-[10px] uppercase tracking-wider text-amber-300">
                        {res.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{res.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{res.description}</p>
                  {res.external ? (
                    <a
                      href={res.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                    >
                      {res.cta}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link to={res.to!} className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                      {res.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="pb-20 md:pb-28">
        <div className="section-container max-w-3xl mx-auto">
          <GlassCard className="p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t('resourcesPage.cta.title', 'Can\u2019t find what you need?')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('resourcesPage.cta.subtitle', 'Join the community — our team and members answer questions and share resources every day.')}
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/#join">
                {t('resourcesPage.cta.button', 'Join the Community')} <ArrowRight className="ml-2 h-4 w-4" />
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

export default ResourcesPage;

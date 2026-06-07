import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import GlassCard from '@/components/glass/GlassCard';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEO from '@/components/SEO';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ = () => {
  const { t } = useTranslation();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  const faqs: FAQItem[] = [
    {
      q: t('faqPage.items.q1.q', 'What is UTAAB?'),
      a: t('faqPage.items.q1.a', 'UTAAB is a student-led Web3 ecosystem focused on blockchain education, real projects, and cross-border collaboration. We give beginners a clear path into Web3 — from first guide to first shipped project.'),
    },
    {
      q: t('faqPage.items.q2.q', 'Is UTAAB free to join?'),
      a: t('faqPage.items.q2.a', 'Yes. The community, the guides, and most courses are free. Some advanced or partner programs may have a fee, but it will always be clearly labeled.'),
    },
    {
      q: t('faqPage.items.q3.q', 'I have zero blockchain experience. Where do I start?'),
      a: t('faqPage.items.q3.a', 'Start with our Guides at /learn/guides. The "Beginner" section explains what blockchain is, how wallets work, and the basic vocabulary — in plain language with real examples.'),
    },
    {
      q: t('faqPage.items.q4.q', 'Do I need to buy crypto to participate?'),
      a: t('faqPage.items.q4.a', 'No. You can learn everything and join most activities without owning any crypto. When projects do require an on-chain action, we use free testnets so nothing is at risk.'),
    },
    {
      q: t('faqPage.items.q5.q', 'What is a wallet, and is it safe to use one?'),
      a: t('faqPage.items.q5.a', 'A wallet is software that stores the keys giving you access to your blockchain accounts. Used correctly — strong backups, never share your secret phrase — it is safe. Our wallets guide walks through best practices step by step.'),
    },
    {
      q: t('faqPage.items.q6.q', 'Does UTAAB have a token?'),
      a: t('faqPage.items.q6.a', 'A token model is in design. We will publish full details — supply, utility, distribution — only when finalized and reviewed. Anyone offering you a "UTAAB token" before the official announcement is not legitimate.'),
    },
    {
      q: t('faqPage.items.q7.q', 'How can I contribute to UTAAB?'),
      a: t('faqPage.items.q7.a', 'Visit /contributor-match. Tell us your skills and interests, and we\u2019ll match you with a project, task, or mentor. Designers, writers, developers, and community builders are all welcome.'),
    },
    {
      q: t('faqPage.items.q8.q', 'Where can I follow updates?'),
      a: t('faqPage.items.q8.a', 'Read the blog at /blog for major updates and follow us on LinkedIn, Telegram, Instagram, X, and GitHub — links are in the footer.'),
    },
    {
      q: t('faqPage.items.q9.q', 'Do I get a certificate after completing a course?'),
      a: t('faqPage.items.q9.a', 'Yes. UTAAB EDU courses issue completion certificates that you can share on LinkedIn or download as a PDF.'),
    },
    {
      q: t('faqPage.items.q10.q', 'How do you handle my personal data?'),
      a: t('faqPage.items.q10.a', 'We follow KVKK and GDPR principles. You can read the full Privacy Policy or open the Privacy Center from the footer at any time to manage your preferences.'),
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="UTAAB FAQ — Web3, Membership & Getting Started"
        description="Answers to common questions about UTAAB, joining the community, learning Web3, and contributing to projects."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="section-container text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-5">
              {t('faqPage.hero.badge', 'FAQ')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight">
              {t('faqPage.hero.title', 'Frequently Asked Questions')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('faqPage.hero.subtitle', 'Honest, plain-language answers to the questions we hear most often.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Accordion */}
      <section className="pb-16 md:pb-20">
        <div className="section-container max-w-3xl mx-auto">
          <GlassCard className="p-4 sm:p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-white/[0.08] last:border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-base sm:text-lg">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="section-container max-w-3xl mx-auto">
          <GlassCard className="p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t('faqPage.cta.title', 'Still have questions?')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('faqPage.cta.subtitle', 'Reach out at contact@utaab.org or join the community — we read every message.')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/#join">
                  {t('faqPage.cta.button', 'Join the Community')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-white/[0.04] border-white/15 hover:bg-white/[0.10]">
                <a href="mailto:contact@utaab.org">{t('faqPage.cta.email', 'Email Us')}</a>
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default FAQ;

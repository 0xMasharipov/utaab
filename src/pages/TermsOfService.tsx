import { useTranslation } from 'react-i18next';
import { Scale, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SafeContent } from '@/components/common/SafeContent';

export const TermsOfService = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'acceptance', key: 'acceptance' },
    { id: 'description', key: 'description' },
    { id: 'accounts', key: 'accounts' },
    { id: 'conduct', key: 'conduct' },
    { id: 'intellectual', key: 'intellectual' },
    { id: 'educational', key: 'educational' },
    { id: 'community', key: 'community' },
    { id: 'payment', key: 'payment' },
    { id: 'disclaimers', key: 'disclaimers' },
    { id: 'indemnification', key: 'indemnification' },
    { id: 'termination', key: 'termination' },
    { id: 'governing', key: 'governing' },
    { id: 'changes', key: 'changes' },
    { id: 'contact', key: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-background gradient-mesh pt-24 md:pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', 'Back')}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass border border-white/10 mb-6">
              <Scale className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('legal.termsOfService.title', 'Terms of Service')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('legal.termsOfService.lastUpdated', 'Last Updated')}: December 2024
            </p>
          </div>

          {/* Main Content Card */}
          <div className="glass rounded-2xl p-8 md:p-10 border border-white/10">
            {/* Table of Contents */}
            <div className="mb-10 p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t('legal.tableOfContents', 'Table of Contents')}
              </h2>
              <nav className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left text-muted-foreground hover:text-accent transition-colors py-1 px-2 rounded hover:bg-white/5"
                  >
                    {index + 1}. {t(`legal.termsOfService.sections.${section.key}.title`, section.key)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Sections */}
            <div className="space-y-10">
              {/* Acceptance */}
              <section id="acceptance">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  1. {t('legal.termsOfService.sections.acceptance.title', 'Acceptance of Terms')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.acceptance.content',
                    '<p>Welcome to UTAA Blockchain Community ("UTAAB," "we," "us," or "our"). By accessing or using our platform, services, educational content, or participating in our community activities, you agree to be bound by these Terms of Service ("Terms").</p><p>If you do not agree to these Terms, you may not access or use our services. Your continued use of the platform constitutes acceptance of any modifications to these Terms.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Description */}
              <section id="description">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  2. {t('legal.termsOfService.sections.description.title', 'Description of Services')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.description.content',
                    '<p>UTAA Blockchain Community is a non-profit educational organization that provides:</p><ul><li>Educational courses and learning materials on blockchain technology</li><li>Community forums and collaboration spaces</li><li>Events, workshops, and networking opportunities</li><li>Project collaboration tools and resources</li><li>Certification programs for completed courses</li></ul><p><strong>Important:</strong> All content and services are provided for educational purposes only and do not constitute financial, investment, or professional advice.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Accounts */}
              <section id="accounts">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  3. {t('legal.termsOfService.sections.accounts.title', 'User Accounts and Registration')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.accounts.content',
                    '<p>To access certain features, you must create an account. When registering, you agree to:</p><ul><li>Provide accurate, current, and complete information</li><li>Maintain and promptly update your account information</li><li>Maintain the security of your password and account</li><li>Accept responsibility for all activities under your account</li><li>Notify us immediately of any unauthorized use</li></ul><p>We reserve the right to suspend or terminate accounts that violate these Terms or provide false information.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Conduct */}
              <section id="conduct">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  4. {t('legal.termsOfService.sections.conduct.title', 'User Conduct and Responsibilities')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.conduct.content',
                    '<p>You agree NOT to:</p><ul><li>Violate any applicable laws or regulations</li><li>Infringe upon intellectual property rights of others</li><li>Upload malicious code, viruses, or harmful software</li><li>Harass, abuse, or harm other users</li><li>Spam, phish, or engage in fraudulent activities</li><li>Impersonate any person or entity</li><li>Attempt to gain unauthorized access to systems</li><li>Scrape, copy, or redistribute content without permission</li><li>Use the platform for commercial purposes without authorization</li><li>Share or promote illegal activities or content</li></ul><p>Violation of these rules may result in immediate account termination and legal action.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Intellectual Property */}
              <section id="intellectual">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  5. {t('legal.termsOfService.sections.intellectual.title', 'Intellectual Property Rights')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.intellectual.content',
                    '<p><strong>Our Content:</strong> All content on our platform, including courses, materials, logos, design, text, graphics, and software, is owned by UTAA Blockchain Community or our licensors and is protected by copyright, trademark, and other intellectual property laws.</p><p><strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use our platform for personal, non-commercial educational purposes only.</p><p><strong>Restrictions:</strong> You may not copy, modify, distribute, sell, or create derivative works from our content without explicit written permission.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Educational Content */}
              <section id="educational">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  6. {t('legal.termsOfService.sections.educational.title', 'Educational Content and Licenses')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.educational.content',
                    '<p><strong>Course Access:</strong> Upon enrollment, you receive a non-exclusive license to access course materials for the duration specified. Course materials may include videos, documents, quizzes, and assignments.</p><p><strong>Certificates:</strong> Certificates are issued upon successful completion of courses. Certificates are for personal use and verification purposes only. Misrepresentation of certificates or credentials is prohibited.</p><p><strong>User-Generated Content:</strong> By submitting content (assignments, forum posts, projects), you grant us a worldwide, non-exclusive license to use, display, and distribute your content for educational and promotional purposes.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Community Guidelines */}
              <section id="community">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  7. {t('legal.termsOfService.sections.community.title', 'Community Guidelines')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.community.content',
                    '<p>Our community thrives on respect, collaboration, and constructive engagement. We expect all members to:</p><ul><li>Be respectful and professional in all interactions</li><li>Share knowledge and help other learners</li><li>Provide constructive feedback</li><li>Respect diverse perspectives and backgrounds</li><li>Report inappropriate behavior to moderators</li><li>Follow event-specific guidelines and codes of conduct</li></ul><p>Violations may result in warnings, temporary suspension, or permanent ban from community activities.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Payment Terms */}
              <section id="payment">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  8. {t('legal.termsOfService.sections.payment.title', 'Payment Terms')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.payment.content',
                    '<p>While many of our courses and services are free, some premium content may require payment.</p><ul><li><strong>Pricing:</strong> All prices are clearly displayed before purchase</li><li><strong>Payment Methods:</strong> We accept various payment methods as indicated at checkout</li><li><strong>Refunds:</strong> Refund policies are specified for each paid course or service</li><li><strong>Cancellation:</strong> Subscription-based services may be cancelled according to their specific terms</li><li><strong>No Liability:</strong> We are not responsible for payment processing errors by third-party providers</li></ul>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Disclaimers */}
              <section id="disclaimers">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  9. {t('legal.termsOfService.sections.disclaimers.title', 'Disclaimers and Limitations of Liability')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.disclaimers.content',
                    '<p><strong>Educational Purpose Only:</strong> All content is provided "as is" for educational purposes. We make no warranties about accuracy, completeness, or suitability for any particular purpose.</p><p><strong>Not Financial Advice:</strong> Nothing on this platform constitutes financial, investment, legal, or professional advice. Cryptocurrency and blockchain technologies involve significant risks.</p><p><strong>Third-Party Content:</strong> We are not responsible for third-party content, links, or services accessed through our platform.</p><p><strong>Limitation of Liability:</strong> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Indemnification */}
              <section id="indemnification">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  10. {t('legal.termsOfService.sections.indemnification.title', 'Indemnification')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.indemnification.content',
                    '<p>You agree to indemnify, defend, and hold harmless UTAA Blockchain Community, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from:</p><ul><li>Your violation of these Terms</li><li>Your use or misuse of our services</li><li>Your violation of any third-party rights</li><li>Any content you submit or share through our platform</li></ul>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Termination */}
              <section id="termination">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  11. {t('legal.termsOfService.sections.termination.title', 'Termination')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.termination.content',
                    '<p>We reserve the right to suspend or terminate your access to our services at any time, with or without notice, for:</p><ul><li>Violation of these Terms</li><li>Fraudulent or illegal activities</li><li>Behavior that harms other users or our community</li><li>Extended inactivity</li><li>Any other reason at our sole discretion</li></ul><p>Upon termination, your right to use our services ceases immediately. Provisions that by their nature should survive termination (including intellectual property, disclaimers, and limitations of liability) will remain in effect.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Governing Law */}
              <section id="governing">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  12. {t('legal.termsOfService.sections.governing.title', 'Governing Law and Dispute Resolution')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.governing.content',
                    '<p>These Terms shall be governed by and construed in accordance with the laws of the Republic of Turkey, without regard to conflict of law provisions.</p><p><strong>Dispute Resolution:</strong> Any disputes arising from these Terms or your use of our services shall be resolved through:</p><ol><li>Good faith negotiations between parties</li><li>Mediation, if negotiations fail</li><li>Jurisdiction of Istanbul courts if mediation fails</li></ol><p>For international users, we will make reasonable efforts to resolve disputes in accordance with applicable international laws and conventions.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Changes */}
              <section id="changes">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  13. {t('legal.termsOfService.sections.changes.title', 'Changes to Terms')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.changes.content',
                    '<p>We reserve the right to modify these Terms at any time. We will notify users of material changes through:</p><ul><li>Email notifications to registered users</li><li>Prominent notices on our platform</li><li>Updated "Last Modified" date</li></ul><p>Your continued use of our services after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using our services.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Contact */}
              <section id="contact">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  14. {t('legal.termsOfService.sections.contact.title', 'Contact Information')}
                </h2>
                <SafeContent
                  content={t('legal.termsOfService.sections.contact.content',
                    '<p>For questions about these Terms of Service, please contact us:</p><ul><li><strong>Email:</strong> legal@utaab.org</li><li><strong>Address:</strong> UTAA Blockchain Community, Istanbul, Turkey</li><li><strong>Website:</strong> <a href="https://utaab.org" class="text-accent hover:underline">https://utaab.org</a></li></ul><p>We aim to respond to all inquiries within 5 business days.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>
            </div>

            {/* Related Links */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('legal.relatedDocuments', 'Related Documents')}
              </h3>
              <div className="space-y-2">
                <a
                  href="/privacy-policy"
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('footer.privacyPolicy', 'Privacy Policy')}
                </a>
                <a
                  href="/kvkk-request"
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('footer.kvkkRequest', 'KVKK Data Request')}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

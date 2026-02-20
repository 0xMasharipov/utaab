import { useTranslation } from 'react-i18next';
import { Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SafeContent } from '@/components/common/SafeContent';

export const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'introduction', key: 'introduction' },
    { id: 'data-collection', key: 'dataCollection' },
    { id: 'data-usage', key: 'dataUsage' },
    { id: 'data-sharing', key: 'dataSharing' },
    { id: 'data-security', key: 'dataSecurity' },
    { id: 'your-rights', key: 'yourRights' },
    { id: 'cookies', key: 'cookies' },
    { id: 'third-party', key: 'thirdParty' },
    { id: 'international', key: 'international' },
    { id: 'children', key: 'children' },
    { id: 'updates', key: 'updates' },
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
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('legal.privacyPolicy.title', 'Privacy Policy')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('legal.privacyPolicy.lastUpdated', 'Last Updated')}: {t('legal.lastUpdatedDate', 'December 2024')}
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
                    {index + 1}. {t(`legal.privacyPolicy.sections.${section.key}.title`, section.key)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Sections */}
            <div className="space-y-10">
              {/* Introduction */}
              <section id="introduction">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  1. {t('legal.privacyPolicy.sections.introduction.title', 'Introduction')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.introduction.content', 
                    '<p>UTAA Blockchain Community ("we," "us," or "our") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.</p><p>This policy complies with the Turkish Personal Data Protection Law No. 6698 (KVKK) and applicable international data protection regulations including GDPR where relevant.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Data Collection */}
              <section id="data-collection">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  2. {t('legal.privacyPolicy.sections.dataCollection.title', 'Information We Collect')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.dataCollection.content',
                    '<p><strong>Personal Information:</strong> When you register or use our services, we collect information such as your name, email address, educational background, department, interests, and contact information.</p><p><strong>Usage Data:</strong> We automatically collect information about how you interact with our platform, including IP address, browser type, device information, pages visited, and timestamps.</p><p><strong>Authentication Data:</strong> When you sign in through third-party providers (e.g., Google OAuth), we receive basic profile information as permitted by those services.</p><p><strong>Educational Data:</strong> Course enrollment, progress, quiz results, certificates earned, and learning activities.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Data Usage */}
              <section id="data-usage">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  3. {t('legal.privacyPolicy.sections.dataUsage.title', 'How We Use Your Information')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.dataUsage.content',
                    '<ul><li>To provide and maintain our educational platform and community services</li><li>To process your registration and manage your account</li><li>To deliver courses, track progress, and issue certificates</li><li>To organize and manage events, workshops, and community activities</li><li>To send you important updates, announcements, and educational content</li><li>To improve our services through analytics and user feedback</li><li>To ensure security and prevent fraud or unauthorized access</li><li>To comply with legal obligations and protect our legal rights</li></ul>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Data Sharing */}
              <section id="data-sharing">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  4. {t('legal.privacyPolicy.sections.dataSharing.title', 'Data Sharing and Disclosure')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.dataSharing.content',
                    '<p><strong>We do not sell your personal data.</strong> We may share your information in the following circumstances:</p><ul><li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform (hosting, email services, analytics)</li><li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li><li><strong>Protection:</strong> To protect our rights, property, safety, or that of our users</li><li><strong>Consent:</strong> With your explicit consent for specific purposes</li><li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of assets (with proper notifications)</li></ul>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Data Security */}
              <section id="data-security">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  5. {t('legal.privacyPolicy.sections.dataSecurity.title', 'Data Security')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.dataSecurity.content',
                    '<p>We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:</p><ul><li>Encryption of data in transit and at rest</li><li>Regular security assessments and updates</li><li>Access controls and authentication mechanisms</li><li>Secure backup and recovery procedures</li><li>Staff training on data protection</li></ul><p>However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Your Rights */}
              <section id="your-rights">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  6. {t('legal.privacyPolicy.sections.yourRights.title', 'Your Rights (KVKK Article 11)')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.yourRights.content',
                    '<p>Under KVKK Article 11 and applicable data protection laws, you have the right to:</p><ul><li>Learn whether your personal data is being processed</li><li>Request information about the processing of your data</li><li>Learn the purpose of data processing and whether it is used for its intended purpose</li><li>Know third parties to whom your data has been transferred domestically or abroad</li><li>Request correction of incomplete or inaccurate data</li><li>Request deletion or destruction of your data under certain conditions</li><li>Request notification of correction, deletion, or destruction to third parties</li><li>Object to processing that leads to unfavorable consequences</li><li>Request data portability</li><li>Withdraw your consent at any time</li></ul><p>To exercise these rights, please visit our <a href="/kvkk-request" class="text-accent hover:underline">KVKK Data Request page</a> or contact us directly.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Cookies */}
              <section id="cookies">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  7. {t('legal.privacyPolicy.sections.cookies.title', 'Cookies and Tracking Technologies')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.cookies.content',
                    '<p>We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. Cookie categories include:</p><ul><li><strong>Essential Cookies:</strong> Required for basic functionality (always enabled)</li><li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li><li><strong>Performance Cookies:</strong> Optimize site performance</li><li><strong>Marketing Cookies:</strong> Deliver relevant updates (requires consent)</li></ul><p>You can manage your cookie preferences through our Privacy Center or browser settings.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Third Party Services */}
              <section id="third-party">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  8. {t('legal.privacyPolicy.sections.thirdParty.title', 'Third-Party Services')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.thirdParty.content',
                    '<p>Our platform integrates with third-party services including:</p><ul><li><strong>Google OAuth:</strong> For authentication (subject to Google\'s privacy policy)</li><li><strong>Cloud Hosting:</strong> For data storage and platform infrastructure</li><li><strong>Email Services:</strong> For transactional and marketing communications</li><li><strong>Analytics:</strong> To understand platform usage and improve services</li></ul><p>These third parties have their own privacy policies and data practices. We encourage you to review their policies before using their services through our platform.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* International Transfers */}
              <section id="international">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  9. {t('legal.privacyPolicy.sections.international.title', 'International Data Transfers')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.international.content',
                    '<p>Your data may be transferred to and processed in countries outside Turkey, including the European Union and the United States, where our service providers are located. We ensure that all cross-border data transfers comply with KVKK Article 9 and include appropriate safeguards such as:</p><ul><li>Standard contractual clauses approved by authorities</li><li>Adequacy decisions recognizing equivalent data protection</li><li>Your explicit consent where required</li></ul>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Children's Privacy */}
              <section id="children">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  10. {t('legal.privacyPolicy.sections.children.title', "Children's Privacy")}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.children.content',
                    '<p>Our services are intended for university students and professionals aged 18 and older. We do not knowingly collect personal information from individuals under 18 without parental consent. If you believe we have inadvertently collected data from a minor, please contact us immediately.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Updates */}
              <section id="updates">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  11. {t('legal.privacyPolicy.sections.updates.title', 'Updates to This Policy')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.updates.content',
                    '<p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes through:</p><ul><li>Email notifications to registered users</li><li>Prominent notices on our platform</li><li>Updated "Last Modified" date at the top of this policy</li></ul><p>Your continued use of our services after changes become effective constitutes acceptance of the updated policy.</p>'
                  )}
                  className="prose prose-invert max-w-none text-muted-foreground space-y-4"
                />
              </section>

              {/* Contact */}
              <section id="contact">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  12. {t('legal.privacyPolicy.sections.contact.title', 'Contact Information')}
                </h2>
                <SafeContent
                  content={t('legal.privacyPolicy.sections.contact.content',
                    '<p>For questions about this Privacy Policy or to exercise your data rights, please contact us:</p><ul><li><strong>Data Request Form:</strong> <a href="/kvkk-request" class="text-accent hover:underline">Submit KVKK Request</a></li><li><strong>Email:</strong> privacy@utaab.org</li><li><strong>Address:</strong> UTAA Blockchain Community, Istanbul, Turkey</li></ul><p>We will respond to your inquiries within 30 days as required by KVKK.</p>'
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
                  href="/terms-of-service"
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('footer.termsOfService', 'Terms of Service')}
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

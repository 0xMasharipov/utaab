import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onPrivacyClick: () => void;
}

export const Footer = ({ onPrivacyClick }: FooterProps) => {
  const { t } = useTranslation();

  const quickLinks = [
    { key: 'community', id: 'community' },
    { key: 'learn', id: 'learn' },
    { key: 'events', id: 'events' },
    { key: 'projects', id: 'projects' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/utaa-blockchain/', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/utaa_blockchain?igsh=MXhpYW55aDYxdjdmeQ%3D%3D&utm_source=qr', color: 'hover:text-pink-400' },
    { name: 'X', icon: Twitter, url: 'https://x.com/utaa_blockchain?s=11', color: 'hover:text-blue-300' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative py-12 sm:py-16 border-t border-white/10">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              {t('footer.brand')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {t(`nav.${link.key}`)}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onPrivacyClick}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {t('footer.privacyCenter')}
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {t('footer.social')}
            </h4>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass p-2 sm:p-3 rounded-xl transition-all hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {t('footer.newsletter')}
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="glass border-white/20 focus:border-accent text-foreground placeholder:text-muted-foreground text-sm sm:text-base min-h-[44px]"
              />
              <Button className="btn-primary px-3 sm:px-4 min-h-[44px] whitespace-nowrap">
                {t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.rights')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

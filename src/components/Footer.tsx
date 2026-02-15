import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Instagram, Twitter, Send } from 'lucide-react';
import logo from '@/assets/logo-new.png';
import { BrandText } from '@/components/common/BrandText';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { Link } from 'react-router-dom';

interface FooterProps {
  onPrivacyClick: () => void;
}

export const Footer = ({ onPrivacyClick }: FooterProps) => {
  const { t } = useTranslation();
  const { getTransitionClasses } = useLanguageTransition();

  const navLinks = [
    { label: t('footer.home', 'Home'), href: '/' },
    { label: t('nav.projects'), href: '/#projects' },
    { label: t('footer.blogLink', 'Blog'), href: '/blog' },
    { label: t('footer.teamLink', 'Team'), href: '/team' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/utaa-blockchain/', ariaLabel: 'Visit UTAAB on LinkedIn' },
    { name: 'Telegram', icon: Send, url: 'https://t.me/utaa_blockchain', ariaLabel: 'Visit UTAAB on Telegram' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/utaa_blockchain?igsh=MXhpYW55aDYxdjdmeQ%3D%3D&utm_source=qr', ariaLabel: 'Visit UTAAB on Instagram' },
    { name: 'X', icon: Twitter, url: 'https://x.com/utaa_blockchain?s=11', ariaLabel: 'Visit UTAAB on X' },
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
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <img
                src={logo}
                alt="UTAA Blockchain logo"
                className="h-7 sm:h-8 w-auto transition-transform hover:scale-105 mix-blend-lighten brightness-110"
                width="120" height="32" loading="eager"
              />
              <BrandText variant="footer" />
            </div>
            <p className={getTransitionClasses("text-muted-foreground leading-relaxed text-base text-left")}>
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className={getTransitionClasses("text-lg font-semibold text-foreground mb-4")}>
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="/privacy-policy" className="text-muted-foreground hover:text-accent transition-colors">
                  {t('footer.privacyPolicy', 'Privacy Policy')}
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-muted-foreground hover:text-accent transition-colors">
                  {t('footer.termsOfService', 'Terms of Service')}
                </a>
              </li>
              <li>
                <button onClick={onPrivacyClick} className="text-muted-foreground hover:text-accent transition-colors text-left">
                  {t('footer.privacyCenter', 'Privacy Center')}
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className={getTransitionClasses("text-lg font-semibold text-foreground mb-4")}>
              {t('footer.social')}
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass border border-white/10 p-3 rounded-xl transition-all hover:scale-110 hover:border-accent hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={social.ariaLabel}
                  title={social.ariaLabel}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={getTransitionClasses("text-lg font-semibold text-foreground mb-4")}>
              {t('footer.newsletter')}
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder={t('footer.newsletterPlaceholder')} className="glass border-white/20 focus:border-accent text-foreground placeholder:text-muted-foreground text-sm sm:text-base min-h-[44px]" />
              <Button className="btn-primary px-3 sm:px-4 min-h-[44px] whitespace-nowrap">
                {t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={getTransitionClasses("text-muted-foreground text-sm")}>
              © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.rights')}
            </p>
            <p className={getTransitionClasses("text-muted-foreground text-sm")}>
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

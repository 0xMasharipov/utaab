import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Instagram, Twitter, SendDiagonal, Mail, Github } from 'iconoir-react';
import logo from '@/assets/logo-new.webp';
import footerGeoDesktop from '@/assets/footer-geo-desktop.png';
import footerGeoMobile from '@/assets/footer-geo-mobile.png';
import { BrandText } from '@/components/common/BrandText';
import AnimatedImage from '@/components/common/AnimatedImage';
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
    { label: t('footer.aboutLink', 'About Us'), href: '/about' },
    { label: t('nav.projects'), href: '/#projects' },
    { label: t('footer.blogLink', 'Blog'), href: '/blog' },
    { label: t('footer.teamLink', 'Team'), href: '/team' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/utaa-blockchain/', ariaLabel: 'Visit UTAAB on LinkedIn', hoverClass: 'hover:text-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.3)]' },
    { name: 'Telegram', icon: SendDiagonal, url: 'https://t.me/utaa_blockchain', ariaLabel: 'Visit UTAAB on Telegram', hoverClass: 'hover:text-[#26A5E4] hover:border-[#26A5E4] hover:shadow-[0_0_20px_rgba(38,165,228,0.3)]' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/utaa_blockchain', ariaLabel: 'Visit UTAAB on Instagram', hoverClass: 'hover:text-[#E4405F] hover:border-[#E4405F] hover:shadow-[0_0_20px_rgba(228,64,95,0.3)]' },
    { name: 'X', icon: Twitter, url: 'https://x.com/utaa_blockchain?s=11', ariaLabel: 'Visit UTAAB on X', hoverClass: 'hover:text-white hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/UTAA-Blockchain', ariaLabel: 'Visit UTAAB on GitHub', hoverClass: 'hover:text-white hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]' },
  ];

  return (
    <footer className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-b from-[hsl(217,50%,8%)] to-[hsl(217,55%,4%)]">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Radial glow behind geometric */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none z-0" />

      {/* Geometric background — Desktop */}
      <img
        src={footerGeoDesktop}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[65%] max-w-[900px] opacity-[0.08] z-0 hidden md:block object-contain"
        draggable={false}
      />
      {/* Geometric background — Mobile */}
      <img
        src={footerGeoMobile}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] max-w-[400px] opacity-[0.09] z-0 block md:hidden object-contain"
        draggable={false}
      />

      <div className="relative z-10 section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <AnimatedImage
                src={logo}
                alt="UTAA Blockchain logo"
                className="h-7 sm:h-8 w-auto transition-transform hover:scale-105 mix-blend-lighten brightness-110"
                width={120} height={32} loading="eager"
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
                  className={`glass border border-white/10 p-3 rounded-xl transition-all hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${social.hoverClass}`}
                  aria-label={social.ariaLabel}
                  title={social.ariaLabel}
                >
                  <social.icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <div className="mt-4">
              <a
                href="mailto:contact@utaab.org"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                <span className="text-sm">contact@utaab.org</span>
              </a>
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
        <div className="pt-10 border-t border-white/[0.08]">
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

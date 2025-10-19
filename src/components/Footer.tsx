import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Instagram, Twitter, Send } from 'lucide-react';
import logo from '@/assets/logo.png';
interface FooterProps {
  onPrivacyClick: () => void;
}
export const Footer = ({
  onPrivacyClick
}: FooterProps) => {
  const {
    t
  } = useTranslation();
  const quickLinks = [{
    key: 'community',
    id: 'community'
  }, {
    key: 'learn',
    id: 'learn'
  }, {
    key: 'events',
    id: 'events'
  }, {
    key: 'projects',
    id: 'projects'
  }];
  const socialLinks = [{
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/company/utaa-blockchain/',
    ariaLabel: 'Visit UTAAB on LinkedIn'
  }, {
    name: 'Telegram',
    icon: Send,
    url: 'https://t.me/utaa_blockchain',
    ariaLabel: 'Visit UTAAB on Telegram'
  }, {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/utaa_blockchain?igsh=MXhpYW55aDYxdjdmeQ%3D%3D&utm_source=qr',
    ariaLabel: 'Visit UTAAB on Instagram'
  }, {
    name: 'X',
    icon: Twitter,
    url: 'https://x.com/utaa_blockchain?s=11',
    ariaLabel: 'Visit UTAAB on X'
  }];
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <footer className="relative py-12 sm:py-16 border-t border-white/10">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <img 
              src={logo} 
              alt="UTAA Blockchain logo" 
              className="h-7 sm:h-8 w-auto mb-3 sm:mb-4 transition-transform hover:scale-105"
              width="120"
              height="32"
              loading="eager"
            />
            <p className="text-muted-foreground leading-relaxed text-base text-left">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(link => <li key={link.key}>
                  <button onClick={() => scrollToSection(link.id)} className="text-muted-foreground hover:text-accent transition-colors">
                    {t(`nav.${link.key}`)}
                  </button>
                </li>)}
              <li>
                <button onClick={onPrivacyClick} className="text-muted-foreground hover:text-accent transition-colors">
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
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(social => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="glass border border-white/10 p-3 rounded-full transition-all hover:scale-110 hover:border-accent hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background" 
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
            <h4 className="text-lg font-semibold text-foreground mb-4">
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
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.rights')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
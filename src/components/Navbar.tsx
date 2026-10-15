import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import FloatingMenu, { type FloatingMenuGroup } from '@/components/ui/liquid-morph-floating-menu';

/** Shared public-site navigation; education and admin keep their own shells. */
export const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const groups: FloatingMenuGroup[] = [
    { label: t('nav.ecosystem', 'Ecosystem'), items: [
      ...['community', 'learn', 'events', 'projects'].map(id => ({ label: t(`nav.${id}`), destination: id, section: true })),
    ] },
    { label: t('nav.explore', 'Explore'), items: [
      { label: t('nav.resources'), destination: '/resources' },
      { label: t('nav.blog'), destination: '/blog' },
      { label: t('education.title'), destination: '/education' },
      { label: t('nav.verifyCertificate'), destination: '/verify-certificate' },
    ] },
    { label: t('nav.organization', 'Organization'), items: [
      { label: t('nav.about'), destination: '/about' },
      { label: t('nav.team'), destination: '/team' },
      { label: t('nav.contributorMatch'), destination: '/contributor-match' },
      { label: t('footer.home', 'Home'), destination: 'hero', section: true },
    ] },
  ];
  const onNavigate = (destination: string, section = false) => {
    if (!section) { navigate(destination); return; }
    if (location.pathname !== '/') {
      navigate(`/#${destination}`, { state: { scrollTo: destination } });
      return;
    }
    const element = document.getElementById(destination);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    } else {
      navigate(`/#${destination}`, { state: { scrollTo: destination } });
    }
  };
  return <FloatingMenu groups={groups} routeKey={location.key} onNavigate={onNavigate} />;
};

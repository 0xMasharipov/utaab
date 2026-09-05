import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import GlassCard from '@/components/glass/GlassCard';
import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';
import tonraLogo from '@/assets/projects/tonra-logo-640.webp';


type ProjectStatus = 'underDevelopment' | 'planning' | 'beta';

interface Project {
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  status: ProjectStatus;
  image: string;
  logo?: string;
  theme?: 'ubpoint' | 'tonra';
  href?: string;
}

export const Projects = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects: Project[] = [
    {
      titleKey: 'projects.ubp.title',
      descriptionKey: 'projects.ubp.description',
      tags: ['projects.tags.onChainRewards', 'projects.tags.studentCommunity', 'projects.tags.webAppLive'],
      status: 'beta',
      image: '/images/projects/ubpoint_coins-cutout.png',
      logo: '/images/projects/favicon.ico',
      theme: 'ubpoint',
      href: '/projects/ubpoint',
    },
    {
      titleKey: 'projects.tonra.title',
      descriptionKey: 'projects.tonra.description',
      tags: ['projects.tags.tonSecurity', 'projects.tags.telegramBot', 'projects.tags.walletChecks'],
      status: 'beta',
      image: '/images/projects/TonRa_card-transparent.png',
      logo: tonraLogo,
      theme: 'tonra',
      href: '/projects/tonra',
    },
    {
      titleKey: 'projects.asn.title',
      descriptionKey: 'projects.asn.description',
      tags: ['projects.tags.payments', 'projects.tags.blockchain', 'projects.tags.university'],
      status: 'planning',
      image: '/images/projects/UTAAB_ASN.webp',
    },
    {
      titleKey: 'projects.dvs.title',
      descriptionKey: 'projects.dvs.description',
      tags: ['projects.tags.identity', 'projects.tags.validation', 'projects.tags.nodes'],
      status: 'planning',
      image: '/images/projects/UTAAB_DVS.webp',
    },
    {
      titleKey: 'projects.did.title',
      descriptionKey: 'projects.did.description',
      tags: ['projects.tags.identity', 'projects.tags.privacy', 'projects.tags.layer2'],
      status: 'planning',
      image: '/images/projects/UTAAB_DID.webp',
    },
    {
      titleKey: 'projects.dao.title',
      descriptionKey: 'projects.dao.description',
      tags: ['projects.tags.governance', 'projects.tags.dao', 'projects.tags.community'],
      status: 'planning',
      image: '/images/projects/UTAAB_DAO.webp',
    },
  ];

  return (
    <section id="projects" className="py-16 md:py-24 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glow-soft px-2">
            {t('projects.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <CoverflowCarousel
          ariaLabel={t('projects.title')}
          images={projects.map((p) => p.image)}
          cardAspectRatio={4 / 5}
          maxRotationDegrees={28}
          maxDepthPx={140}
          minScale={0.92}
          cardGap={28}
          frictionFactor={0.9}
          wheelSensitivity={0.6}
          dragSensitivity={1.0}
          backgroundBlur={24}
          gradientSize={0.65}
          gradientIntensity={0.22}
          items={projects.map((project, index) => {
            const isUbpoint = project.theme === 'ubpoint';
            const isTonra = project.theme === 'tonra';
            const isBranded = isUbpoint || isTonra;
            const cardInner = (
              <GlassCard
                className="relative flex h-full flex-col overflow-hidden p-0 group"
                style={
                  isUbpoint
                    ? { background: 'linear-gradient(145deg, #1672ff 0%, #0b63ff 48%, #0648d8 100%)' }
                    : isTonra
                      ? { background: 'linear-gradient(145deg, #0a1626 0%, #07101d 48%, #05080f 100%)' }
                      : undefined
                }
              >
                {/* Layer 1: project-specific atmosphere */}
                {isUbpoint ? (
                  <>
                    <div className="absolute -left-16 -top-20 z-0 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute inset-0 z-0 opacity-20 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
                  </>
                ) : isTonra ? (
                  <>
                    <div className="absolute -bottom-24 -right-20 z-0 h-80 w-80 rounded-full bg-[#1687ff]/25 blur-[70px]" />
                    <div className="absolute inset-0 z-0 opacity-20 [background-image:linear-gradient(rgba(22,135,255,0.25)_1px,transparent_1px)] [background-size:100%_28px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 z-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, hsl(213 94% 68% / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(213 94% 68% / 0.4) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                )}

                {/* Layer 2: 3D image */}
                <div
                  aria-hidden="true"
                  className={
                    isUbpoint
                      ? 'absolute -bottom-[7%] -right-[22%] h-[67%] w-[116%] z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,black_58%,black_100%)] sm:[mask-image:none]'
                      : isTonra
                        ? 'absolute bottom-0 inset-x-0 h-[52%] w-full z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_34%,black_68%,black_100%)] sm:bottom-[2%] sm:h-[60%] sm:[mask-image:none]'
                        : 'absolute bottom-2 right-2 w-[72%] sm:w-[62%] md:w-[58%] h-[46%] z-10 opacity-[0.9]'
                  }
                >
                  <img
                    src={project.image}
                    alt=""
                    draggable={false}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    sizes="(max-width: 639px) 72vw, 240px"
                    className={`pointer-events-none h-full w-full select-none object-contain object-bottom ${
                      isUbpoint
                        ? 'drop-shadow-[0_22px_38px_rgba(3,39,119,0.30)]'
                        : isTonra
                          ? 'drop-shadow-[0_22px_38px_rgba(0,102,255,0.30)]'
                          : 'drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)]'
                    }`}
                  />
                </div>


                {/* Layer 3: Dark gradient overlay */}
                <div
                  className="absolute inset-0 z-20"
                  style={{
                    background: isUbpoint
                      ? 'linear-gradient(to bottom, rgba(11,99,255,0.98) 0%, rgba(11,99,255,0.90) 43%, rgba(11,99,255,0.18) 73%, transparent 100%)'
                      : isTonra
                        ? 'linear-gradient(to bottom, rgba(5,8,15,0.96) 0%, rgba(5,8,15,0.84) 43%, rgba(5,8,15,0.10) 76%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.25) 70%, transparent 100%)',
                  }}
                />

                {project.href && (
                  <div className={`absolute right-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full border transition-all group-hover:opacity-100 ${
                    isUbpoint
                      ? 'border-white/30 bg-white/15 text-white opacity-90 group-hover:bg-white group-hover:text-[#0b63ff]'
                      : isTonra
                        ? 'border-[#1687ff]/35 bg-[#1687ff]/10 text-[#7bc2ff] opacity-90 group-hover:bg-[#1687ff] group-hover:text-[#03101f]'
                        : 'border-white/[0.12] bg-white/[0.08] text-foreground opacity-70 group-hover:border-primary/40 group-hover:bg-primary/30'
                  }`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                )}

                {/* Layer 4: Text content */}
                <div className="relative z-30 p-5 sm:p-6 flex flex-col h-full">
                  <div className={`mb-4 flex items-center ${project.logo ? 'gap-3' : ''}`}>
                    {project.logo && (
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border ${
                        isUbpoint
                          ? 'border-white/70 bg-white p-1.5 shadow-[0_10px_26px_rgba(3,39,119,0.18)]'
                          : 'border-[#1687ff]/25 bg-[#071322]/90 p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.28)]'
                      }`}>
                        <img src={project.logo} alt="" aria-hidden className="h-full w-full object-contain" />
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-semibold ${
                        isUbpoint
                          ? 'text-white/85'
                          : isTonra
                            ? 'text-[#75bdff]'
                            : project.status === 'beta'
                          ? 'text-emerald-400'
                          : project.status === 'underDevelopment'
                          ? 'text-accent'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {t(`projects.status.${project.status}`)}
                    </span>
                  </div>

                  <h3 className={`mb-2 text-lg font-bold leading-tight ${isBranded ? 'text-white' : 'text-foreground'}`}>
                    {t(project.titleKey)}
                  </h3>

                  <p className={`mb-4 line-clamp-4 overflow-hidden break-words text-sm ${
                    isUbpoint ? 'text-blue-50/90' : isTonra ? 'text-slate-300' : 'text-muted-foreground'
                  }`}>
                    {t(project.descriptionKey)}
                  </p>

                  <div className={`mt-auto flex flex-wrap gap-1.5 text-[11px] sm:gap-2 ${
                    isUbpoint
                      ? 'relative z-10 -mx-1.5 rounded-lg bg-[#0a56dc]/70 px-1.5 py-1 backdrop-blur-sm sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none'
                      : isTonra
                        ? 'relative z-10 -mx-1.5 rounded-lg bg-[#05080f]/72 px-1.5 py-1 backdrop-blur-sm sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none'
                        : 'text-muted-foreground'
                  }`}>
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={
                          isUbpoint
                            ? 'py-0.5 text-[10px] font-medium text-white sm:rounded-full sm:border sm:border-white/25 sm:bg-white/14 sm:px-2.5 sm:py-1 sm:text-[11px] sm:backdrop-blur-sm'
                            : isTonra
                              ? 'py-0.5 text-[10px] font-medium text-[#a7d6ff] sm:rounded-full sm:border sm:border-[#1687ff]/20 sm:bg-[#1687ff]/10 sm:px-2.5 sm:py-1 sm:text-[11px] sm:backdrop-blur-sm'
                              : undefined
                        }
                      >
                        {isBranded && tagIndex > 0 && <span className="me-1 text-white/45 sm:hidden">•</span>}
                        {!isBranded && tagIndex > 0 && <span className="mr-1.5 text-white/20">•</span>}
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );

            return project.href ? (
              <Link
                key={index}
                to={project.href}
                draggable={false}
                className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={t(project.titleKey)}
              >
                {cardInner}
              </Link>
            ) : (
              cardInner
            );
          })}
        />

      </div>
    </section>
  );
};

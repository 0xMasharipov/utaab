import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';
import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';


type ProjectStatus = 'underDevelopment' | 'planning' | 'beta';

interface Project {
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  status: ProjectStatus;
  image: string;
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
      tags: ['projects.tags.rewards', 'projects.tags.community', 'projects.tags.engagement'],
      status: 'beta',
      image: '/images/projects/UTAAB_UBP.webp',
      href: '/projects/ubpoint',
    },
    {
      titleKey: 'projects.tonra.title',
      descriptionKey: 'projects.tonra.description',
      tags: ['projects.tags.ton', 'projects.tags.research', 'projects.tags.academic'],
      status: 'beta',
      image: '/images/projects/UTAAB_TonRa.webp',
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
            const cardInner = (
              <GlassCard className="relative overflow-hidden h-full p-0 group flex flex-col">
                {/* Layer 1: Grid background */}
                <div
                  className="absolute inset-0 z-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, hsl(213 94% 68% / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(213 94% 68% / 0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Layer 2: 3D image */}
                <AnimatedImage
                  src={project.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  sizes="(max-width: 639px) 72vw, 240px"
                  containerClassName="absolute bottom-2 right-2 w-[72%] sm:w-[62%] md:w-[58%] h-[46%] z-10 opacity-[0.9]"
                  className="w-full h-full object-contain object-bottom transition-[filter,transform] duration-500 group-hover:scale-105 pointer-events-none select-none drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)] group-hover:drop-shadow-[0_12px_36px_rgba(59,130,246,0.32)]"
                  placeholderClassName="opacity-0"
                />


                {/* Layer 3: Dark gradient overlay */}
                <div
                  className="absolute inset-0 z-20"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.25) 70%, transparent 100%)',
                  }}
                />

                {project.href && (
                  <div className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-primary/30 group-hover:border-primary/40 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-foreground" />
                  </div>
                )}

                {/* Layer 4: Text content */}
                <div className="relative z-30 p-5 sm:p-6 flex flex-col h-full">
                  <div className="mb-3">
                    <span
                      className={`text-[11px] font-semibold ${
                        project.status === 'beta'
                          ? 'text-emerald-400'
                          : project.status === 'underDevelopment'
                          ? 'text-accent'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {t(`projects.status.${project.status}`)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">
                    {t(project.titleKey)}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4 break-words overflow-hidden">
                    {t(project.descriptionKey)}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto text-[11px] text-muted-foreground">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex}>
                        {tagIndex > 0 && <span className="text-white/20 mr-1.5">•</span>}
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

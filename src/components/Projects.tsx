import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';

type ProjectStatus = 'underDevelopment' | 'planning';

interface Project {
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  status: ProjectStatus;
  image: string;
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
      status: 'underDevelopment',
      image: '/images/projects/UTAAB_UBP.png',
    },
    {
      titleKey: 'projects.tonra.title',
      descriptionKey: 'projects.tonra.description',
      tags: ['projects.tags.ton', 'projects.tags.research', 'projects.tags.academic'],
      status: 'underDevelopment',
      image: '/images/projects/UTAAB_TonRa.png',
    },
    {
      titleKey: 'projects.asn.title',
      descriptionKey: 'projects.asn.description',
      tags: ['projects.tags.payments', 'projects.tags.blockchain', 'projects.tags.university'],
      status: 'planning',
      image: '/images/projects/UTAAB_ASN.png',
    },
    {
      titleKey: 'projects.dvs.title',
      descriptionKey: 'projects.dvs.description',
      tags: ['projects.tags.identity', 'projects.tags.validation', 'projects.tags.nodes'],
      status: 'planning',
      image: '/images/projects/UTAAB_DVS.png',
    },
    {
      titleKey: 'projects.did.title',
      descriptionKey: 'projects.did.description',
      tags: ['projects.tags.identity', 'projects.tags.privacy', 'projects.tags.layer2'],
      status: 'planning',
      image: '/images/projects/UTAAB_DID.png',
    },
    {
      titleKey: 'projects.dao.title',
      descriptionKey: 'projects.dao.description',
      tags: ['projects.tags.governance', 'projects.tags.dao', 'projects.tags.community'],
      status: 'planning',
      image: '/images/projects/UTAAB_DAO.png',
    },
  ];

  return (
    <section id="projects" className="py-20 md:py-32 relative" ref={ref}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.07 }}
            >
              <GlassCard className="relative overflow-hidden min-h-[260px] p-0 group flex flex-col">
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
                  className="absolute bottom-0 right-0 w-[55%] z-10 opacity-[0.85] object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
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

                {/* Layer 4: Text content */}
                <div className="relative z-30 p-5 sm:p-6 flex flex-col h-full">
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        project.status === 'underDevelopment'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      {t(`projects.status.${project.status}`)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">
                    {t(project.titleKey)}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                    {t(project.descriptionKey)}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.06] border border-white/[0.08] text-muted-foreground"
                      >
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

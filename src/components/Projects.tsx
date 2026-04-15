import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Coins, Search, CreditCard, ShieldCheck, Fingerprint, Community } from 'iconoir-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/glass/GlassCard';

type ProjectStatus = 'underDevelopment' | 'planning';

interface Project {
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  status: ProjectStatus;
  icon: React.ElementType;
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
      icon: Coins,
    },
    {
      titleKey: 'projects.tonra.title',
      descriptionKey: 'projects.tonra.description',
      tags: ['projects.tags.ton', 'projects.tags.research', 'projects.tags.academic'],
      status: 'underDevelopment',
      icon: Search,
    },
    {
      titleKey: 'projects.asn.title',
      descriptionKey: 'projects.asn.description',
      tags: ['projects.tags.payments', 'projects.tags.blockchain', 'projects.tags.university'],
      status: 'planning',
      icon: CreditCard,
    },
    {
      titleKey: 'projects.dvs.title',
      descriptionKey: 'projects.dvs.description',
      tags: ['projects.tags.identity', 'projects.tags.validation', 'projects.tags.nodes'],
      status: 'planning',
      icon: ShieldCheck,
    },
    {
      titleKey: 'projects.did.title',
      descriptionKey: 'projects.did.description',
      tags: ['projects.tags.identity', 'projects.tags.privacy', 'projects.tags.layer2'],
      status: 'planning',
      icon: Fingerprint,
    },
    {
      titleKey: 'projects.dao.title',
      descriptionKey: 'projects.dao.description',
      tags: ['projects.tags.governance', 'projects.tags.dao', 'projects.tags.community'],
      status: 'planning',
      icon: Community,
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
              <GlassCard hover className="p-5 sm:p-6 group flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                   <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors icon-glow">
                     <project.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                   </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold mb-1 ${
                        project.status === 'underDevelopment'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      {t(`projects.status.${project.status}`)}
                    </span>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                      {t(project.titleKey)}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                  {t(project.descriptionKey)}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.06] border border-white/[0.08] text-muted-foreground"
                    >
                      {t(tag)}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProjectStatus = 'underDevelopment' | 'planning';

interface Project {
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  status: ProjectStatus;
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
    },
    {
      titleKey: 'projects.tonra.title',
      descriptionKey: 'projects.tonra.description',
      tags: ['projects.tags.ton', 'projects.tags.research', 'projects.tags.academic'],
      status: 'underDevelopment',
    },
    {
      titleKey: 'projects.asn.title',
      descriptionKey: 'projects.asn.description',
      tags: ['projects.tags.payments', 'projects.tags.blockchain', 'projects.tags.university'],
      status: 'planning',
    },
    {
      titleKey: 'projects.dvs.title',
      descriptionKey: 'projects.dvs.description',
      tags: ['projects.tags.identity', 'projects.tags.validation', 'projects.tags.nodes'],
      status: 'planning',
    },
    {
      titleKey: 'projects.ubpoint.title',
      descriptionKey: 'projects.ubpoint.description',
      tags: ['projects.tags.rewards', 'projects.tags.students', 'projects.tags.engagement'],
      status: 'planning',
    },
    {
      titleKey: 'projects.did.title',
      descriptionKey: 'projects.did.description',
      tags: ['projects.tags.identity', 'projects.tags.privacy', 'projects.tags.layer2'],
      status: 'planning',
    },
    {
      titleKey: 'projects.dao.title',
      descriptionKey: 'projects.dao.description',
      tags: ['projects.tags.governance', 'projects.tags.dao', 'projects.tags.community'],
      status: 'planning',
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
              className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] rounded-[28px] p-6 sm:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div className="mb-3 sm:mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    project.status === 'underDevelopment'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {t(`projects.status.${project.status}`)}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                {t(project.titleKey)}
              </h3>

              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-grow">
                {t(project.descriptionKey)}
              </p>

              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-white/[0.08] backdrop-blur-sm border border-white/[0.1]"
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>

              <Button variant="outline" className="bg-white/[0.06] border-white/[0.12] hover:bg-white/10 w-full group/btn min-h-[44px]">
                <span className="flex items-center justify-center gap-2">
                  {t('projects.viewProject')}
                  {project.status === 'planning' && (
                    <span className="text-xs text-muted-foreground font-normal opacity-60">
                      {t('projects.soon')}
                    </span>
                  )}
                  <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

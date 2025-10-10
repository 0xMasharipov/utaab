import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Projects = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Example projects
  const projects = [
    {
      titleKey: 'projects.project1.title',
      descriptionKey: 'projects.project1.description',
      tags: ['projects.tags.defi', 'projects.tags.layer2', 'projects.tags.identity'],
      statusKey: 'projects.status.planning',
    },
    {
      titleKey: 'projects.project2.title',
      descriptionKey: 'projects.project2.description',
      tags: ['projects.tags.nft', 'projects.tags.web3', 'projects.tags.marketplace'],
      statusKey: 'projects.status.planning',
    },
    {
      titleKey: 'projects.project3.title',
      descriptionKey: 'projects.project3.description',
      tags: ['projects.tags.dao', 'projects.tags.governance', 'projects.tags.smartContracts'],
      statusKey: 'projects.status.planning',
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 group flex flex-col"
            >
              <div className="mb-3 sm:mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    project.statusKey === 'projects.status.active'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {t(project.statusKey)}
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
                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm glass-strong"
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>

              <Button variant="outline" className="glass hover:bg-white/10 w-full group/btn min-h-[44px]">
                {t('projects.viewProject')}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

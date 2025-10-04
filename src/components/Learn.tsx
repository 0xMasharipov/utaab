import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Video, GraduationCap } from 'lucide-react';

export const Learn = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const resources = [
    {
      icon: BookOpen,
      title: t('learn.guides'),
      description: 'Comprehensive guides for blockchain development',
    },
    {
      icon: Video,
      title: t('learn.tutorials'),
      description: 'Step-by-step video tutorials',
    },
    {
      icon: GraduationCap,
      title: t('learn.workshops'),
      description: 'Hands-on learning experiences',
    },
  ];

  return (
    <section id="learn" className="py-20 md:py-32 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow-soft">
            {t('learn.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('learn.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glass rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
            >
              <resource.icon className="h-16 w-16 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-foreground mb-3">{resource.title}</h3>
              <p className="text-muted-foreground">{resource.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

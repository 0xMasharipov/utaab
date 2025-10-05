import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Target, Lightbulb } from 'lucide-react';

export const Community = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Users,
      titleKey: 'community.features.collaborative.title',
      descriptionKey: 'community.features.collaborative.description',
    },
    {
      icon: Target,
      titleKey: 'community.features.goalOriented.title',
      descriptionKey: 'community.features.goalOriented.description',
    },
    {
      icon: Lightbulb,
      titleKey: 'community.features.innovative.title',
      descriptionKey: 'community.features.innovative.description',
    },
  ];

  return (
    <section id="community" className="py-20 md:py-32 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glow-soft px-2">
            {t('community.title')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-accent font-semibold mb-3 sm:mb-4 px-2">
            {t('community.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">Our Mission</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('community.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">Our Vision</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('community.vision')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <feature.icon className="h-12 w-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold mb-2 text-foreground">{t(feature.titleKey)}</h4>
              <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

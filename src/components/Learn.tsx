import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';

export const Learn = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  const resources = [
    {
      image: '/images/learn/UTAAB_Edu_Guides.webp',
      title: t('learn.guides'),
      description: t('learn.guidesDescription'),
      path: '/learn/guides',
    },
    {
      image: '/images/learn/UTAAB_Video_Tutorials.webp',
      title: t('learn.tutorials'),
      description: t('learn.tutorialsDescription'),
      path: '/education',
    },
    {
      image: '/images/learn/UTAAB_Workshops_Bootcamps.webp',
      title: t('learn.workshops'),
      description: t('learn.workshopsDescription'),
      path: '/learn/workshops',
    },
  ];

  return (
    <section id="learn" className="py-16 md:py-24 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glow-soft px-2">
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
              onClick={() => navigate(resource.path)}
              className="cursor-pointer"
            >
              <GlassCard hover className="relative overflow-hidden min-h-[280px] h-full group p-0">
                {/* Layer 1: Grid background */}
                <div
                  className="absolute inset-0 z-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, hsl(213 94% 68%) 1px, transparent 1px), linear-gradient(to bottom, hsl(213 94% 68%) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                  aria-hidden="true"
                />

                {/* Layer 2: 3D Image */}
                <AnimatedImage
                  src={resource.image}
                  alt=""
                  aria-hidden="true"
                  containerClassName="absolute bottom-0 right-0 w-[65%] h-auto z-10 translate-x-[5%] translate-y-[5%]"
                  className="w-full h-full object-contain transition-[filter,transform] duration-500 group-hover:scale-105 drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)] group-hover:drop-shadow-[0_12px_36px_rgba(59,130,246,0.32)]"
                  loading="lazy"
                  placeholderClassName="opacity-0"
                />

                {/* Layer 3: Gradient overlay */}
                <div
                  className="absolute inset-0 z-20"
                  style={{
                    background:
                      'linear-gradient(to top, hsl(217 50% 8% / 0.8) 0%, hsl(217 50% 8% / 0.5) 40%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Layer 4: Text content */}
                <div className="relative z-30 p-6 sm:p-8 flex flex-col h-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground">{resource.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

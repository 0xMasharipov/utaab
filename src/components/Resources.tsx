import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';

export const Resources = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const resources = [
    {
      image: '/images/resources/UTAAB_Documentation.webp',
      title: t('resources.documentationTitle'),
      cardHref: '/learn/guides',
      items: [
        { key: 'resources.docs.gettingStarted', href: '/learn' },
        { key: 'resources.docs.blockchainBasics', href: '/learn/guides#start-here' },
        { key: 'resources.docs.smartContractTutorial', href: '/learn/guides#ethereum' },
        { key: 'resources.docs.securityBestPractices', href: '/learn/guides#build' },
      ],
    },
    {
      image: '/images/resources/UTAAB_Dev_Tools.webp',
      title: t('resources.toolsTitle'),
      cardHref: '/resources#developers',
      items: [
        { key: 'resources.toolsItems.devEnvironment', href: '/resources#developers' },
        { key: 'resources.toolsItems.testingFrameworks', href: '/resources#developers' },
        { key: 'resources.toolsItems.deploymentTools', href: '/resources#developers' },
        { key: 'resources.toolsItems.codeTemplates', href: '/resources#developers' },
      ],
    },
    {
      image: '/images/resources/UTAAB_Research_Papers.webp',
      title: t('resources.researchTitle'),
      cardHref: '/whitepaper',
      items: [
        { key: 'resources.researchItems.layer2Scaling', href: '/whitepaper' },
        { key: 'resources.researchItems.consensusMechanisms', href: '/whitepaper' },
        { key: 'resources.researchItems.defiProtocols', href: '/whitepaper' },
        { key: 'resources.researchItems.zkProofs', href: '/whitepaper' },
      ],
    },
  ];

  const goTo = (href: string) => {
    if (href.startsWith('/') && href.includes('#')) {
      const [path, hash] = href.split('#');
      navigate(path);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    } else {
      navigate(href);
    }
  };

  return (
    <section id="resources" className="py-20 md:py-32 relative cv-auto" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glow-soft px-2">
            {t('resources.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {t('resources.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden min-h-[240px] p-0 group">
                {/* Layer 1: Grid background */}
                <div
                  className="absolute inset-0 z-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, hsl(213 94% 68% / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(213 94% 68% / 0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Layer 2: Subtle background visual */}
                <AnimatedImage
                  src={resource.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  containerClassName="absolute bottom-0 right-0 w-[40%] z-[5] opacity-[0.12] blur-[1px]"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  placeholderClassName="opacity-0"
                />

                {/* Layer 3: Dark gradient overlay */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.30) 50%, transparent 100%)',
                  }}
                />

                {/* Layer 4: Content */}
                <div className="relative z-20 p-6 sm:p-8">
                  <AnimatedImage
                    src={resource.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    containerClassName="inline-block"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-4 sm:mb-6 group-hover:scale-105 transition-[filter,transform] duration-300 drop-shadow-[0_6px_18px_rgba(59,130,246,0.25)] group-hover:drop-shadow-[0_10px_28px_rgba(59,130,246,0.4)]"
                    placeholderClassName="opacity-0"
                  />
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">{resource.title}</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {resource.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <button
                          onClick={() => goTo(item.href)}
                          className="text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors text-left w-full py-1"
                        >
                          • {t(item.key)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

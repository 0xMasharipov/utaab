import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
export const Resources = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const resources = [
    {
      image: '/images/resources/UTAAB_Documentation.png',
      title: t('resources.documentationTitle'),
      items: [
        'resources.docs.gettingStarted',
        'resources.docs.blockchainBasics',
        'resources.docs.smartContractTutorial',
        'resources.docs.securityBestPractices',
      ],
    },
    {
      image: '/images/resources/UTAAB_Dev_Tools.png',
      title: t('resources.toolsTitle'),
      items: [
        'resources.toolsItems.devEnvironment',
        'resources.toolsItems.testingFrameworks',
        'resources.toolsItems.deploymentTools',
        'resources.toolsItems.codeTemplates',
      ],
    },
    {
      image: '/images/resources/UTAAB_Research_Papers.png',
      title: t('resources.researchTitle'),
      items: [
        'resources.researchItems.layer2Scaling',
        'resources.researchItems.consensusMechanisms',
        'resources.researchItems.defiProtocols',
        'resources.researchItems.zkProofs',
      ],
    },
  ];

  return (
    <section id="resources" className="py-20 md:py-32 relative" ref={ref}>
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
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <resource.icon className="h-10 w-10 sm:h-12 sm:w-12 text-accent mb-4 sm:mb-6 group-hover:scale-110 transition-transform icon-glow" strokeWidth={1.5} />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">{resource.title}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {resource.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button className="text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors text-left w-full py-1">
                      • {t(item)}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

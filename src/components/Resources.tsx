import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, Code, BookMarked } from 'lucide-react';

export const Resources = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const resources = [
    {
      icon: FileText,
      title: t('resources.documentation'),
      items: [
        'Getting Started Guide',
        'Blockchain Basics',
        'Smart Contract Tutorial',
        'Security Best Practices',
      ],
    },
    {
      icon: Code,
      title: t('resources.tools'),
      items: [
        'Development Environment Setup',
        'Testing Frameworks',
        'Deployment Tools',
        'Code Templates',
      ],
    },
    {
      icon: BookMarked,
      title: t('resources.research'),
      items: [
        'Layer 2 Scaling Solutions',
        'Consensus Mechanisms',
        'DeFi Protocols',
        'Zero-Knowledge Proofs',
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow-soft">
            {t('resources.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
              className="glass rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <resource.icon className="h-12 w-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-foreground mb-6">{resource.title}</h3>
              <ul className="space-y-3">
                {resource.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button className="text-muted-foreground hover:text-accent transition-colors text-left w-full">
                      • {item}
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

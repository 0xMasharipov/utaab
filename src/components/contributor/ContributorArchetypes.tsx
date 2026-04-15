import { motion } from 'framer-motion';
import { Hammer, Search, Settings, Group, Palette, LightBulb } from 'iconoir-react';
import GlassCard from '@/components/glass/GlassCard';
import { useTranslation } from 'react-i18next';

const ContributorArchetypes = () => {
  const { t } = useTranslation();

  const archetypes = [
    {
      icon: Hammer,
      name: t('contributor.archetypes.builder'),
      description: t('contributor.archetypes.builderDesc'),
      roles: [t('contributor.archetypes.roles.frontend'), t('contributor.archetypes.roles.backend'), t('contributor.archetypes.roles.smartContract'), t('contributor.archetypes.roles.product')],
    },
    {
      icon: Search,
      name: t('contributor.archetypes.researcher'),
      description: t('contributor.archetypes.researcherDesc'),
      roles: [t('contributor.archetypes.roles.research'), t('contributor.archetypes.roles.analytics'), t('contributor.archetypes.roles.education')],
    },
    {
      icon: Settings,
      name: t('contributor.archetypes.operator'),
      description: t('contributor.archetypes.operatorDesc'),
      roles: [t('contributor.archetypes.roles.operations'), t('contributor.archetypes.roles.strategy'), t('contributor.archetypes.roles.events')],
    },
    {
      icon: Group,
      name: t('contributor.archetypes.connector'),
      description: t('contributor.archetypes.connectorDesc'),
      roles: [t('contributor.archetypes.roles.community'), t('contributor.archetypes.roles.partnerships'), t('contributor.archetypes.roles.events')],
    },
    {
      icon: Palette,
      name: t('contributor.archetypes.creator'),
      description: t('contributor.archetypes.creatorDesc'),
      roles: [t('contributor.archetypes.roles.design'), t('contributor.archetypes.roles.content')],
    },
    {
      icon: LightBulb,
      name: t('contributor.archetypes.strategist'),
      description: t('contributor.archetypes.strategistDesc'),
      roles: [t('contributor.archetypes.roles.strategy'), t('contributor.archetypes.roles.product'), t('contributor.archetypes.roles.partnerships')],
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('contributor.archetypes.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('contributor.archetypes.subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archetypes.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover className="p-7 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <a.icon className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{a.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{a.description}</p>
                <div className="flex flex-wrap gap-2">
                  {a.roles.map((role) => (
                    <span key={role} className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-secondary border border-white/[0.08]">
                      {role}
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

export default ContributorArchetypes;

import { motion } from 'framer-motion';
import GlassCard from '@/components/glass/GlassCard';
import { useTranslation } from 'react-i18next';
import { EYEBROW, SECTION_TITLE, SECTION_SUBTITLE } from '@/lib/designTokens';

const ContributorArchetypes = () => {
  const { t } = useTranslation();

  const archetypes = [
    {
      name: t('contributor.archetypes.builder'),
      description: t('contributor.archetypes.builderDesc'),
      roles: [t('contributor.archetypes.roles.frontend'), t('contributor.archetypes.roles.backend'), t('contributor.archetypes.roles.smartContract'), t('contributor.archetypes.roles.product')],
    },
    {
      name: t('contributor.archetypes.researcher'),
      description: t('contributor.archetypes.researcherDesc'),
      roles: [t('contributor.archetypes.roles.research'), t('contributor.archetypes.roles.analytics'), t('contributor.archetypes.roles.education')],
    },
    {
      name: t('contributor.archetypes.operator'),
      description: t('contributor.archetypes.operatorDesc'),
      roles: [t('contributor.archetypes.roles.operations'), t('contributor.archetypes.roles.strategy'), t('contributor.archetypes.roles.events')],
    },
    {
      name: t('contributor.archetypes.connector'),
      description: t('contributor.archetypes.connectorDesc'),
      roles: [t('contributor.archetypes.roles.community'), t('contributor.archetypes.roles.partnerships'), t('contributor.archetypes.roles.events')],
    },
    {
      name: t('contributor.archetypes.creator'),
      description: t('contributor.archetypes.creatorDesc'),
      roles: [t('contributor.archetypes.roles.design'), t('contributor.archetypes.roles.content')],
    },
    {
      name: t('contributor.archetypes.strategist'),
      description: t('contributor.archetypes.strategistDesc'),
      roles: [t('contributor.archetypes.roles.strategy'), t('contributor.archetypes.roles.product'), t('contributor.archetypes.roles.partnerships')],
    },
  ];

  return (
    <section className="py-20 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <div className={`${EYEBROW} mb-4`}>02 — {t('contributor.archetypes.title')}</div>
          <h2 className={SECTION_TITLE}>{t('contributor.archetypes.title')}</h2>
          <p className={`${SECTION_SUBTITLE} mt-4`}>{t('contributor.archetypes.subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {archetypes.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard variant="subtle" hover className="p-7 h-full flex flex-col">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-extralight text-foreground/30 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{a.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{a.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                  {a.roles.map((role) => (
                    <span
                      key={role}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] text-muted-foreground border border-white/[0.06]"
                    >
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

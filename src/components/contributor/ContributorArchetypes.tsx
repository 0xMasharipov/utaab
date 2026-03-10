import { motion } from 'framer-motion';
import { Hammer, Search, Settings, Users, Palette, Lightbulb } from 'lucide-react';
import GlassCard from '@/components/glass/GlassCard';

const archetypes = [
  {
    icon: Hammer,
    name: 'Builder',
    description: 'You love creating things from scratch — apps, smart contracts, or tools. You thrive when turning ideas into reality.',
    roles: ['Frontend Development', 'Backend Development', 'Smart Contract / Blockchain Development', 'Product'],
  },
  {
    icon: Search,
    name: 'Researcher',
    description: 'Deep analysis and understanding drive you. You enjoy exploring new protocols, reading whitepapers, and sharing insights.',
    roles: ['Research', 'Analytics', 'Education / Workshops'],
  },
  {
    icon: Settings,
    name: 'Operator',
    description: 'You keep things running smoothly. Organization, processes, and efficiency are your strengths.',
    roles: ['Operations', 'Strategy', 'Events & Ecosystem'],
  },
  {
    icon: Users,
    name: 'Connector',
    description: 'Building relationships and growing communities energize you. You naturally bring people together.',
    roles: ['Community & Growth', 'Partnerships', 'Events & Ecosystem'],
  },
  {
    icon: Palette,
    name: 'Creator',
    description: 'Visual storytelling and content production are your superpowers. You make complex ideas accessible and beautiful.',
    roles: ['Design', 'Content & Media'],
  },
  {
    icon: Lightbulb,
    name: 'Strategist',
    description: 'You see the big picture and plan the roadmap. Strategic thinking and decision-making come naturally to you.',
    roles: ['Strategy', 'Product', 'Partnerships'],
  },
];

const ContributorArchetypes = () => {
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
            Where People Like You Thrive in UTAAB
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Discover which archetype resonates with you.</p>
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
                  <a.icon className="w-6 h-6 text-secondary" />
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

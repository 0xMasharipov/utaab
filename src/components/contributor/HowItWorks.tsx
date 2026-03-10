import { motion } from 'framer-motion';
import { ClipboardList, Brain, Target } from 'lucide-react';
import GlassCard from '@/components/glass/GlassCard';

const steps = [
  {
    icon: ClipboardList,
    title: 'Answer Questions',
    description: 'Share your interests, skills, and working style through a short multi-step assessment.',
  },
  {
    icon: Brain,
    title: 'AI Analyzes Your Profile',
    description: 'Our AI engine evaluates your responses to identify your strengths and ideal contribution area.',
  },
  {
    icon: Target,
    title: 'Get Your Role Match',
    description: 'Receive a personalized recommendation for the best contributor role inside UTAAB.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Three simple steps to discover your ideal contributor role.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard hover glow className="p-8 h-full text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-7 h-7 text-secondary" />
                </div>
                <div className="text-sm font-semibold text-secondary mb-2 tracking-wider uppercase">Step {i + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

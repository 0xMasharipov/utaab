import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
}

const StatItem = ({ value, label, suffix = '+' }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 text-foreground"
        style={{
          textShadow: '0 0 18px rgba(126,179,234,0.35), 0 0 38px rgba(47,128,237,0.22)',
        }}
      >
        {count}{suffix}
      </div>
      <div className="text-base sm:text-lg md:text-xl text-muted-foreground lang-transition">{label}</div>
    </motion.div>
  );
};

export const Stats = () => {
  const { t } = useTranslation();

  const stats = [
    { value: 500, label: t('stats.members'), suffix: '+' },
    { value: 20, label: t('stats.projects'), suffix: '+' },
    { value: 15, label: t('stats.events'), suffix: '+' },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="section-container">
        <div
          className="rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16"
          style={{
            background: 'rgba(9, 20, 34, 0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

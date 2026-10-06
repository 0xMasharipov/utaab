import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { JoinForm } from './JoinForm';

export const Join = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="join" className="relative scroll-mt-24 py-20 md:py-32" ref={ref}>
      <div aria-hidden className="join-aura pointer-events-none absolute inset-0" />
      <div className="section-container relative">
        <motion.div
          id="join-form"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-2xl"
        >
          <JoinForm />
        </motion.div>
      </div>
    </section>
  );
};

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import utaabMarkAsset from '@/assets/utaab-mark.png.asset.json';

const utaabMark = utaabMarkAsset.url;

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function AnimatedUtaabMark() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return <div ref={ref} className={`cm-brand ${visible ? 'cm-brand-active' : ''}`} aria-hidden="true">
    <div className="cm-brand-core"><img src={utaabMark} alt="" width={138} height={144} draggable={false} /></div>
  </div>;
}

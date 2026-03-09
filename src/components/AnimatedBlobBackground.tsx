import { useState, useEffect, useRef } from 'react';

const AnimatedBlobBackground = () => {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1 — Full-page vertical gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            #ffffff 0%,
            #f5f8fc 12%,
            #ebf2f9 24%,
            #dbe8f5 38%,
            #bdd5ef 52%,
            #7fb2e8 68%,
            #2f80ed 82%,
            #10263d 92%,
            #081624 100%
          )`,
        }}
      />

      {/* Layer 2 — Atmospheric radial glows with parallax */}
      <div
        className="absolute w-[700px] h-[700px] opacity-30 animate-blob-1"
        style={{
          background: 'radial-gradient(circle, rgba(47,128,237,0.28) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '15%',
          right: '5%',
          transform: `translateY(${scrollY * -0.08}px)`,
          willChange: 'transform',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] opacity-25 animate-blob-2"
        style={{
          background: 'radial-gradient(circle, rgba(126,179,234,0.16) 0%, transparent 70%)',
          filter: 'blur(90px)',
          top: '40%',
          left: '5%',
          transform: `translateY(${scrollY * -0.15}px)`,
          willChange: 'transform',
        }}
      />
      <div
        className="absolute w-[550px] h-[550px] opacity-20 animate-blob-3"
        style={{
          background: 'radial-gradient(circle, rgba(30,90,180,0.18) 0%, transparent 70%)',
          filter: 'blur(85px)',
          top: '65%',
          left: '40%',
          transform: `translateY(${scrollY * -0.22}px)`,
          willChange: 'transform',
        }}
      />

      {/* Layer 3 — Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-grain" />
    </div>
  );
};

export default AnimatedBlobBackground;

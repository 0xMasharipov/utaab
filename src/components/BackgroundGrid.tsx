import { ReactNode } from 'react';

interface BackgroundGridProps {
  children: ReactNode;
}

const BackgroundGrid = ({ children }: BackgroundGridProps) => {
  return (
    <div className="relative rounded-b-3xl overflow-hidden">
      {/* Grid layer */}
      <div
        className="absolute inset-0 pointer-events-none bg-technical-grid"
        aria-hidden="true"
      />
      {/* Top fade mask */}
      <div
        className="absolute inset-x-0 top-0 h-[200px] pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, hsl(217 50% 6%) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      {/* Bottom fade mask */}
      <div
        className="absolute inset-x-0 bottom-0 h-[120px] pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to top, hsl(217 50% 6%) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      {/* Radial vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, hsl(217 50% 6% / 0.6) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundGrid;

import { ReactNode } from 'react';

interface BackgroundGridProps {
  children: ReactNode;
}

const BackgroundGrid = ({ children }: BackgroundGridProps) => {
  return (
    <div className="relative -mt-px rounded-b-3xl overflow-hidden bg-background">
      {/* Grid layer */}
      <div
        className="absolute inset-0 pointer-events-none bg-technical-grid"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.28) 72px, black 220px)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.28) 72px, black 220px)',
        }}
        aria-hidden="true"
      />
      {/* Keep the first part of the handoff calm while the grid resolves below it. */}
      <div
        className="absolute inset-x-0 top-0 h-[220px] pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.72) 42%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      {/* Bottom fade mask */}
      <div
        className="absolute inset-x-0 bottom-0 h-[120px] pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      {/* Radial vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, hsl(var(--background) / 0.6) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundGrid;

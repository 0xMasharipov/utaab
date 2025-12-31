import { useMemo } from 'react';

interface LedBulb {
  id: number;
  color: string;
  glowColor: string;
  size: number;
  delay: number;
  duration: number;
  isConstant: boolean;
  positionPercent: number;
  verticalOffset: number;
}

const BULB_COLORS = [
  { color: '#ff5c5c', glow: 'rgba(255, 92, 92, 0.6)' },   // Red
  { color: '#4ade80', glow: 'rgba(74, 222, 128, 0.6)' },  // Green
  { color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.6)' },  // Blue
  { color: '#fde047', glow: 'rgba(253, 224, 71, 0.6)' },  // Yellow
  { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.6)' }, // Purple
  { color: '#ffd6a5', glow: 'rgba(255, 214, 165, 0.6)' }, // Warm white
];

export const ChristmasLights = () => {
  const bulbs = useMemo<LedBulb[]>(() => {
    const bulbCount = 20;
    return Array.from({ length: bulbCount }, (_, i) => {
      const colorData = BULB_COLORS[Math.floor(Math.random() * BULB_COLORS.length)];
      return {
        id: i,
        color: colorData.color,
        glowColor: colorData.glow,
        size: 6 + Math.random() * 4,
        delay: Math.random() * 4,
        duration: 1.8 + Math.random() * 1.4,
        isConstant: Math.random() > 0.8,
        positionPercent: (i / (bulbCount - 1)) * 100,
        verticalOffset: Math.sin((i / bulbCount) * Math.PI * 2) * 3,
      };
    });
  }, []);

  return (
    <div className="relative w-full h-6" aria-hidden="true">
      {/* Wire */}
      <svg 
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 24"
      >
        <path
          d="M 0 12 Q 25 8, 50 12 T 100 12"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      
      {/* Bulbs */}
      {bulbs.map((bulb) => (
        <div
          key={bulb.id}
          className="absolute led-bulb"
          style={{
            left: `${bulb.positionPercent}%`,
            top: `calc(50% + ${bulb.verticalOffset}px)`,
            transform: 'translate(-50%, -50%)',
            width: bulb.size,
            height: bulb.size,
            borderRadius: '50%',
            backgroundColor: bulb.color,
            boxShadow: `
              0 0 ${bulb.size}px 2px ${bulb.glowColor},
              0 0 ${bulb.size * 2}px 4px ${bulb.glowColor.replace('0.6', '0.3')}
            `,
            animationName: bulb.isConstant ? 'none' : 'led-pulse',
            animationDuration: `${bulb.duration}s`,
            animationDelay: `${bulb.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  );
};

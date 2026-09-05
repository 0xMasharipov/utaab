import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type OrbitDirection = 'clockwise' | 'counterclockwise';
export type OrbitFadeMode = 'in' | 'out' | 'none';

export interface OrbitalTeamBackdropProps {
  rows: string[][];
  circleSize?: number;
  baseRadius?: number;
  orbitGap?: number;
  rotationDuration?: number;
  rowDelay?: number;
  direction?: OrbitDirection;
  alternateDirection?: boolean;
  fadeMode?: OrbitFadeMode;
  fadeBlur?: boolean;
  showPaths?: boolean;
  animate?: boolean;
  animationDuration?: number;
  animationStagger?: number;
  staggerScaleFactor?: number;
  className?: string;
}

const getDirection = (
  rowIndex: number,
  direction: OrbitDirection,
  alternateDirection: boolean,
) => {
  const baseDirection = direction === 'clockwise' ? 1 : -1;
  return alternateDirection && rowIndex % 2 === 1 ? baseDirection * -1 : baseDirection;
};

const getDepth = (rowIndex: number, rowCount: number, fadeMode: OrbitFadeMode) => {
  if (fadeMode === 'none' || rowCount <= 1) return 0;

  const progress = rowIndex / (rowCount - 1);
  return fadeMode === 'out' ? progress : 1 - progress;
};

const OrbitalTeamBackdrop = memo(function OrbitalTeamBackdrop({
  rows,
  circleSize = 64,
  baseRadius = 200,
  orbitGap = 160,
  rotationDuration = 22,
  rowDelay = 6,
  direction = 'clockwise',
  alternateDirection = true,
  fadeMode = 'out',
  fadeBlur = true,
  showPaths = true,
  animate = true,
  animationDuration = 0.7,
  animationStagger = 0.14,
  staggerScaleFactor = 0,
  className,
}: OrbitalTeamBackdropProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden [--orbit-scale:0.58] [mask-image:linear-gradient(to_bottom,black_0%,black_84%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_84%,transparent_100%)] sm:[--orbit-scale:0.74] lg:[--orbit-scale:1]',
        className,
      )}
    >
      <div className="absolute left-1/2 top-[102%] sm:top-[110%] lg:top-[118%]">
        {rows.map((row, rowIndex) => {
          const rowScale = 1 + rowIndex * staggerScaleFactor;
          const radius = (baseRadius + rowIndex * orbitGap) * rowScale;
          const diameter = radius * 2;
          const duration = rotationDuration + rowIndex * rowDelay;
          const rotationSign = getDirection(rowIndex, direction, alternateDirection);
          const targetRotation = rotationSign * 360;
          const depth = getDepth(rowIndex, rows.length, fadeMode);
          const rowOpacity = 1 - depth * 0.35;
          const portraitBlur = fadeBlur ? Math.pow(depth, 1.35) * 8 : 0;

          return (
            <motion.div
              key={`orbit-${rowIndex}`}
              className="absolute"
              initial={reduceMotion || !animate ? false : { opacity: 0, scale: 0.82 }}
              whileInView={{ opacity: rowOpacity, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: reduceMotion ? 0 : animationDuration,
                delay: reduceMotion ? 0 : rowIndex * animationStagger,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: `calc(${diameter}px * var(--orbit-scale))`,
                height: `calc(${diameter}px * var(--orbit-scale))`,
                marginLeft: `calc(${radius * -1}px * var(--orbit-scale))`,
                marginTop: `calc(${radius * -1}px * var(--orbit-scale))`,
              }}
            >
              <motion.div
                className="absolute inset-0 will-change-transform"
                animate={reduceMotion ? undefined : { rotate: targetRotation }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
                }
              >
                {showPaths && (
                  <div className="absolute inset-0 rounded-full border border-dashed border-accent/25" />
                )}

                {row.map((imageUrl, imageIndex) => {
                  const angle = (360 / row.length) * imageIndex - 90;

                  return (
                    <div
                      key={`${imageUrl}-${imageIndex}`}
                      className="absolute left-1/2 top-1/2 h-0 w-0"
                      style={{ transform: `rotate(${angle}deg) translateX(calc(${radius}px * var(--orbit-scale)))` }}
                    >
                      <div style={{ transform: `rotate(${-angle}deg)` }}>
                        <motion.div
                          className="relative overflow-hidden rounded-full border border-accent/40 bg-[hsl(var(--card))] shadow-[0_8px_28px_hsl(217_91%_4%/0.5),inset_0_1px_0_rgb(255_255_255/0.24)] will-change-transform"
                          animate={reduceMotion ? undefined : { rotate: targetRotation * -1 }}
                          transition={
                            reduceMotion
                              ? undefined
                              : { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
                          }
                          style={{
                            width: `calc(${circleSize}px * var(--orbit-scale))`,
                            height: `calc(${circleSize}px * var(--orbit-scale))`,
                            marginLeft: `calc(${circleSize * -0.5}px * var(--orbit-scale))`,
                            marginTop: `calc(${circleSize * -0.5}px * var(--orbit-scale))`,
                            filter: portraitBlur > 0 ? `blur(${portraitBlur}px)` : undefined,
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt=""
                            width={circleSize}
                            height={circleSize}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default OrbitalTeamBackdrop;

import {
  type CSSProperties,
  type ReactNode,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type EcosystemNodeState = 'active' | 'emerging' | 'planned';

export interface NodeItem {
  id: string;
  content?: ReactNode;
  ariaLabel: string;
  state?: EcosystemNodeState;
}

export interface EcosystemFlowProps {
  nodeItems?: NodeItem[];
  centerContent?: ReactNode;
  centerSize?: number;
  nodeSize?: number;
  pulseDuration?: number;
  pulseInterval?: number;
  pulseLength?: number;
  lineWidth?: number;
  pulseWidth?: number;
  pulseSoftness?: number;
  lineColor?: string;
  lineColorLight?: string;
  pulseColor?: string;
  pulseColorLight?: string;
  glowColor?: string;
  glowColorLight?: string;
  maxGlowIntensity?: number;
  glowDecay?: number;
  borderRadius?: number;
  nodeDistance?: number;
  disableBlinking?: boolean;
  className?: string;
}

interface Dimensions {
  width: number;
  height: number;
}

const defaultNodes: NodeItem[] = Array.from({ length: 9 }, (_, index) => ({
  id: `node-${index + 1}`,
  ariaLabel: `Ecosystem node ${index + 1}`,
}));

const stateClasses: Record<EcosystemNodeState, string> = {
  active: 'border-accent/50 bg-[linear-gradient(145deg,hsl(216_47%_13%/0.96),hsl(218_50%_7%/0.92))] text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.13),0_18px_42px_hsl(217_91%_4%/0.5)]',
  emerging: 'border-accent/30 bg-[linear-gradient(145deg,hsl(216_43%_12%/0.9),hsl(218_48%_7%/0.84))] text-foreground/90 shadow-[inset_0_1px_0_rgb(255_255_255/0.09),0_15px_34px_hsl(217_91%_4%/0.4)]',
  planned: 'border-dashed border-white/20 bg-[linear-gradient(145deg,hsl(216_38%_11%/0.82),hsl(218_44%_7%/0.76))] text-foreground/65 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]',
};

const stateOpacity: Record<EcosystemNodeState, number> = {
  active: 0.82,
  emerging: 0.5,
  planned: 0.28,
};

const EcosystemFlow = memo(function EcosystemFlow({
  nodeItems = defaultNodes,
  centerContent,
  centerSize = 120,
  nodeSize = 60,
  pulseDuration = 5,
  pulseInterval = 10,
  pulseLength = 0.4,
  lineWidth = 2,
  pulseWidth = 1,
  pulseSoftness = 10,
  lineColor = '#1c1c1c',
  lineColorLight = '#e0e0e0',
  pulseColor = '#e724eb',
  pulseColorLight = '#e724eb',
  glowColor = '#e724eb',
  glowColorLight = '#e724eb',
  maxGlowIntensity = 25,
  glowDecay = 0.95,
  borderRadius = 35,
  nodeDistance = 0.7,
  disableBlinking = false,
  className,
}: EcosystemFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const reduceMotion = useReducedMotion();
  const filterId = `ecosystem-pulse-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const bounds = container.getBoundingClientRect();
      setDimensions({ width: bounds.width, height: bounds.height });
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const compactScale = dimensions.width > 0 && dimensions.width < 640
      ? Math.max(0.7, Math.min(0.82, dimensions.width / 500))
      : 1;
    const renderedCenterSize = centerSize * compactScale;
    const renderedNodeSize = nodeSize * compactScale;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radiusX = Math.max(0, (dimensions.width - renderedNodeSize - 28) * 0.5 * nodeDistance);
    const radiusY = Math.max(0, (dimensions.height - renderedNodeSize - 28) * 0.5 * nodeDistance);
    const count = Math.max(1, nodeItems.length);

    const nodes = nodeItems.map((item, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const distance = Math.max(1, Math.hypot(deltaX, deltaY));
      const unitX = deltaX / distance;
      const unitY = deltaY / distance;
      const startInset = renderedCenterSize * 0.48;
      const endInset = renderedNodeSize * 0.5;
      const startX = centerX + unitX * startInset;
      const startY = centerY + unitY * startInset;
      const endX = x - unitX * endInset;
      const endY = y - unitY * endInset;
      const curveScale = dimensions.width < 640 ? 0.52 : 1;
      const curveStrength = Math.min(34, Math.max(13, distance * 0.075)) * curveScale;
      const curveDirection = index % 2 === 0 ? 1 : -1;
      const controlX = (startX + endX) / 2 - unitY * curveStrength * curveDirection;
      const controlY = (startY + endY) / 2 + unitX * curveStrength * curveDirection;

      return {
        ...item,
        x,
        y,
        path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
      };
    });

    return {
      centerX,
      centerY,
      radiusX,
      radiusY,
      renderedCenterSize,
      renderedNodeSize,
      nodes,
    };
  }, [centerSize, dimensions, nodeDistance, nodeItems, nodeSize]);

  const flowStyle = {
    '--flow-line-dark': lineColor,
    '--flow-line-light': lineColorLight,
    '--flow-pulse-dark': pulseColor,
    '--flow-pulse-light': pulseColorLight,
    '--flow-glow-dark': glowColor,
    '--flow-glow-light': glowColorLight,
  } as CSSProperties;

  const safePulseLength = Math.min(0.9, Math.max(0.08, pulseLength));
  const repeatDelay = Math.max(0, pulseInterval - pulseDuration);
  const pulseCycle = pulseDuration + repeatDelay;
  const glowDecayDuration = Math.max(0.25, (1 - Math.min(0.99, Math.max(0, glowDecay))) * 10);

  return (
    <div
      ref={containerRef}
      className={cn(
        'ecosystem-flow relative h-[520px] w-full overflow-hidden sm:h-[590px] lg:h-[640px]',
        className,
      )}
      style={flowStyle}
    >
      {dimensions.width > 0 && (
        <>
          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 rounded-full border border-accent/[0.12]"
              style={{
                width: geometry.renderedCenterSize * 1.72,
                height: geometry.renderedCenterSize * 1.72,
                marginLeft: geometry.renderedCenterSize * -0.86,
                marginTop: geometry.renderedCenterSize * -0.86,
              }}
              animate={{ opacity: [0.1, 0.42, 0.1], scale: [0.82, 1.08, 0.82] }}
              transition={{ duration: pulseDuration * 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation={pulseSoftness * 0.45} />
              </filter>
            </defs>

            {[0.48, 0.78].map((scale, index) => (
              <motion.ellipse
                key={scale}
                cx={geometry.centerX}
                cy={geometry.centerY}
                rx={geometry.radiusX * scale}
                ry={geometry.radiusY * scale}
                fill="none"
                pathLength={100}
                stroke="var(--flow-line)"
                strokeWidth={0.75}
                strokeOpacity={0.18 - index * 0.045}
                strokeDasharray={index === 0 ? '1.2 7.5' : '0.8 9'}
                vectorEffect="non-scaling-stroke"
                animate={reduceMotion ? undefined : { strokeDashoffset: [0, index === 0 ? -17.4 : 19.6] }}
                transition={reduceMotion ? undefined : {
                  duration: 16 + index * 7,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}

            {geometry.nodes.map((node, index) => {
              const state = node.state ?? 'active';
              const dashPattern = state === 'planned' ? '2.4 5.8' : undefined;
              const animationDelay = -(index / Math.max(1, geometry.nodes.length)) * pulseCycle;
              const pulseOpacity = state === 'active' ? 0.95 : state === 'emerging' ? 0.68 : 0.38;
              const currentOpacity = state === 'active' ? 0.58 : state === 'emerging' ? 0.4 : 0.26;
              const currentDash = state === 'planned' ? '0.9 7.2' : state === 'emerging' ? '1.25 8.5' : '1.7 9.5';
              const currentTravel = state === 'planned' ? 16.2 : state === 'emerging' ? 19.5 : 22.4;
              const pulseAnimation = {
                strokeDashoffset: [1, -safePulseLength],
              };
              const pulseTransition = {
                duration: pulseDuration,
                delay: animationDelay,
                ease: 'linear' as const,
                repeat: Infinity,
                repeatDelay: repeatDelay + (index % 3) * 0.4,
              };

              return (
                <g key={node.id}>
                  <path
                    data-flow-base={index}
                    d={node.path}
                    fill="none"
                    stroke="var(--flow-line)"
                    strokeWidth={lineWidth}
                    strokeOpacity={stateOpacity[state] * 0.56}
                    strokeDasharray={dashPattern}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {!reduceMotion && (
                    <motion.path
                      data-flow-current={index}
                      d={node.path}
                      fill="none"
                      pathLength={100}
                      stroke="var(--flow-pulse)"
                      strokeWidth={Math.max(0.7, lineWidth * 0.82)}
                      strokeOpacity={currentOpacity}
                      strokeDasharray={currentDash}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -currentTravel }}
                      transition={{
                        duration: 2.8 + (index % 4) * 0.34,
                        delay: -(index * 0.31),
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}
                  {!reduceMotion && (
                    <>
                      <motion.path
                        data-flow-pulse={index}
                        d={node.path}
                        fill="none"
                        pathLength={1}
                        stroke="var(--flow-pulse)"
                        strokeWidth={pulseWidth + pulseSoftness * 0.35}
                        strokeOpacity={pulseOpacity * 0.45}
                        strokeDasharray={`${safePulseLength} 1`}
                        strokeLinecap="round"
                        filter={`url(#${filterId})`}
                        vectorEffect="non-scaling-stroke"
                        animate={pulseAnimation}
                        transition={pulseTransition}
                      />
                      <motion.path
                        data-flow-pulse-core={index}
                        d={node.path}
                        fill="none"
                        pathLength={1}
                        stroke="var(--flow-pulse)"
                        strokeWidth={pulseWidth}
                        strokeOpacity={pulseOpacity}
                        strokeDasharray={`${safePulseLength} 1`}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        animate={pulseAnimation}
                        transition={pulseTransition}
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          <div role="list" aria-label="UTAAB ecosystem" className="absolute inset-0">
            {geometry.nodes.map((node, index) => {
              const state = node.state ?? 'active';
              return (
                <motion.div
                  key={node.id}
                  role="listitem"
                  aria-label={node.ariaLabel}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.52,
                    delay: reduceMotion ? 0 : index * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    'ecosystem-flow-node absolute flex items-center justify-center overflow-hidden border text-center backdrop-blur-xl',
                    stateClasses[state],
                  )}
                  style={{
                    width: geometry.renderedNodeSize,
                    height: geometry.renderedNodeSize,
                    left: node.x - geometry.renderedNodeSize / 2,
                    top: node.y - geometry.renderedNodeSize / 2,
                    borderRadius: Math.min(borderRadius * 0.58, geometry.renderedNodeSize * 0.28),
                  }}
                >
                  <div aria-hidden="true" className="absolute inset-px rounded-[inherit] border border-white/[0.045]" />
                  <div aria-hidden="true" className="absolute left-[18%] right-[18%] top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                  {!reduceMotion && state !== 'planned' && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-[inherit] border border-accent/30"
                      animate={{ opacity: state === 'active' ? [0.12, 0.52, 0.12] : [0.08, 0.3, 0.08] }}
                      transition={{
                        duration: pulseCycle,
                        delay: -(index / Math.max(1, geometry.nodes.length)) * pulseCycle,
                        repeat: Infinity,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  )}
                  <div className="relative z-10 h-full w-full">{node.content}</div>
                </motion.div>
              );
            })}
          </div>

          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 rounded-[30%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--flow-pulse)_75deg,transparent_145deg)] opacity-45"
              style={{
                width: geometry.renderedCenterSize + 12,
                height: geometry.renderedCenterSize + 12,
                marginLeft: (geometry.renderedCenterSize + 12) / -2,
                marginTop: (geometry.renderedCenterSize + 12) / -2,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-[2px] rounded-[inherit] bg-[hsl(217_48%_7%)]" />
            </motion.div>
          )}
          <motion.div
            className="ecosystem-flow-center absolute flex items-center justify-center overflow-hidden border border-accent/55 bg-[linear-gradient(145deg,hsl(216_46%_15%/0.98),hsl(218_54%_7%/0.96))] text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_22px_70px_hsl(217_91%_4%/0.55)] backdrop-blur-2xl"
            style={{
              width: geometry.renderedCenterSize,
              height: geometry.renderedCenterSize,
              left: geometry.centerX - geometry.renderedCenterSize / 2,
              top: geometry.centerY - geometry.renderedCenterSize / 2,
              borderRadius: Math.min(borderRadius, geometry.renderedCenterSize * 0.3),
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden="true" className="absolute inset-px rounded-[inherit] border border-white/[0.08]" />
            <div aria-hidden="true" className="absolute -left-8 -top-10 h-24 w-32 rotate-[-18deg] rounded-full bg-white/[0.065] blur-xl" />
            <motion.div
              aria-hidden="true"
              className="absolute rounded-[inherit] bg-[var(--flow-glow)] blur-2xl"
              style={{ inset: maxGlowIntensity * -0.55 }}
              animate={reduceMotion || disableBlinking ? { opacity: 0.12 } : { opacity: [0.1, 0.3, 0.1] }}
              transition={reduceMotion || disableBlinking ? undefined : {
                duration: pulseDuration + glowDecayDuration,
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                repeatDelay,
              }}
            />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              {centerContent}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
});

export default EcosystemFlow;

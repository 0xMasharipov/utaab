import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export interface CoverflowCarouselProps {
  /** Rendered card contents, one per slide. */
  items: React.ReactNode[];
  /** Same-origin image URLs used to derive the animated gradient backdrop. */
  images?: string[];
  className?: string;
  maxRotationDegrees?: number;
  maxDepthPx?: number;
  minScale?: number;
  cardGap?: number;
  frictionFactor?: number;
  wheelSensitivity?: number;
  dragSensitivity?: number;
  backgroundBlur?: number;
  gradientSize?: number;
  gradientIntensity?: number;
  enableKeyboard?: boolean;
  onCardChange?: (index: number) => void;
  /** width / height. Default 4/5. */
  cardAspectRatio?: number;
  initialIndex?: number;
  ariaLabel?: string;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Average colour of a same-origin image, cached across mounts. */
const colorCache = new Map<string, string>();

const extractDominantColor = (src: string): Promise<string> => {
  const cached = colorCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 16;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve('');
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 24) continue;
          const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Skip near-black pixels so dark artwork backgrounds don't wash the glow out.
          if (lum < 18) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (!count) return resolve('');
        const color = `${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(
          b / count
        )}`;
        colorCache.set(src, color);
        resolve(color);
      } catch {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = src;
  });
};

export const CoverflowCarousel = ({
  items,
  images = [],
  className,
  maxRotationDegrees = 28,
  maxDepthPx = 140,
  minScale = 0.92,
  cardGap = 28,
  frictionFactor = 0.9,
  wheelSensitivity = 0.6,
  dragSensitivity = 1.0,
  backgroundBlur = 24,
  gradientSize = 0.65,
  gradientIntensity = 0.7,
  enableKeyboard = true,
  onCardChange,
  cardAspectRatio = 4 / 5,
  initialIndex = 0,
  ariaLabel = 'Carousel',
}: CoverflowCarouselProps) => {
  const count = items.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [cardWidth, setCardWidth] = useState(300);
  const [activeIndex, setActiveIndex] = useState(
    clamp(initialIndex, 0, Math.max(count - 1, 0))
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colors, setColors] = useState<string[]>([]);

  // Animation state kept in refs so the rAF loop never sees stale closures.
  const offsetRef = useRef(clamp(initialIndex, 0, Math.max(count - 1, 0)));
  const velocityRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const rafRef = useRef<number>();
  const activeRef = useRef(activeIndex);
  const cardWidthRef = useRef(cardWidth);
  cardWidthRef.current = cardWidth;
  const inViewRef = useRef(true);
  const runningRef = useRef(false);
  const [inView, setInView] = useState(true);


  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Responsive card sizing.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const next = w < 640 ? Math.min(w - 64, 300) : clamp(w * 0.32, 280, 380);
      setCardWidth(Math.round(next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dominant colours for the gradient backdrop.
  useEffect(() => {
    let cancelled = false;
    if (!images.length) return;
    Promise.all(images.map(extractDominantColor)).then((res) => {
      if (!cancelled) setColors(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join('|')]);

  const step = cardWidth + cardGap;

  const applyTransforms = useCallback(() => {
    const offset = offsetRef.current;
    for (let i = 0; i < cardRefs.current.length; i++) {
      const node = cardRefs.current[i];
      if (!node) continue;
      const d = i - offset;
      const ad = Math.abs(d);
      const clampedD = clamp(d, -3, 3);
      const rotate = -clampedD * (maxRotationDegrees / 1.6);
      const depth = -Math.min(ad, 3) * (maxDepthPx / 1.6);
      const scale = Math.max(minScale, 1 - Math.min(ad, 3) * (1 - minScale) / 1.4);
      const x = d * (cardWidthRef.current + cardGap);
      const opacity = ad > 3.2 ? 0 : clamp(1 - Math.max(0, ad - 1.4) * 0.42, 0, 1);
      node.style.transform = `translate3d(calc(-50% + ${x}px), 0, 0) perspective(1400px) rotateY(${rotate}deg) translateZ(${depth}px) scale(${scale})`;
      node.style.opacity = String(opacity);
      node.style.zIndex = String(100 - Math.round(ad * 10));
      node.style.pointerEvents = ad > 3.2 ? 'none' : 'auto';
    }
  }, [cardGap, maxDepthPx, maxRotationDegrees, minScale]);

  const setActive = useCallback(
    (idx: number) => {
      if (idx === activeRef.current) return;
      activeRef.current = idx;
      setActiveIndex(idx);
      onCardChange?.(idx);
    },
    [onCardChange]
  );

  // Visibility gate — never burn frames while the carousel is off-screen.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        setInView(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Main animation step: velocity + friction, snapping to the nearest card.
  // Kept in a ref so the loop never closes over stale state, and it stops
  // itself once the carousel settles (no idle rAF churn while scrolling).
  const stepLoop = useRef<() => void>(() => {});
  stepLoop.current = () => {
    const maxIdx = Math.max(count - 1, 0);
    let idle = false;
    if (!draggingRef.current) {
      if (targetRef.current !== null) {
        const diff = targetRef.current - offsetRef.current;
        offsetRef.current += diff * 0.16;
        if (Math.abs(diff) < 0.001) {
          offsetRef.current = targetRef.current;
          targetRef.current = null;
        }
      } else if (Math.abs(velocityRef.current) > 0.0005) {
        offsetRef.current += velocityRef.current;
        velocityRef.current *= frictionFactor;
        offsetRef.current = clamp(offsetRef.current, -0.4, maxIdx + 0.4);
      } else if (velocityRef.current !== 0) {
        velocityRef.current = 0;
        targetRef.current = clamp(Math.round(offsetRef.current), 0, maxIdx);
      } else {
        idle = true;
      }
    }
    applyTransforms();
    setActive(clamp(Math.round(offsetRef.current), 0, maxIdx));
    if (idle) {
      runningRef.current = false;
      return;
    }
    rafRef.current = requestAnimationFrame(() => stepLoop.current());
  };

  const wake = useCallback(() => {
    if (reducedMotion || runningRef.current || !inViewRef.current) return;
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(() => stepLoop.current());
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    wake();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
  }, [inView, reducedMotion, wake]);

  useLayoutEffect(() => {
    applyTransforms();
  }, [applyTransforms, cardWidth, count]);

  const goTo = useCallback(
    (idx: number) => {
      const maxIdx = Math.max(count - 1, 0);
      velocityRef.current = 0;
      targetRef.current = clamp(idx, 0, maxIdx);
      wake();
    },
    [count, wake]
  );


  // Wheel: native non-passive listener (React's onWheel is passive).
  const wheelHandlerRef = useRef<(e: WheelEvent) => void>(() => {});
  wheelHandlerRef.current = (e: WheelEvent) => {
    const dy =
      (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) *
      (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
    if (Math.abs(dy) < 0.5) return;
    e.preventDefault();
    targetRef.current = null;
    velocityRef.current += (dy / (step * 6)) * wheelSensitivity;
    velocityRef.current = clamp(velocityRef.current, -0.35, 0.35);
    wake();
  };


  useEffect(() => {
    const el = viewportRef.current;
    if (!el || reducedMotion) return;
    const onWheel = (e: WheelEvent) => wheelHandlerRef.current(e);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [reducedMotion]);

  // Pointer drag.
  const dragState = useRef({ startX: 0, startOffset: 0, lastX: 0, moved: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (reducedMotion || e.button === 1 || e.button === 2) return;
    draggingRef.current = true;
    targetRef.current = null;
    velocityRef.current = 0;
    dragState.current = {
      startX: e.clientX,
      startOffset: offsetRef.current,
      lastX: e.clientX,
      moved: 0,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    dragState.current.moved = Math.max(
      dragState.current.moved,
      Math.abs(dx)
    );
    const maxIdx = Math.max(count - 1, 0);
    offsetRef.current = clamp(
      dragState.current.startOffset - (dx / step) * dragSensitivity,
      -0.4,
      maxIdx + 0.4
    );
    velocityRef.current =
      (-(e.clientX - dragState.current.lastX) / step) * dragSensitivity;
    dragState.current.lastX = e.clientX;
    applyTransforms();
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (Math.abs(velocityRef.current) < 0.004) {
      velocityRef.current = 0;
      targetRef.current = clamp(
        Math.round(offsetRef.current),
        0,
        Math.max(count - 1, 0)
      );
    }
  };

  // Suppress the click that ends a drag so cards don't navigate accidentally.
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = 0;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!enableKeyboard) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(Math.round(offsetRef.current) - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(Math.round(offsetRef.current) + 1);
    }
  };

  const gradient = useMemo(() => {
    if (!colors.length) return undefined;
    const pick = (i: number) => colors[clamp(i, 0, colors.length - 1)] || '';
    const a = pick(activeIndex) || '59, 130, 246';
    const b = pick(activeIndex - 1) || a;
    const c = pick(activeIndex + 1) || a;
    const size = clamp(gradientSize, 0.1, 1) * 100;
    const alpha = clamp(gradientIntensity, 0, 1);
    return [
      `radial-gradient(${size}% ${size}% at 50% 55%, rgba(${a}, ${alpha}) 0%, transparent 70%)`,
      `radial-gradient(${size * 0.9}% ${size * 0.9}% at 12% 45%, rgba(${b}, ${
        alpha * 0.7
      }) 0%, transparent 70%)`,
      `radial-gradient(${size * 0.9}% ${size * 0.9}% at 88% 45%, rgba(${c}, ${
        alpha * 0.7
      }) 0%, transparent 70%)`,
    ].join(', ');
  }, [activeIndex, colors, gradientIntensity, gradientSize]);

  const cardHeight = Math.round(cardWidth / cardAspectRatio);

  if (reducedMotion) {
    return (
      <div
        className={cn(
          'relative -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4',
          className
        )}
        role="region"
        aria-label={ariaLabel}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="snap-center shrink-0"
            style={{ width: cardWidth, height: cardHeight }}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Animated gradient backdrop derived from the artwork colours */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 transition-[background] duration-700 ease-out"
        style={{
          backgroundImage: gradient,
          filter: `blur(${backgroundBlur}px)`,
          opacity: gradient ? 0.9 : 0,
        }}
      />

      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="relative z-10 w-full cursor-grab select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:cursor-grabbing"
        style={{
          height: cardHeight + 48,
          perspective: '1400px',
          touchAction: 'pan-y',
        }}
      >
        <div
          ref={trackRef}
          className="absolute left-1/2 top-6"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              aria-hidden={i !== activeIndex}
              className="absolute left-0 top-0 will-change-transform"
              style={{
                width: cardWidth,
                height: cardHeight,
                transformStyle: 'preserve-3d',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="relative z-10 mt-2 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === activeIndex
                ? 'w-6 bg-primary'
                : 'w-1.5 bg-foreground/25 hover:bg-foreground/40'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default CoverflowCarousel;

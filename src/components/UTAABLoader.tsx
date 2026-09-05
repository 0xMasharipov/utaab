import { useEffect, useRef, useState } from "react";
import loaderMark from "@/assets/utaab-loader-mark.svg";

interface UTAABLoaderProps {
  onComplete?: () => void;
}

export default function UTAABLoader({ onComplete }: UTAABLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [prefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const completedRef = useRef(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(
      () => setVisible(false),
      prefersReducedMotion ? 300 : 1050,
    );

    return () => window.clearTimeout(exitTimer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (visible || completedRef.current) return;

    const safetyTimer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete?.();
    }, prefersReducedMotion ? 260 : 520);

    return () => window.clearTimeout(safetyTimer);
  }, [visible, prefersReducedMotion, onComplete]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "opacity" ||
      visible ||
      completedRef.current
    ) {
      return;
    }

    completedRef.current = true;
    onComplete?.();
  };

  return (
    <div
      aria-hidden="true"
      className="utaab-loader-overlay"
      data-visible={visible}
      onTransitionEnd={handleTransitionEnd}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: prefersReducedMotion ? "200ms" : "420ms",
      }}
    >
      <div className="utaab-loader-mark">
        <div className="utaab-loader-halo" />
        <img
          src={loaderMark}
          alt=""
          draggable={false}
          className="utaab-loader-vector"
        />
      </div>

      <style>{`
        .utaab-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 50%, rgba(47, 111, 181, 0.1) 0%, rgba(47, 111, 181, 0.035) 24%, transparent 50%),
            #061224;
          transition-property: opacity;
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          touch-action: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .utaab-loader-mark {
          position: relative;
          width: clamp(88px, 12vw, 124px);
          aspect-ratio: 1;
        }

        .utaab-loader-vector {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.12));
        }

        .utaab-loader-halo {
          position: absolute;
          inset: -42%;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(82, 155, 239, 0.24) 0%, rgba(47, 111, 181, 0.08) 38%, transparent 70%);
          opacity: 0;
          transform: scale(0.76);
          animation: utaab-loader-halo 1050ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes utaab-loader-halo {
          0%, 52% {
            opacity: 0;
            transform: scale(0.76);
          }
          80% {
            opacity: 0.58;
            transform: scale(1.08);
          }
          100% {
            opacity: 0.18;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .utaab-loader-halo {
            animation: none;
            opacity: 0.18;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

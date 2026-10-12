import { useEffect, useRef, useState } from "react";

interface UTAABLoaderProps {
  onComplete?: () => void;
}

export default function UTAABLoader({ onComplete }: UTAABLoaderProps) {
  const [visible, setVisible] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(
      () => setVisible(false),
      1050,
    );

    return () => window.clearTimeout(exitTimer);
  }, []);

  useEffect(() => {
    if (visible || completedRef.current) return;

    const safetyTimer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete?.();
    }, 520);

    return () => window.clearTimeout(safetyTimer);
  }, [visible, onComplete]);

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
        transitionDuration: "420ms",
      }}
    >
      <div className="utaab-loader-mark">
        <div className="utaab-loader-halo" />
        <svg className="utaab-loader-vector" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <g className="utaab-loader-piece utaab-loader-piece--top"><rect x="43" y="14" width="34" height="34" rx="7" transform="rotate(45 60 31)" /></g>
          <g className="utaab-loader-piece utaab-loader-piece--left"><rect x="14" y="43" width="34" height="34" rx="7" transform="rotate(45 31 60)" /></g>
          <g className="utaab-loader-piece utaab-loader-piece--right"><rect x="72" y="43" width="34" height="34" rx="7" transform="rotate(45 89 60)" /></g>
          <g className="utaab-loader-piece utaab-loader-piece--bottom"><rect x="43" y="72" width="34" height="34" rx="7" transform="rotate(45 60 89)" /></g>
        </svg>
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

        .utaab-loader-piece {
          fill: #fff;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: utaab-loader-assemble 680ms cubic-bezier(.22, 1, .36, 1) both;
        }

        .utaab-loader-piece--top { --piece-x: 0px; --piece-y: -15px; --piece-rotation: -5deg; }
        .utaab-loader-piece--left { --piece-x: -15px; --piece-y: 0px; --piece-rotation: -5deg; animation-delay: 60ms; }
        .utaab-loader-piece--right { --piece-x: 15px; --piece-y: 0px; --piece-rotation: 5deg; animation-delay: 60ms; }
        .utaab-loader-piece--bottom { --piece-x: 0px; --piece-y: 15px; --piece-rotation: 5deg; animation-delay: 120ms; }

        @keyframes utaab-loader-assemble {
          0% { opacity: 0; transform: translate(var(--piece-x), var(--piece-y)) rotate(var(--piece-rotation)) scale(.9); }
          72% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1.035); }
          100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
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

      `}</style>
    </div>
  );
}

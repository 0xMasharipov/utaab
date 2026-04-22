import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useBreakpoint, type Breakpoint } from "@/hooks/useBreakpoint";

interface UTAABLoaderProps {
  onComplete?: () => void;
}

interface Particle {
  id: number;
  left: number;     // %
  top: number;      // %
  size: number;     // px
  color: string;
  duration: number; // s
  delay: number;    // s
}

// Stable particle pool generated once at module load (max 40 = desktop count)
const PARTICLES: Particle[] = (() => {
  const arr: Particle[] = [];
  // Deterministic-ish but varied
  for (let i = 0; i < 40; i++) {
    const r = 100 + Math.floor(Math.random() * 60);  // 100–160
    const g = 160 + Math.floor(Math.random() * 50);  // 160–210
    arr.push({
      id: i,
      left: Math.random() * 100,
      top: 60 + Math.random() * 40, // start in lower 40% so they rise into view
      size: 0.5 + Math.random() * 2, // 0.5–2.5
      color: `rgba(${r}, ${g}, 255, 1)`,
      duration: 4 + Math.random() * 5, // 4–9s
      delay: Math.random() * 6,
    });
  }
  return arr;
})();

const PROGRESS_STEPS = [12, 28, 41, 57, 69, 78, 88, 94, 99, 100];

const sizeMap = (bp: Breakpoint) => {
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  return {
    isMobile,
    isTablet,
    logo: isMobile ? 100 : isTablet ? 130 : 160,
    epochFs: isMobile ? 7 : isTablet ? 8 : 9,
    subtitleFs: isMobile ? "7px" : isTablet ? "8.5px" : "clamp(8px, 1.1vw, 10px)",
    progressW: isMobile ? "min(220px, 80vw)" : isTablet ? "min(260px, 70vw)" : "min(280px, 60vw)",
    bracketSize: isMobile ? 18 : isTablet ? 22 : 28,
    bracketInset: isMobile ? "3%" : isTablet ? "4%" : "5%",
    vLineLeft: isTablet ? "6%" : "8%",
    vLineRight: isTablet ? "6%" : "8%",
    hashFs: isMobile ? 6 : isTablet ? 7 : 8,
    hashH: isMobile ? 16 : isTablet ? 18 : 20,
    particleCount: isMobile ? 16 : isTablet ? 28 : 40,
    epochMb: isMobile ? 16 : isTablet ? 22 : 28,
    subtitleMb: isMobile ? 32 : isTablet ? 42 : 52,
    gridSize: isMobile ? 36 : 52,
    tileBorder: isMobile ? 1 : isTablet ? 1.2 : 1.5,
    columnPadding: isMobile ? "0 16px" : isTablet ? "0 24px" : "0",
    progressLabelFs: isMobile ? 7 : 8,
    scanOpacityMul: isMobile ? 0.6 : 1,
    hashOpacity: isMobile ? 0.12 : 0.18,
    subtitleLetterSpacing: isMobile ? "0.25em" : "0.45em",
    subtitleWhitespace: isMobile ? "normal" : ("nowrap" as const),
    particleMaxSize: isMobile ? 1.5 : 2.5,
    particleTravel: isMobile ? -50 : -80,
  };
};

export default function UTAABLoader({ onComplete }: UTAABLoaderProps) {
  const bp = useBreakpoint();
  const s = useMemo(() => sizeMap(bp), [bp]);

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completedRef = useRef(false);

  // Stepped progress
  useEffect(() => {
    setMounted(true);
    let cumulative = 0;
    PROGRESS_STEPS.forEach((step) => {
      const gap = 600 + Math.random() * 400; // 600–1000ms
      cumulative += gap;
      const t = setTimeout(() => setProgress(step), cumulative);
      timersRef.current.push(t);
    });
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  // When progress hits 100, fade out
  useEffect(() => {
    if (progress >= 100 && visible) {
      const t = setTimeout(() => setVisible(false), 350);
      timersRef.current.push(t);
    }
  }, [progress, visible]);

  // Fade out → onComplete
  useEffect(() => {
    if (!visible && !completedRef.current) {
      const safety = setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }, 1100);
      timersRef.current.push(safety);
    }
  }, [visible, onComplete]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === "opacity" && !visible && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  const particles = PARTICLES.slice(0, s.particleCount);

  const corners: Array<{ key: string; style: CSSProperties; borders: CSSProperties }> = [
    {
      key: "tl",
      style: { top: s.bracketInset, left: s.bracketInset },
      borders: { borderTop: "1px solid rgba(99,179,237,0.3)", borderLeft: "1px solid rgba(99,179,237,0.3)" },
    },
    {
      key: "tr",
      style: { top: s.bracketInset, right: s.bracketInset },
      borders: { borderTop: "1px solid rgba(99,179,237,0.3)", borderRight: "1px solid rgba(99,179,237,0.3)" },
    },
    {
      key: "bl",
      style: { bottom: s.bracketInset, left: s.bracketInset },
      borders: { borderBottom: "1px solid rgba(99,179,237,0.3)", borderLeft: "1px solid rgba(99,179,237,0.3)" },
    },
    {
      key: "br",
      style: { bottom: s.bracketInset, right: s.bracketInset },
      borders: { borderBottom: "1px solid rgba(99,179,237,0.3)", borderRight: "1px solid rgba(99,179,237,0.3)" },
    },
  ];

  const tileBase: CSSProperties = {
    borderRadius: "18%",
    background: "transparent",
    border: `${s.tileBorder}px solid rgba(255,255,255,0.55)`,
    boxShadow: "0 0 12px rgba(147,210,255,0.2), inset 0 0 8px rgba(147,210,255,0.06)",
  };

  const gap = s.logo * 0.065;

  const hashTop = "0x4a8B3f · BLOCK · UTAAB · SHA256 · NODE · 0xf7c2e1 · CHAIN · DEPLOY";
  const hashBottom = "GENESIS · 0x9d4f2a · VERIFY · UTAAB · MERKLE · 0x1b8e5c · CONSENSUS";

  const progressHex = `0x${progress.toString(16).toUpperCase().padStart(2, "0")}`;

  return (
    <div
      ref={overlayRef}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#080d1a",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.9s ease",
        touchAction: "none",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        fontFamily: "'DM Mono', ui-monospace, monospace",
      }}
    >
      {/* 1. Nebula */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(15,35,90,0.55) 0%, rgba(8,18,50,0.3) 45%, transparent 80%)",
          animation: "utaab-bgBreath 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* 2. Perspective grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(50,100,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(50,100,200,0.04) 1px, transparent 1px)",
          backgroundSize: `${s.gridSize}px ${s.gridSize}px`,
          animation: "utaab-gridPulse 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* 3. Particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {particles.map((p) => {
          const size = Math.min(p.size, s.particleMaxSize);
          return (
            <span
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                background: p.color,
                opacity: 0,
                animation: `utaab-particleRise ${p.duration}s ease-in-out ${p.delay}s infinite`,
                ["--utaab-travel" as string]: `${s.particleTravel}px`,
              } as CSSProperties}
            />
          );
        })}
      </div>

      {/* 4. Horizontal scan lines */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "38%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,179,237,0.5) 50%, transparent 100%)",
          opacity: 1 * s.scanOpacityMul,
          animation: "utaab-scanH 4s linear infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "62%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,179,237,0.5) 50%, transparent 100%)",
          opacity: 0.4 * s.scanOpacityMul,
          animation: "utaab-scanH 4s linear infinite 2.5s",
          pointerEvents: "none",
        }}
      />

      {/* 5. Vertical accent lines (hidden on mobile) */}
      {!s.isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: s.vLineLeft,
              width: 1,
              background: "rgba(99,179,237,0.5)",
              transformOrigin: "center",
              animation: "utaab-vertLinePulse 5s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: s.vLineRight,
              width: 1,
              background: "rgba(99,179,237,0.5)",
              transformOrigin: "center",
              animation: "utaab-vertLinePulse 5s ease-in-out infinite 1.5s",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* 6. Corner brackets */}
      {corners.map((c, i) => (
        <div
          key={c.key}
          style={{
            position: "absolute",
            width: s.bracketSize,
            height: s.bracketSize,
            ...c.style,
            ...c.borders,
            animation: `utaab-bracketPulse 4s ease-in-out infinite ${i * 0.4}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* 7. Hash strips */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          height: s.hashH,
          overflow: "hidden",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            color: `rgba(60,120,200,${s.hashOpacity})`,
            fontSize: s.hashFs,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.2em",
            animation: "utaab-hashScrollLeft 12s linear infinite",
          }}
        >
          <span style={{ paddingRight: 40 }}>{hashTop}</span>
          <span style={{ paddingRight: 40 }}>{hashTop}</span>
          <span style={{ paddingRight: 40 }}>{hashTop}</span>
          <span style={{ paddingRight: 40 }}>{hashTop}</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          height: s.hashH,
          overflow: "hidden",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            color: `rgba(60,120,200,${s.hashOpacity})`,
            fontSize: s.hashFs,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.2em",
            animation: "utaab-hashScrollRight 18s linear infinite",
          }}
        >
          <span style={{ paddingRight: 40 }}>{hashBottom}</span>
          <span style={{ paddingRight: 40 }}>{hashBottom}</span>
          <span style={{ paddingRight: 40 }}>{hashBottom}</span>
          <span style={{ paddingRight: 40 }}>{hashBottom}</span>
        </div>
      </div>

      {/* CENTER COMPOSITION */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: s.columnPadding,
          maxWidth: "100vw",
          gap: 0,
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* EPOCH label */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: s.epochFs,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(99,179,237,0.35)",
            marginBottom: s.epochMb,
            animation: "utaab-subtitleFade 4s ease-in-out infinite",
          }}
        >
          EPOCH · 2025 · MAINNET
        </div>

        {/* LOGO */}
        <div
          style={{
            position: "relative",
            width: s.logo,
            height: s.logo,
            animation: "utaab-springIn 0.9s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* Outer glow */}
          <div
            style={{
              position: "absolute",
              inset: "-20%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,179,237,0.25) 0%, rgba(99,179,237,0.08) 40%, transparent 70%)",
              animation: "utaab-outerGlow 3.5s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: `${gap}px`,
              transform: "rotate(45deg)",
            }}
          >
            <div style={{ ...tileBase, animation: "utaab-tilePulseA 2.6s ease-in-out infinite" }} />
            <div style={{ ...tileBase, animation: "utaab-tilePulseB 2.9s ease-in-out infinite 0.2s" }} />
            <div style={{ ...tileBase, animation: "utaab-tilePulseC 3.0s ease-in-out infinite 0.4s" }} />
            <div style={{ ...tileBase, animation: "utaab-tilePulseD 3.2s ease-in-out infinite 0.6s" }} />
          </div>
        </div>

        {/* SUBTITLE */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: s.subtitleFs,
            letterSpacing: s.subtitleLetterSpacing,
            textTransform: "uppercase",
            color: "rgba(147,210,255,0.35)",
            marginTop: 10,
            marginBottom: s.subtitleMb,
            whiteSpace: s.subtitleWhitespace,
            textAlign: "center",
            animation: "utaab-subtitleFade 6s ease-in-out infinite 1s",
          }}
        >
          Build Your Future in Blockchain
        </div>

        {/* PROGRESS BAR */}
        <div style={{ width: s.progressW, maxWidth: "90vw" }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(255,255,255,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, rgba(45,110,181,0.8) 0%, rgba(91,163,224,0.9) 50%, rgba(147,210,255,1) 100%)",
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: "utaab-progressGlow 2s ease-in-out infinite",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontFamily: "'DM Mono', monospace",
              fontSize: s.progressLabelFs,
              color: "rgba(99,179,237,0.25)",
              letterSpacing: "0.15em",
            }}
          >
            <span>{progressHex}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

        @keyframes utaab-scanH {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(110%); }
        }
        @keyframes utaab-vertLinePulse {
          0%, 100% { transform: scaleY(0.6); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 0.8; }
        }
        @keyframes utaab-bracketPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.6; }
        }
        @keyframes utaab-particleRise {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(var(--utaab-travel, -80px)); opacity: 0; }
        }
        @keyframes utaab-bgBreath {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.92; }
        }
        @keyframes utaab-gridPulse {
          0%, 100% { opacity: 0.018; }
          50% { opacity: 0.032; }
        }
        @keyframes utaab-progressGlow {
          0%, 100% { box-shadow: 0 0 6px rgba(99,179,237,0.4); }
          50% { box-shadow: 0 0 14px rgba(99,179,237,0.7); }
        }
        @keyframes utaab-hashScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes utaab-hashScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes utaab-subtitleFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.55; }
        }
        @keyframes utaab-tilePulseA {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; border-color: rgba(255,255,255,0.55); box-shadow: 0 0 12px rgba(147,210,255,0.2), inset 0 0 8px rgba(147,210,255,0.06); }
          50% { transform: translateY(-4px) scale(1.04); opacity: 1; border-color: rgba(199,230,255,0.85); box-shadow: 0 0 20px rgba(147,210,255,0.5), inset 0 0 12px rgba(147,210,255,0.18); }
        }
        @keyframes utaab-tilePulseB {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.55; border-color: rgba(255,255,255,0.55); box-shadow: 0 0 12px rgba(147,210,255,0.2), inset 0 0 8px rgba(147,210,255,0.06); }
          50% { transform: translate(-3px,-3px) scale(1.04); opacity: 1; border-color: rgba(199,230,255,0.85); box-shadow: 0 0 20px rgba(147,210,255,0.5), inset 0 0 12px rgba(147,210,255,0.18); }
        }
        @keyframes utaab-tilePulseC {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.55; border-color: rgba(255,255,255,0.55); box-shadow: 0 0 12px rgba(147,210,255,0.2), inset 0 0 8px rgba(147,210,255,0.06); }
          50% { transform: translate(3px,-3px) scale(1.04); opacity: 1; border-color: rgba(199,230,255,0.85); box-shadow: 0 0 20px rgba(147,210,255,0.5), inset 0 0 12px rgba(147,210,255,0.18); }
        }
        @keyframes utaab-tilePulseD {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; border-color: rgba(255,255,255,0.55); box-shadow: 0 0 12px rgba(147,210,255,0.2), inset 0 0 8px rgba(147,210,255,0.06); }
          50% { transform: translateY(4px) scale(1.04); opacity: 1; border-color: rgba(199,230,255,0.85); box-shadow: 0 0 20px rgba(147,210,255,0.5), inset 0 0 12px rgba(147,210,255,0.18); }
        }
        @keyframes utaab-outerGlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes utaab-springIn {
          0% { transform: scale(0.88); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

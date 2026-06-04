import { motion } from 'framer-motion';
import { ReactNode, SVGProps } from 'react';

/**
 * Duotone glyph set for the UBpoint page.
 * Each glyph is a 2-layer SVG: a soft back silhouette + a crisp front mark.
 * 24x24 viewBox, currentColor-agnostic (uses explicit blue tokens).
 */

type GlyphProps = SVGProps<SVGSVGElement> & { size?: number };

const Svg = ({ size = 24, children, ...rest }: GlyphProps & { children: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    {children}
  </svg>
);

const BACK = '#BFDBFE'; // blue-200
const FRONT = '#1D4ED8'; // blue-700
const FRONT_SOFT = '#2563EB'; // blue-600

/* ---------- Feature glyphs ---------- */

export const GlyphCoin = (p: GlyphProps) => (
  <Svg {...p}>
    <circle cx="9.5" cy="13" r="6" fill={BACK} />
    <circle cx="14.5" cy="11" r="6" fill="white" stroke={FRONT} strokeWidth="1.6" />
    <path d="M14.5 8.2v5.6M12.7 10h3.2a1.4 1.4 0 010 2.8h-3.2" stroke={FRONT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const GlyphGift = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="3.5" y="9" width="17" height="11.5" rx="2" fill={BACK} />
    <rect x="4.5" y="10" width="15" height="10.5" rx="1.8" fill="white" stroke={FRONT} strokeWidth="1.6" />
    <path d="M12 10v10.5" stroke={FRONT} strokeWidth="1.6" />
    <path d="M4.5 13.5h15" stroke={FRONT} strokeWidth="1.6" />
    <path d="M8.5 9.5c-1.7 0-2.8-1-2.8-2.3 0-1 .8-1.7 1.8-1.7 1.7 0 2.7 1.5 4.5 4M15.5 9.5c1.7 0 2.8-1 2.8-2.3 0-1-.8-1.7-1.8-1.7-1.7 0-2.7 1.5-4.5 4" stroke={FRONT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const GlyphChain = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="2.5" y="9" width="11" height="7" rx="3.5" fill={BACK} />
    <rect x="3.5" y="10" width="9" height="5" rx="2.5" fill="white" stroke={FRONT} strokeWidth="1.6" />
    <rect x="11.5" y="8" width="10" height="6.5" rx="3.25" fill="white" stroke={FRONT} strokeWidth="1.6" />
    <path d="M8.5 12.5h7" stroke={FRONT} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

export const GlyphScroll = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M5.5 4.5h11a2 2 0 012 2v11l-2.5-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2.5 1.5v-11a2 2 0 012-2z" fill={BACK} />
    <path d="M6.5 3.5h11a2 2 0 012 2v11l-2.5-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2.5 1.5v-11a2 2 0 012-2z" fill="white" stroke={FRONT} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 8h6M9 11h4" stroke={FRONT} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="15.5" cy="11.5" r="1.4" fill={FRONT_SOFT} />
  </Svg>
);

export const GlyphLaurel = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M5 6c-1 4 1 8 5 10M5 9.5c1 .5 2 .5 3 0M5.5 13c1 .5 2 .5 3 0M7 16c1 .5 2 .5 3 0" stroke={BACK} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M19 6c1 4-1 8-5 10M19 9.5c-1 .5-2 .5-3 0M18.5 13c-1 .5-2 .5-3 0M17 16c-1 .5-2 .5-3 0" stroke={BACK} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M5 6c-1 4 1 8 5 10M19 6c1 4-1 8-5 10" stroke={FRONT} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12 8.5l1.1 2.3 2.5.3-1.8 1.7.5 2.5L12 14.1l-2.3 1.2.5-2.5L8.4 11l2.5-.3L12 8.5z" fill={FRONT} />
  </Svg>
);

export const GlyphSpark = (p: GlyphProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="7" fill={BACK} opacity="0.7" />
    <path d="M12 3.5l1.6 5.2 5.2 1.6-5.2 1.6L12 17.1l-1.6-5.2L5.2 10.3l5.2-1.6L12 3.5z" fill="white" stroke={FRONT} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M19 16l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6L19 16z" fill={FRONT_SOFT} />
  </Svg>
);

/* ---------- Sponsor task glyphs ---------- */

export const GlyphX = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" fill={BACK} />
    <rect x="4" y="4" width="16" height="16" rx="3.5" fill="white" stroke={FRONT} strokeWidth="1.4" />
    <path d="M8 8l8 8M16 8l-8 8" stroke={FRONT} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const GlyphChat = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M4 7a3 3 0 013-3h9a3 3 0 013 3v6a3 3 0 01-3 3h-5l-4 3v-3H7a3 3 0 01-3-3V7z" fill={BACK} />
    <path d="M5 8a3 3 0 013-3h9a3 3 0 013 3v6a3 3 0 01-3 3h-5l-4 3v-3H8a3 3 0 01-3-3V8z" fill="white" stroke={FRONT} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="10" cy="11" r="0.9" fill={FRONT} />
    <circle cx="13" cy="11" r="0.9" fill={FRONT} />
    <circle cx="16" cy="11" r="0.9" fill={FRONT} />
  </Svg>
);

export const GlyphRocket = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M6.5 15.5c-1 1-1.5 3.5-1.5 4.5 1 0 3.5-.5 4.5-1.5" fill={BACK} />
    <path d="M14.5 3.5c3 0 6 3 6 6L9 20.5l-3-3L14.5 3.5z" fill="white" stroke={FRONT} strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="15" cy="9" r="1.6" fill={FRONT_SOFT} />
    <path d="M6.5 15.5c-1 1-1.5 3.5-1.5 4.5 1 0 3.5-.5 4.5-1.5" stroke={FRONT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/* ---------- Mini inline glyphs ---------- */

export const GlyphCheckMini = (p: GlyphProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" fill={BACK} />
    <circle cx="12" cy="12" r="8" fill="white" stroke={FRONT} strokeWidth="1.4" />
    <path d="M8 12.2l2.8 2.8L16 9.5" stroke={FRONT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

/* ---------- Tile wrapper ---------- */

type TileSize = 'sm' | 'md';

const sizeMap: Record<TileSize, { box: string; icon: number }> = {
  md: { box: 'w-14 h-14', icon: 28 },
  sm: { box: 'w-12 h-12', icon: 24 },
};

export const GlyphTile = ({
  Icon,
  size = 'md',
}: {
  Icon: (p: GlyphProps) => JSX.Element;
  size?: TileSize;
}) => {
  const s = sizeMap[size];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`${s.box} rounded-2xl bg-white/70 backdrop-blur border border-blue-200/70 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_24px_-14px_rgba(37,99,235,0.45)]`}
    >
      <Icon width={s.icon} height={s.icon} />
    </motion.div>
  );
};

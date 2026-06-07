/**
 * Shared design tokens for public-facing pages.
 * Keeping these as exported class-name strings (not Tailwind config changes)
 * lets components compose them with `cn()` while staying purgable.
 */

export const EYEBROW =
  'text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium';

export const SECTION_TITLE =
  'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground';

export const SECTION_SUBTITLE =
  'text-base sm:text-lg text-muted-foreground leading-relaxed';

export const HERO_TITLE =
  'text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground';

export const HERO_SUBTITLE =
  'text-lg sm:text-xl text-muted-foreground leading-relaxed';

export const SECTION_PAD = 'py-16 md:py-24';

export const HAIRLINE = 'border-t border-white/[0.06]';

/** Numerical eyebrow used for editorial lists (e.g., "01 — Education"). */
export const NUMERAL =
  'font-extralight text-foreground/20 tabular-nums leading-none select-none';

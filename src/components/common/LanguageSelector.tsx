import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'iconoir-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface LanguageOption {
  code: string;
  name: string;
  short: string;
  flag: string;
}

/** Single source of truth for the languages offered across the site. */
export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', short: 'TR', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', short: 'AR', flag: '🇸🇦' },
] as const;

export const resolveLanguage = (code?: string): LanguageOption =>
  LANGUAGES.find((lang) => lang.code === code) ?? LANGUAGES[0];

/**
 * Glassmorphic language selector.
 * The panel opens *below* the navbar pill (never on top of it) and is portalled,
 * so it never affects navbar layout and renders nothing until opened.
 */
export const LanguageSelector = ({
  className,
  /** Extra vertical gap so the panel clears the navbar pill's padding. */
  sideOffset = 20,
}: {
  className?: string;
  sideOffset?: number;
}) => {
  const { i18n } = useTranslation();
  const current = resolveLanguage(i18n.language);
  const isRTL = i18n.language === 'ar';

  const changeLanguage = (code: string) => {
    if (code !== current.code) void i18n.changeLanguage(code);
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Language: ${current.name}`}
          className={cn(
            'glass rounded-full h-11 min-h-[44px] px-3 gap-1.5 justify-center',
            'w-[76px] sm:w-[92px] shrink-0',
            'hover:bg-white/10 transition-colors duration-200',
            className,
          )}
        >
          <Globe className="hidden sm:block h-4 w-4 opacity-70" strokeWidth={1.5} />
          <span aria-hidden="true" className="text-base leading-none">
            {current.flag}
          </span>
          <span className="text-xs font-semibold tracking-wide leading-none">{current.short}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isRTL ? 'start' : 'end'}
        side="bottom"
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(
          'z-[120] min-w-[200px] rounded-2xl p-1.5',
          'border border-white/15 text-foreground',
          'backdrop-blur-2xl backdrop-saturate-150',
        )}
        style={{
          background:
            'linear-gradient(135deg, hsl(222 47% 8% / 0.92) 0%, hsl(220 45% 11% / 0.88) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow:
            '0 20px 50px -18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.10)',
          willChange: 'transform, opacity',
        }}
      >
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === current.code;

          return (
            <DropdownMenuItem
              key={lang.code}
              onSelect={() => changeLanguage(lang.code)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'cursor-pointer rounded-xl px-3 py-2.5 min-h-[44px] gap-2.5',
                'transition-colors duration-200 focus:bg-white/10',
                isRTL && 'flex-row-reverse text-right',
                isActive ? 'bg-white/[0.12] font-medium' : 'hover:bg-white/[0.07]',
              )}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {lang.flag}
              </span>
              <span className="flex-1 text-sm">{lang.name}</span>
              {isActive && <Check className="h-4 w-4 text-accent" strokeWidth={2} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Expanded language list for inside mobile menu panels, where a dropdown
 * inside a dialog would be awkward. Same data, same active treatment.
 */
export const LanguageGrid = ({
  className,
  onSelect,
}: {
  className?: string;
  onSelect?: (code: string) => void;
}) => {
  const { i18n } = useTranslation();
  const activeCode = resolveLanguage(i18n.language).code;

  const changeLanguage = (code: string) => {
    if (code !== activeCode) void i18n.changeLanguage(code);
    onSelect?.(code);
  };

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {LANGUAGES.map((lang) => {
        const isActive = lang.code === activeCode;

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => changeLanguage(lang.code)}
            aria-current={isActive ? 'true' : undefined}
            aria-label={lang.name}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2.5 min-h-[44px] text-sm',
              'border transition-colors duration-200',
              isActive
                ? 'border-white/20 bg-white/[0.14] text-foreground font-medium'
                : 'border-white/[0.08] text-foreground/70 hover:bg-white/[0.08]',
            )}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {lang.flag}
            </span>
            <span className="flex-1 text-left">{lang.name}</span>
            {isActive && <Check className="h-4 w-4 text-accent shrink-0" strokeWidth={2} />}
          </button>
        );
      })}
    </div>
  );
};

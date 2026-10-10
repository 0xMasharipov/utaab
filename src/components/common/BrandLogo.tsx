import horizontalLogo from '@/assets/utaab-logo.png.asset.json';
import markLogo from '@/assets/utaab-mark.png.asset.json';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'horizontal' | 'mark';
  className?: string;
  alt?: string;
}

export const BrandLogo = ({
  variant = 'horizontal',
  className,
  alt = 'UTAAB',
}: BrandLogoProps) => (
  <img
    src={variant === 'mark' ? markLogo.url : horizontalLogo.url}
    alt={alt}
    className={cn('block object-contain', className)}
    draggable={false}
    decoding="async"
  />
);
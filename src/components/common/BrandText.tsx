import { cn } from '@/lib/utils';

interface BrandTextProps {
  variant?: 'navbar-desktop' | 'navbar-tablet' | 'navbar-mobile' | 'footer';
  className?: string;
}

export const BrandText = ({ variant = 'navbar-desktop', className }: BrandTextProps) => {
  const sizeClasses = {
    'navbar-desktop': 'text-2xl',
    'navbar-tablet': 'text-xl',
    'navbar-mobile': 'text-lg',
    'footer': 'text-2xl'
  };

  return (
    <span 
      className={cn(
        'font-bold tracking-tight transition-colors',
        sizeClasses[variant],
        className
      )}
    >
      <span className="text-foreground">UTAA</span>
      <span className="text-accent">B</span>
    </span>
  );
};

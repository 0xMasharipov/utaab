import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
}: {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  hint?: string;
}) {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-extrabold mt-2">{value}</p>
            {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

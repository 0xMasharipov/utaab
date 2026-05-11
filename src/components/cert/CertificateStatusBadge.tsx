import { Badge } from '@/components/ui/badge';

export function CertificateStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    issued: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    revoked: 'bg-red-500/20 text-red-300 border-red-500/30',
    failed: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  };
  return (
    <Badge variant="outline" className={map[status] || map.draft}>
      {status}
    </Badge>
  );
}

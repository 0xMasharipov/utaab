import { CertNav } from '@/components/admin/cert/CertNav';
import { useCertStats, useCertRecords } from '@/hooks/useCertData';
import { StatCard } from '@/components/cert/StatCard';
import { CalendarDays, Users, FileText, CheckCircle2, XCircle, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CertificateStatusBadge } from '@/components/cert/CertificateStatusBadge';

export default function CertDashboard() {
  const { data: stats, isLoading } = useCertStats();
  const { data: records } = useCertRecords();
  const recent = (records ?? []).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Certificate System</h1>
        <p className="text-muted-foreground mt-1">Manage UTAAB seminar & event certificates on Sepolia.</p>
      </div>
      <CertNav />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Events" value={stats?.events ?? 0} icon={CalendarDays} />
        <StatCard title="Participants" value={stats?.participants ?? 0} icon={Users} />
        <StatCard title="Total Certs" value={stats?.total ?? 0} icon={Award} />
        <StatCard title="Drafts" value={stats?.drafts ?? 0} icon={FileText} />
        <StatCard title="Issued" value={stats?.issued ?? 0} icon={CheckCircle2} />
        <StatCard title="Revoked" value={stats?.revoked ?? 0} icon={XCircle} />
      </div>

      <Card className="p-6 glass-section border-white/10">
        <h2 className="text-xl font-bold mb-4">Recent certificates</h2>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">No certificates yet. Create an event and add participants to start.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">Serial</th>
                  <th>Status</th>
                  <th>Issued at</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r: any) => (
                  <tr key={r.id} className="border-t border-white/5">
                    <td className="py-2 font-mono">{r.serial_number}</td>
                    <td><CertificateStatusBadge status={r.status} /></td>
                    <td className="text-muted-foreground">{r.issued_at ? new Date(r.issued_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Shield,
  AlertTriangle,
  Activity,
  Ban,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Users,
  Trash2,
  Globe,
  Monitor,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

export const AdminSecurity = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState(24);
  const [newBlacklistIP, setNewBlacklistIP] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');

  // Fetch security metrics
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['security-metrics', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_security_metrics', {
        _hours: selectedPeriod,
      });
      if (error) throw error;
      return data[0];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch recent security events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['security-events', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - selectedPeriod * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch blacklisted IPs
  const { data: blacklistedIPs, refetch: refetchBlacklist } = useQuery({
    queryKey: ['ip-blacklist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_blacklist')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch security settings
  const { data: settings } = useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .order('setting_key');
      if (error) throw error;
      return data;
    },
  });

  // Fetch active admin sessions
  const { data: adminSessions, refetch: refetchSessions } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const handleAddBlacklist = async () => {
    if (!newBlacklistIP || !blacklistReason) {
      toast({
        title: 'Error',
        description: 'IP address and reason are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('ip_blacklist').insert({
        ip_address: newBlacklistIP,
        reason: blacklistReason,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'IP address blacklisted successfully',
      });

      setNewBlacklistIP('');
      setBlacklistReason('');
      refetchBlacklist();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveBlacklist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ip_blacklist')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'IP address removed from blacklist',
      });

      refetchBlacklist();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTerminateSession = async (sessionId: string, targetUserId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await supabase.functions.invoke('terminate-admin-session', {
        body: { session_id: sessionId, target_user_id: targetUserId },
      });

      if (res.error) throw res.error;

      const result = res.data;
      toast({
        title: 'Session Terminated',
        description: result.auth_revoked
          ? 'Session terminated and user signed out immediately'
          : 'Session deleted but auth revocation failed — user may remain active briefly',
        variant: result.auth_revoked ? 'default' : 'destructive',
      });

      refetchSessions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-yellow-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rate_limit':
        return <Activity className="h-4 w-4" />;
      case 'captcha_fail':
        return <Shield className="h-4 w-4" />;
      case 'honeypot_trigger':
        return <AlertTriangle className="h-4 w-4" />;
      case 'ip_blacklisted':
        return <Ban className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor threats, rate limits, and CAPTCHA challenges
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchMetrics();
              toast({ title: 'Refreshed', description: 'Security data updated' });
            }}
            className="glass"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {[1, 6, 24, 72, 168].map((hours) => (
          <Button
            key={hours}
            variant={selectedPeriod === hours ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(hours)}
            className={selectedPeriod === hours ? 'bg-primary' : 'glass'}
          >
            {hours < 24 ? `${hours}h` : `${hours / 24}d`}
          </Button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="glass-strong border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {metricsLoading ? '...' : metrics?.total_events?.toString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {metricsLoading
                ? '...'
                : (metrics?.events_by_type as any)?.rate_limit || '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CAPTCHA Failures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {metricsLoading
                ? '...'
                : (metrics?.events_by_type as any)?.captcha_fail || '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {metricsLoading
                ? '...'
                : (metrics?.events_by_severity as any)?.critical || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="glass-strong">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="blacklist">IP Blacklist</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card className="glass-strong border-white/20">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Security Events</CardTitle>
              <CardDescription>Last {selectedPeriod} hours</CardDescription>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <p className="text-muted-foreground">Loading events...</p>
              ) : events && events.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-foreground">Time</TableHead>
                        <TableHead className="text-foreground">Type</TableHead>
                        <TableHead className="text-foreground">Severity</TableHead>
                        <TableHead className="text-foreground">IP Address</TableHead>
                        <TableHead className="text-foreground">Endpoint</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event: any) => (
                        <TableRow key={event.id} className="border-white/10">
                          <TableCell className="text-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEventIcon(event.event_type)}
                              <span className="text-foreground">{event.event_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {event.ip_address || 'N/A'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.endpoint || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No security events in the selected period
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card className="glass-strong border-white/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Admin Sessions
              </CardTitle>
              <CardDescription>
                Currently active admin sessions with IP and device info
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminSessions && adminSessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-foreground">User</TableHead>
                        <TableHead className="text-foreground">IP Address</TableHead>
                        <TableHead className="text-foreground">User Agent</TableHead>
                        <TableHead className="text-foreground">Created</TableHead>
                        <TableHead className="text-foreground">Expires</TableHead>
                        <TableHead className="text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminSessions.map((session: any) => (
                        <TableRow key={session.id} className="border-white/10">
                          <TableCell className="text-foreground font-mono text-xs">
                            {session.user_id?.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-foreground font-mono text-sm">
                              <Globe className="h-3 w-3 text-muted-foreground" />
                              {session.ip_address || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-muted-foreground text-xs max-w-[200px] truncate">
                              <Monitor className="h-3 w-3 flex-shrink-0" />
                              {session.user_agent || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(session.created_at), 'MMM dd, HH:mm')}
                            <div className="text-xs">
                              {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(session.expires_at), 'MMM dd, HH:mm')}
                            <div className="text-xs">
                              {formatDistanceToNow(new Date(session.expires_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleTerminateSession(session.id, session.user_id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Terminate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No active admin sessions
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blacklist Tab */}
        <TabsContent value="blacklist" className="space-y-4">
          <Card className="glass-strong border-white/20">
            <CardHeader>
              <CardTitle className="text-foreground">Add IP to Blacklist</CardTitle>
              <CardDescription>Block malicious IP addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip" className="text-foreground">
                    IP Address
                  </Label>
                  <Input
                    id="ip"
                    placeholder="192.168.1.1"
                    value={newBlacklistIP}
                    onChange={(e) => setNewBlacklistIP(e.target.value)}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-foreground">
                    Reason
                  </Label>
                  <Input
                    id="reason"
                    placeholder="Suspicious activity, brute force, etc."
                    value={blacklistReason}
                    onChange={(e) => setBlacklistReason(e.target.value)}
                    className="glass"
                  />
                </div>
                <Button onClick={handleAddBlacklist} className="bg-primary">
                  <Ban className="h-4 w-4 mr-2" />
                  Add to Blacklist
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-strong border-white/20">
            <CardHeader>
              <CardTitle className="text-foreground">Blacklisted IPs</CardTitle>
            </CardHeader>
            <CardContent>
              {blacklistedIPs && blacklistedIPs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-foreground">IP Address</TableHead>
                        <TableHead className="text-foreground">Reason</TableHead>
                        <TableHead className="text-foreground">Added</TableHead>
                        <TableHead className="text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blacklistedIPs.map((ip: any) => (
                        <TableRow key={ip.id} className="border-white/10">
                          <TableCell className="font-mono text-foreground">
                            {ip.ip_address}
                          </TableCell>
                          <TableCell className="text-foreground">{ip.reason}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(ip.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveBlacklist(ip.id)}
                              className="glass"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No blacklisted IPs</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-strong border-white/20">
            <CardHeader>
              <CardTitle className="text-foreground">Security Configuration</CardTitle>
              <CardDescription>Rate limits and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              {settings && settings.length > 0 ? (
                <div className="space-y-4">
                  {settings.map((setting: any) => (
                    <div key={setting.id} className="glass rounded-xl p-4">
                      <h4 className="font-semibold text-foreground mb-1">
                        {setting.setting_key}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {setting.description}
                      </p>
                      <pre className="text-xs bg-black/20 p-2 rounded text-foreground overflow-x-auto">
                        {JSON.stringify(setting.setting_value, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No settings configured</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

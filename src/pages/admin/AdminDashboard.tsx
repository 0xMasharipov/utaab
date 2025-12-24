import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Shield, 
  Activity, 
  BookOpen, 
  FileText, 
  HardDrive,
  TrendingUp,
  Award,
  AlertCircle,
  Megaphone,
  Users as UsersIcon,
  RefreshCw
} from 'lucide-react';

interface Stats {
  systemHealth?: any;
  contentMetrics?: any;
  engagement?: any;
  security?: any;
  announcements?: any;
  communities?: any;
}

// Animated stat component that flashes when value changes
function AnimatedStat({ value, className }: { value: number | string; className?: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsUpdating(true);
      prevValueRef.current = value;
      const timer = setTimeout(() => setIsUpdating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span 
      className={cn(
        "text-2xl font-bold transition-all duration-300",
        isUpdating && "text-green-500 scale-110",
        className
      )}
    >
      {value}
    </span>
  );
}

// Skeleton for stat cards
function StatCardSkeleton() {
  return (
    <Card className="glass-panel p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

// Full dashboard skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* System Health Section - 5 cards */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>

      {/* Content Metrics Section - 4 cards */}
      <div>
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>

      {/* Engagement Section - 4 cards */}
      <div>
        <Skeleton className="h-6 w-28 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>

      {/* Top Courses Section */}
      <div>
        <Skeleton className="h-6 w-52 mb-4" />
        <Card className="glass-panel p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Security Section - 2 cards */}
      <div>
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-stats');
      if (error) throw error;
      setStats(data || {});
      setLastUpdated(new Date());
    } catch (error: any) {
      toast.error('Failed to load dashboard stats: ' + error.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  // Initial fetch and realtime subscriptions
  useEffect(() => {
    fetchStats();

    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      // Subscribe to realtime changes for key tables
      channel = supabase
        .channel('admin-dashboard-realtime')
        // New user registrations
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'education_profiles' },
          () => {
            setStats(prev => ({
              ...prev,
              systemHealth: {
                ...prev.systemHealth,
                totalUsers: (prev.systemHealth?.totalUsers || 0) + 1,
                newUsersThisWeek: (prev.systemHealth?.newUsersThisWeek || 0) + 1,
              }
            }));
            setLastUpdated(new Date());
          }
        )
        // New enrollments
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'enrollments' },
          () => {
            setStats(prev => ({
              ...prev,
              engagement: {
                ...prev.engagement,
                totalEnrollments: (prev.engagement?.totalEnrollments || 0) + 1,
                inProgressCourses: (prev.engagement?.inProgressCourses || 0) + 1,
              }
            }));
            setLastUpdated(new Date());
          }
        )
        // Enrollment completions
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'enrollments' },
          (payload) => {
            if (payload.new && (payload.new as any).completed && !(payload.old as any)?.completed) {
              setStats(prev => ({
                ...prev,
                engagement: {
                  ...prev.engagement,
                  completedCourses: (prev.engagement?.completedCourses || 0) + 1,
                  inProgressCourses: Math.max(0, (prev.engagement?.inProgressCourses || 0) - 1),
                }
              }));
              setLastUpdated(new Date());
            }
          }
        )
        // New courses
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'courses' },
          (payload) => {
            const newCourse = payload.new as any;
            setStats(prev => ({
              ...prev,
              contentMetrics: {
                ...prev.contentMetrics,
                totalCourses: (prev.contentMetrics?.totalCourses || 0) + 1,
                publishedCourses: newCourse?.is_published 
                  ? (prev.contentMetrics?.publishedCourses || 0) + 1 
                  : prev.contentMetrics?.publishedCourses || 0,
                draftCourses: !newCourse?.is_published 
                  ? (prev.contentMetrics?.draftCourses || 0) + 1 
                  : prev.contentMetrics?.draftCourses || 0,
              }
            }));
            setLastUpdated(new Date());
          }
        )
        // Course updates (publish/unpublish)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'courses' },
          (payload) => {
            const newData = payload.new as any;
            const oldData = payload.old as any;
            if (newData?.is_published !== oldData?.is_published) {
              const delta = newData.is_published ? 1 : -1;
              setStats(prev => ({
                ...prev,
                contentMetrics: {
                  ...prev.contentMetrics,
                  publishedCourses: (prev.contentMetrics?.publishedCourses || 0) + delta,
                  draftCourses: (prev.contentMetrics?.draftCourses || 0) - delta,
                }
              }));
              setLastUpdated(new Date());
            }
          }
        )
        // New certificates
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'certificates' },
          () => {
            setStats(prev => ({
              ...prev,
              engagement: {
                ...prev.engagement,
                certificatesIssued: (prev.engagement?.certificatesIssued || 0) + 1,
              }
            }));
            setLastUpdated(new Date());
          }
        )
        // Security events
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'security_events' },
          (payload) => {
            const newEvent = payload.new as any;
            setStats(prev => ({
              ...prev,
              security: {
                ...prev.security,
                eventsLast24h: (prev.security?.eventsLast24h || 0) + 1,
                criticalEventsLast24h: newEvent?.severity === 'critical' 
                  ? (prev.security?.criticalEventsLast24h || 0) + 1 
                  : prev.security?.criticalEventsLast24h || 0,
              }
            }));
            setLastUpdated(new Date());
          }
        )
        // Announcements - use incremental update instead of refetch
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'announcements' },
          () => {
            setStats(prev => ({
              ...prev,
              announcements: {
                ...prev.announcements,
                total: (prev.announcements?.total || 0) + 1,
              }
            }));
            setLastUpdated(new Date());
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'announcements' },
          () => {
            setStats(prev => ({
              ...prev,
              announcements: {
                ...prev.announcements,
                total: Math.max(0, (prev.announcements?.total || 0) - 1),
              }
            }));
            setLastUpdated(new Date());
          }
        )
        // Communities
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'communities' },
          () => {
            setStats(prev => ({
              ...prev,
              communities: {
                ...prev.communities,
                total: (prev.communities?.total || 0) + 1,
              }
            }));
            setLastUpdated(new Date());
          }
        )
        .subscribe((status, err) => {
          console.log('Realtime subscription status:', status, err);
          if (status === 'SUBSCRIBED') {
            setIsLive(true);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setIsLive(false);
            console.error('Realtime subscription error:', err);
          }
        });
    } catch (error) {
      console.error('Failed to setup realtime subscription:', error);
      setIsLive(false);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel).catch(console.error);
      }
    };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const { systemHealth, contentMetrics, engagement, security, announcements, communities } = stats;

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">System overview and key metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isLive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
            )} />
            <span>{isLive ? 'Live' : 'Connecting...'}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* System Health */}
      <div>
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={systemHealth?.totalUsers || 0} />
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xs text-primary">+{systemHealth?.newUsersThisWeek || 0} this week</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={systemHealth?.activeAdmins || 0} />
                <p className="text-sm text-muted-foreground">Active Admins</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={systemHealth?.activeSessions || 0} />
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-8 w-8 ${(systemHealth?.errorRate || 0) > 0 ? 'text-destructive' : 'text-green-500'}`} />
              <div>
                <AnimatedStat value={systemHealth?.errorRate || 0} />
                <p className="text-sm text-muted-foreground">Critical Errors</p>
                <p className="text-xs text-muted-foreground">Last 24h</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <UsersIcon className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={communities?.total || 0} />
                <p className="text-sm text-muted-foreground">Communities</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Content Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Content Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={contentMetrics?.totalCourses || 0} />
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-green-500">{contentMetrics?.publishedCourses || 0} published</span>
                  <span className="text-xs text-muted-foreground">{contentMetrics?.draftCourses || 0} drafts</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={contentMetrics?.totalLessons || 0} />
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={contentMetrics?.storageUsedGB || 0} />
                <p className="text-sm text-muted-foreground">GB Storage Used</p>
                <p className="text-xs text-muted-foreground">{contentMetrics?.mediaFiles || 0} files</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={announcements?.active || 0} />
                <p className="text-sm text-muted-foreground">Active Announcements</p>
                <p className="text-xs text-muted-foreground">{announcements?.total || 0} total</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Engagement */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Engagement</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={engagement?.totalEnrollments || 0} />
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={engagement?.completedCourses || 0} />
                <p className="text-sm text-muted-foreground">Completed Courses</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={engagement?.inProgressCourses || 0} />
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <AnimatedStat value={`${engagement?.completionRate || 0}%`} />
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-xs text-muted-foreground">{engagement?.certificatesIssued || 0} certificates</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Courses */}
      {engagement?.topCourses && engagement.topCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Courses by Enrollment</h2>
          <Card className="glass-panel p-6">
            <div className="space-y-4">
              {engagement.topCourses.map((course: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <span>{course.title_en}</span>
                  </div>
                  <span className="text-muted-foreground">{course.total_enrollments || 0} enrollments</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Security */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <AnimatedStat value={security?.eventsLast24h || 0} />
                <p className="text-sm text-muted-foreground">Security Events</p>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-8 w-8 ${(security?.criticalEventsLast24h || 0) > 0 ? 'text-destructive' : 'text-green-500'}`} />
              <div>
                <AnimatedStat value={security?.criticalEventsLast24h || 0} />
                <p className="text-sm text-muted-foreground">Critical Events</p>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

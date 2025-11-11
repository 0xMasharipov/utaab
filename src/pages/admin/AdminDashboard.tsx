import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  Users as UsersIcon
} from 'lucide-react';

interface Stats {
  systemHealth?: any;
  contentMetrics?: any;
  engagement?: any;
  security?: any;
  announcements?: any;
  communities?: any;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    // Use check-admin-status edge function for server-side admin verification
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-admin-status');
        if (error) throw error;
        setIsAdmin(data?.isAdmin || false);
        
        // Only fetch stats if user is confirmed admin
        if (data?.isAdmin) {
          fetchStats();
        } else {
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Admin check failed:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-stats');
      if (error) throw error;
      setStats(data || {});
    } catch (error: any) {
      toast.error('Failed to load dashboard stats: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { systemHealth, contentMetrics, engagement, security, announcements, communities } = stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">System overview and key metrics</p>
      </div>

      {/* System Health */}
      <div>
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{systemHealth?.totalUsers || 0}</div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xs text-primary">+{systemHealth?.newUsersThisWeek || 0} this week</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{systemHealth?.activeAdmins || 0}</div>
                <p className="text-sm text-muted-foreground">Active Admins</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{systemHealth?.activeSessions || 0}</div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-8 w-8 ${(systemHealth?.errorRate || 0) > 0 ? 'text-destructive' : 'text-green-500'}`} />
              <div>
                <div className="text-2xl font-bold">{systemHealth?.errorRate || 0}</div>
                <p className="text-sm text-muted-foreground">Critical Errors</p>
                <p className="text-xs text-muted-foreground">Last 24h</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <UsersIcon className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{communities?.total || 0}</div>
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
                <div className="text-2xl font-bold">{contentMetrics?.totalCourses || 0}</div>
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
                <div className="text-2xl font-bold">{contentMetrics?.totalLessons || 0}</div>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{contentMetrics?.storageUsedGB || 0}</div>
                <p className="text-sm text-muted-foreground">GB Storage Used</p>
                <p className="text-xs text-muted-foreground">{contentMetrics?.mediaFiles || 0} files</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{announcements?.active || 0}</div>
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
                <div className="text-2xl font-bold">{engagement?.totalEnrollments || 0}</div>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{engagement?.completedCourses || 0}</div>
                <p className="text-sm text-muted-foreground">Completed Courses</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{engagement?.inProgressCourses || 0}</div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{engagement?.completionRate || 0}%</div>
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
                <div className="text-2xl font-bold">{security?.eventsLast24h || 0}</div>
                <p className="text-sm text-muted-foreground">Security Events</p>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-8 w-8 ${(security?.criticalEventsLast24h || 0) > 0 ? 'text-destructive' : 'text-green-500'}`} />
              <div>
                <div className="text-2xl font-bold">{security?.criticalEventsLast24h || 0}</div>
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

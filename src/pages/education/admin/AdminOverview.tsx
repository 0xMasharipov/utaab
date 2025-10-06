import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Megaphone, TrendingUp, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export const AdminOverview = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: async () => {
      const [coursesRes, profilesRes, enrollmentsRes, announcementsRes] = await Promise.all([
        supabase.from('courses').select('id, is_published', { count: 'exact', head: true }),
        supabase.from('education_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('enrollments').select('id', { count: 'exact', head: true }),
        supabase.from('announcements').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalCourses: coursesRes.count || 0,
        totalUsers: profilesRes.count || 0,
        totalEnrollments: enrollmentsRes.count || 0,
        totalAnnouncements: announcementsRes.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      description: 'Active courses on platform',
      color: 'text-blue-400',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: 'Registered students',
      color: 'text-green-400',
    },
    {
      title: 'Enrollments',
      value: stats?.totalEnrollments || 0,
      icon: TrendingUp,
      description: 'Course enrollments',
      color: 'text-purple-400',
    },
    {
      title: 'Announcements',
      value: stats?.totalAnnouncements || 0,
      icon: Megaphone,
      description: 'Platform announcements',
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to UTAAB Education Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 rounded-xl glass hover:bg-white/5 transition-all text-left">
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Create Course</h3>
            <p className="text-sm text-muted-foreground">Start building a new course</p>
          </button>
          <button className="p-4 rounded-xl glass hover:bg-white/5 transition-all text-left">
            <Megaphone className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">New Announcement</h3>
            <p className="text-sm text-muted-foreground">Communicate with your audience</p>
          </button>
          <button className="p-4 rounded-xl glass hover:bg-white/5 transition-all text-left">
            <Users className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Manage Users</h3>
            <p className="text-sm text-muted-foreground">View and edit user accounts</p>
          </button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">New course published</p>
                <p className="text-xs text-muted-foreground">Introduction to Web Development</p>
              </div>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">John Doe joined the platform</p>
              </div>
              <span className="text-xs text-muted-foreground">4h ago</span>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Announcement sent</p>
                <p className="text-xs text-muted-foreground">Platform maintenance scheduled</p>
              </div>
              <span className="text-xs text-muted-foreground">1d ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

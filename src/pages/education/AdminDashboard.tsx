import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FolderOpen, Award, Star, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user has admin role
  // SECURITY NOTE: This client-side check is for UX only (showing/hiding UI elements).
  // All actual admin operations MUST be validated server-side in edge functions.
  // The admin-stats edge function properly validates admin status before returning data.
  const { data: userRole } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (error) throw error;
      setIsAdmin(!!data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch stats securely through edge function with server-side role validation
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-stats');
      if (error) throw error;
      return {
        courses: data?.totalApplications || 0,
        users: data?.totalProfiles || 0,
        reviews: data?.totalKvkkRequests || 0,
        enrollments: data?.pendingKvkkRequests || 0,
      };
    },
    enabled: isAdmin,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <EducationNavbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please sign in to continue</p>
          <Button onClick={() => navigate('/education/register')}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <EducationNavbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin permissions</p>
          <Button onClick={() => navigate('/education')}>Back to Education</Button>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      title: t('education.admin.courses'),
      icon: BookOpen,
      description: 'Create and manage courses',
      path: '/education/admin/courses',
      stat: stats?.courses || 0,
    },
    {
      title: t('education.admin.users'),
      icon: Users,
      description: 'Manage users and roles',
      path: '/education/admin/users',
      stat: stats?.users || 0,
    },
    {
      title: t('education.admin.categories'),
      icon: FolderOpen,
      description: 'Manage course categories',
      path: '/education/admin/categories',
      stat: 6, // Fixed number from seed data
    },
    {
      title: t('education.admin.instructors'),
      icon: Award,
      description: 'Manage instructors',
      path: '/education/admin/instructors',
      stat: '-',
    },
    {
      title: t('education.admin.reviews'),
      icon: Star,
      description: 'Moderate reviews',
      path: '/education/admin/reviews',
      stat: stats?.reviews || 0,
    },
    {
      title: t('education.admin.analytics'),
      icon: BarChart3,
      description: 'View platform analytics',
      path: '/education/admin/analytics',
      stat: stats?.enrollments || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <EducationNavbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('education.admin.title')}</h1>
          <p className="text-muted-foreground">Manage your education platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.path}
                className="glass cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                onClick={() => navigate(section.path)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <span className="text-3xl font-bold text-primary">{section.stat}</span>
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                  <Button variant="link" className="p-0 h-auto mt-4">
                    Manage →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="btn-primary">
              Create New Course
            </Button>
            <Button variant="outline">
              Add Instructor
            </Button>
            <Button variant="outline">
              Export Data
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 glass rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Admin Notes</h3>
          <p className="text-sm text-muted-foreground">
            This is the admin dashboard for managing the education platform. 
            From here you can manage courses, users, categories, instructors, reviews, and view analytics.
            The full admin CMS functionality will be expanded in future updates.
          </p>
        </div>
      </div>
    </div>
  );
};

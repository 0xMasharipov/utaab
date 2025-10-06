import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  BookOpen,
  Award,
  Settings,
  Bell,
  Shield,
  ChevronRight,
  Download,
  Mail,
  Calendar,
  GraduationCap,
  Lock,
  Eye,
  LayoutDashboard
} from 'lucide-react';

export const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/education/sign-in');
        return;
      }
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('education_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Check if user is admin
  const isAdmin = user?.email === '0xz2n@gmail.com';

  // Fetch enrollments and progress
  const { data: enrollments } = useQuery({
    queryKey: ['user-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id,
            slug,
            title_en,
            title_tr,
            title_ru,
            title_ar,
            hero_image
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch certificates
  const { data: certificates } = useQuery({
    queryKey: ['user-certificates', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            id,
            title_en,
            title_tr,
            title_ru,
            title_ar
          )
        `)
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email_course_updates: profile?.email_course_updates ?? false,
    email_newsletters: profile?.email_newsletters ?? false,
    email_marketing: profile?.email_marketing ?? false,
  });

  // Update notification preferences
  const updateNotifications = async (key: string, value: boolean) => {
    if (!user?.id) return;

    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);

    const { error } = await supabase
      .from('education_profiles')
      .update({ [key]: value })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Notification preferences updated',
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCourseTitle = (course: any) => {
    const locale = i18n.language;
    return course?.[`title_${locale}`] || course?.title_en || 'Untitled Course';
  };

  const avgProgress = enrollments?.length
    ? enrollments.reduce((sum, e) => sum + (Number(e.progress) || 0), 0) / enrollments.length
    : 0;

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background gradient-mesh">
        <EducationNavbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      <EducationNavbar />
      
      <div className="section-container py-8 md:py-12">
        {/* Profile Header */}
        <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {profile.full_name}
              </h1>
              <p className="text-muted-foreground mb-3">{user.email}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="glass">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {profile.role}
                </Badge>
                <Badge variant="outline" className="glass">
                  {profile.department}
                </Badge>
                {isAdmin && (
                  <Badge className="bg-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-foreground">
                    {enrollments?.length || 0} {t('common.courses') || 'Courses'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="text-foreground">
                    {certificates?.length || 0} Certificates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-foreground">
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={() => navigate('/education/admin')}
                className="bg-primary hover:bg-primary/90"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-strong p-1.5 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl">
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-xl">
              <BookOpen className="h-4 w-4 mr-2" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-xl">
              <Award className="h-4 w-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BookOpen className="h-5 w-5 text-accent" />
                    Active Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {enrollments?.filter(e => !e.completed).length || 0}
                  </div>
                  <Progress value={avgProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(avgProgress)}% Average Progress
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Award className="h-5 w-5 text-accent" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {enrollments?.filter(e => e.completed).length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Courses Finished
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {certificates?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Earned Certificates
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Courses</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.slice(0, 3).map((enrollment: any) => (
                      <div
                        key={enrollment.id}
                        className="glass rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => navigate(`/education/learn/${enrollment.courses.slug}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">
                              {getCourseTitle(enrollment.courses)}
                            </h4>
                            <Progress value={Number(enrollment.progress) || 0} className="h-2 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {Math.round(Number(enrollment.progress) || 0)}% Complete
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
                    <Button onClick={() => navigate('/education/courses')}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            {enrollments && enrollments.length > 0 ? (
              enrollments.map((enrollment: any) => (
                <Card key={enrollment.id} className="glass-strong border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {getCourseTitle(enrollment.courses)}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground font-medium">
                              {Math.round(Number(enrollment.progress) || 0)}%
                            </span>
                          </div>
                          <Progress value={Number(enrollment.progress) || 0} className="h-2" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => navigate(`/education/learn/${enrollment.courses.slug}`)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {enrollment.completed ? 'Review' : 'Continue Learning'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/education/course/${enrollment.courses.slug}`)}
                            className="glass"
                          >
                            Course Details
                          </Button>
                        </div>
                      </div>
                      {enrollment.completed && (
                        <Badge className="bg-green-600">Completed</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass-strong border-white/20">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Courses Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Button onClick={() => navigate('/education/courses')} className="bg-primary">
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-4">
            {certificates && certificates.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {certificates.map((cert: any) => (
                  <Card key={cert.id} className="glass-strong border-white/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Award className="h-12 w-12 text-accent" />
                        <Badge variant="outline" className="glass">
                          {new Date(cert.issued_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {getCourseTitle(cert.courses)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Certificate #{cert.certificate_number}
                      </p>
                      <Button variant="outline" className="w-full glass">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-strong border-white/20">
                <CardContent className="p-12 text-center">
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Certificates Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Complete courses to earn certificates
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Notifications */}
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="course-updates" className="text-foreground">Course Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new lessons and course changes
                    </p>
                  </div>
                  <Switch
                    id="course-updates"
                    checked={notifications.email_course_updates}
                    onCheckedChange={(checked) => updateNotifications('email_course_updates', checked)}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletters" className="text-foreground">Newsletters</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive our weekly newsletter with tips and updates
                    </p>
                  </div>
                  <Switch
                    id="newsletters"
                    checked={notifications.email_newsletters}
                    onCheckedChange={(checked) => updateNotifications('email_newsletters', checked)}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing" className="text-foreground">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Get information about new courses and special offers
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={notifications.email_marketing}
                    onCheckedChange={(checked) => updateNotifications('email_marketing', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & KVKK */}
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="h-5 w-5" />
                  Privacy & Data Protection (KVKK)
                </CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    You have the right to access, modify, or delete your personal data in accordance with KVKK regulations.
                  </p>
                  <Button
                    variant="outline"
                    className="glass"
                    onClick={() => navigate('/kvkk-request')}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Submit Data Request
                  </Button>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2">
                  <Label className="text-foreground">KVKK Consent Version</Label>
                  <p className="text-sm text-muted-foreground">
                    Version {profile.kvkk_consent_version} - Accepted on{' '}
                    {new Date(profile.kvkk_consent_timestamp).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.full_name}
                    disabled
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-foreground">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    disabled
                    className="glass"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

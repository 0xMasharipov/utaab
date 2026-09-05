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
  LayoutDashboard,
  Bookmark,
  ExternalLink,
  AlertCircle,
  FileText
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

  // Check if user is admin using proper role-based access control
  const { data: isAdmin } = useQuery({
    queryKey: ['user-admin-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      return data ?? false;
    },
    enabled: !!user?.id,
  });

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

  // Fetch saved items
  const { data: savedItems } = useQuery({
    queryKey: ['user-saved-items', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch notifications
  const { data: notificationsList } = useQuery({
    queryKey: ['user-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_course_updates: profile?.email_course_updates ?? false,
    email_newsletters: profile?.email_newsletters ?? false,
    email_marketing: profile?.email_marketing ?? false,
  });

  // Update notification preferences
  const updateNotificationPrefs = async (key: string, value: boolean) => {
    if (!user?.id) return;

    const newPrefs = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(newPrefs);

    const { error } = await supabase
      .from('education_profiles')
      .update({ [key]: value })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: t('education.profile.settings.update_error_title'),
        description: t('education.profile.settings.update_error_description'),
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('education.profile.settings.update_success_title'),
        description: t('education.profile.settings.update_success_description'),
      });
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  };

  // Remove saved item
  const removeSavedItem = async (itemId: string) => {
    await supabase
      .from('saved_items')
      .delete()
      .eq('id', itemId);
    toast({
      title: t('education.profile.saved.removed_title'),
      description: t('education.profile.saved.removed_description'),
    });
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
    return course?.[`title_${locale}`] || course?.title_en || t('education.profile.untitled_course');
  };

  const avgProgress = enrollments?.length
    ? enrollments.reduce((sum, e) => sum + (Number(e.progress) || 0), 0) / enrollments.length
    : 0;

  if (!user || !profile) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <EducationNavbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-xl bg-white/[0.06]" />
            <p className="text-muted-foreground">{t('education.profile.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <EducationNavbar />
      
      <main className="section-container pb-28 pt-28 md:pt-32">
        {/* Profile Header */}
        <div className="glass-strong mb-8 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="mb-2 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">
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
                    {t('education.profile.admin_badge')}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-foreground">
                    {enrollments?.length || 0} {t('education.profile.courses_label')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="text-foreground">
                    {certificates?.length || 0} {t('education.profile.certificates_label')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-foreground">
                    {t('education.profile.joined_prefix')} {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={() => navigate('/v8k2m9x4/p3')}
                className="bg-primary hover:bg-primary/90"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {t('education.profile.management_button')}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-strong p-1.5 rounded-2xl w-full overflow-x-auto flex-nowrap justify-start">
            <TabsTrigger value="overview" className="rounded-xl flex-shrink-0 snap-start">
              <Eye className="h-4 w-4 mr-2" />
              {t('education.profile.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-xl flex-shrink-0 snap-start">
              <BookOpen className="h-4 w-4 mr-2" />
              {t('education.profile.tabs.my_courses')}
            </TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-xl flex-shrink-0 snap-start">
              <Award className="h-4 w-4 mr-2" />
              {t('education.profile.tabs.certificates')}
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-xl flex-shrink-0 snap-start">
              <Bookmark className="h-4 w-4 mr-2" />
              {t('education.profile.tabs.saved')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl flex-shrink-0 snap-start">
              <Bell className="h-4 w-4 mr-2" />
              {t('education.profile.tabs.notifications')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl flex-shrink-0 snap-start">
              <Settings className="h-4 w-4 mr-2" />
              {t('education.profile.tabs.settings')}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-xl flex-shrink-0 snap-start">
              <Shield className="h-4 w-4 mr-2" />
              {t('education.profile.tabs.privacy')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BookOpen className="h-5 w-5 text-accent" />
                    {t('education.profile.overview.active_courses')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {enrollments?.filter(e => !e.completed).length || 0}
                  </div>
                  <Progress value={avgProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('education.profile.overview.average_progress', { percent: Math.round(avgProgress) })}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Award className="h-5 w-5 text-accent" />
                    {t('education.profile.overview.completed')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {enrollments?.filter(e => e.completed).length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('education.profile.overview.courses_finished')}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    {t('education.profile.tabs.certificates')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {certificates?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('education.profile.overview.earned_certificates')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">{t('education.profile.overview.recent_courses')}</CardTitle>
                <CardDescription>{t('education.profile.overview.recent_courses_subtitle')}</CardDescription>
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
                              {t('education.profile.overview.complete_label', { percent: Math.round(Number(enrollment.progress) || 0) })}
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
                    <p className="text-muted-foreground mb-4">{t('education.profile.overview.no_enrolled')}</p>
                    <Button onClick={() => navigate('/education/courses')}>
                      {t('education.profile.overview.browse_courses')}
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
                            <span className="text-muted-foreground">{t('education.profile.courses.progress')}</span>
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
                            {enrollment.completed ? t('education.profile.courses.review') : t('education.profile.courses.continue_learning')}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/education/course/${enrollment.courses.slug}`)}
                            className="glass"
                          >
                            {t('education.profile.courses.course_details')}
                          </Button>
                        </div>
                      </div>
                      {enrollment.completed && (
                        <Badge className="bg-green-600">{t('education.profile.courses.completed_badge')}</Badge>
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
                    {t('education.profile.courses.no_courses_title')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t('education.profile.courses.no_courses_subtitle')}
                  </p>
                  <Button onClick={() => navigate('/education/courses')} className="bg-primary">
                    {t('education.profile.overview.browse_courses')}
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
                        {t('education.profile.certificates.number_label', { number: cert.certificate_number })}
                      </p>
                      <Button variant="outline" className="w-full glass">
                        <Download className="h-4 w-4 mr-2" />
                        {t('education.profile.certificates.download')}
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
                    {t('education.profile.certificates.no_certificates_title')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t('education.profile.certificates.no_certificates_subtitle')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved" className="space-y-4">
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">{t('education.profile.saved.title')}</CardTitle>
                <CardDescription>{t('education.profile.saved.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                {savedItems && savedItems.length > 0 ? (
                  <div className="space-y-3">
                    {savedItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Bookmark className="h-5 w-5 text-accent" />
                          <div>
                            <p className="text-foreground font-medium capitalize">{item.item_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {t('education.profile.saved.saved_on', { date: new Date(item.created_at).toLocaleDateString() })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSavedItem(item.id)}
                        >
                          {t('education.profile.saved.remove')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('education.profile.saved.no_saved')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">{t('education.profile.notifications.title')}</CardTitle>
                <CardDescription>{t('education.profile.notifications.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                {notificationsList && notificationsList.length > 0 ? (
                  <div className="space-y-3">
                    {notificationsList.map((notif: any) => (
                      <div
                        key={notif.id}
                        className={`glass rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all ${
                          !notif.read ? 'border-l-4 border-accent' : ''
                        }`}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) navigate(notif.link);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Bell className={`h-5 w-5 mt-0.5 ${notif.read ? 'text-muted-foreground' : 'text-accent'}`} />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{notif.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notif.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('education.profile.notifications.no_notifications')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">{t('education.profile.settings.email_preferences')}</CardTitle>
                <CardDescription>{t('education.profile.settings.email_preferences_subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">{t('education.profile.settings.course_updates')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('education.profile.settings.course_updates_subtitle')}
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.email_course_updates}
                    onCheckedChange={(checked) => updateNotificationPrefs('email_course_updates', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">{t('education.profile.settings.newsletters')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('education.profile.settings.newsletters_subtitle')}
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.email_newsletters}
                    onCheckedChange={(checked) => updateNotificationPrefs('email_newsletters', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">{t('education.profile.settings.marketing')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('education.profile.settings.marketing_subtitle')}
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.email_marketing}
                    onCheckedChange={(checked) => updateNotificationPrefs('email_marketing', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">{t('education.profile.settings.account_information')}</CardTitle>
                <CardDescription>{t('education.profile.settings.account_information_subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-foreground">{t('education.profile.settings.email_label')}</Label>
                  <Input value={user.email} disabled className="glass mt-1.5" />
                </div>
                <div>
                  <Label className="text-foreground">{t('education.profile.settings.full_name_label')}</Label>
                  <Input value={profile.full_name} disabled className="glass mt-1.5" />
                </div>
                <div>
                  <Label className="text-foreground">{t('education.profile.settings.department_label')}</Label>
                  <Input value={profile.department} disabled className="glass mt-1.5" />
                </div>
                <div>
                  <Label className="text-foreground">{t('education.profile.settings.role_label')}</Label>
                  <Input value={profile.role} disabled className="glass mt-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Lock className="h-5 w-5 text-accent" />
                  {t('education.profile.settings.security')}
                </CardTitle>
                <CardDescription>{t('education.profile.settings.security_subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="glass">
                  {t('education.profile.settings.change_password')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="glass-strong border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="h-5 w-5 text-accent" />
                  {t('education.profile.privacy.title')}
                </CardTitle>
                <CardDescription>{t('education.profile.privacy.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">{t('education.profile.privacy.kvkk_consent')}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('education.profile.privacy.version_label', { version: profile.kvkk_consent_version })}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('education.profile.privacy.consent_given', { date: new Date(profile.kvkk_consent_timestamp).toLocaleDateString() })}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">{t('education.profile.privacy.data_categories')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between glass rounded-xl p-3">
                      <span className="text-sm text-foreground">{t('education.profile.privacy.essential_data')}</span>
                      <Badge variant="outline">{t('education.profile.privacy.required_badge')}</Badge>
                    </div>
                    <div className="flex items-center justify-between glass rounded-xl p-3">
                      <span className="text-sm text-foreground">{t('education.profile.privacy.analytics')}</span>
                      <Badge variant="outline">{t('education.profile.privacy.active_badge')}</Badge>
                    </div>
                    <div className="flex items-center justify-between glass rounded-xl p-3">
                      <span className="text-sm text-foreground">{t('education.profile.privacy.performance')}</span>
                      <Badge variant="outline">{t('education.profile.privacy.active_badge')}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">{t('education.profile.privacy.your_rights')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('education.profile.privacy.rights_description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass"
                      onClick={() => navigate('/kvkk-request')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t('education.profile.privacy.make_data_request')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass"
                      onClick={() => window.open('/privacy', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('education.profile.privacy.privacy_policy')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass"
                      onClick={() => window.open('/cookie-policy', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('education.profile.privacy.cookie_policy')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/20 border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  {t('education.profile.privacy.danger_zone')}
                </CardTitle>
                <CardDescription>{t('education.profile.privacy.danger_zone_subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm">
                  {t('education.profile.privacy.request_deletion')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

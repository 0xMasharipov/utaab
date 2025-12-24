import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  BookOpen, 
  Award, 
  Bookmark, 
  Bell, 
  Settings, 
  Shield,
  ArrowLeft,
  Globe
} from 'lucide-react';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileCourses from '@/components/profile/ProfileCourses';
import ProfileCertificates from '@/components/profile/ProfileCertificates';
import ProfileSaved from '@/components/profile/ProfileSaved';
import ProfileNotifications from '@/components/profile/ProfileNotifications';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfilePrivacy from '@/components/profile/ProfilePrivacy';
import ProfileAdminMode from '@/components/profile/ProfileAdminMode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Profile() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate('/education/sign-in');
        return;
      }

      setUser(authUser);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('education_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      setProfile(profileData);

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id);

      if (rolesError) throw rolesError;
      const userRoles = rolesData?.map((r: any) => r.role) || [];
      setRoles(userRoles);
      
      // UI-only admin check - actual authorization is enforced server-side via RLS policies and edge functions
      setIsAdmin(userRoles.includes('admin'));
    } catch (error: any) {
      toast.error('Failed to load profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (locale: string) => {
    i18n.changeLanguage(locale);
    if (profile) {
      const { error } = await supabase
        .from('education_profiles')
        .update({ locale })
        .eq('user_id', user.id);
      
      if (error) toast.error('Failed to update language');
    }
  };

  const getRoleBadge = () => {
    if (roles.includes('admin')) return <Badge variant="default">Admin</Badge>;
    if (roles.includes('community_admin')) return <Badge variant="outline">Community Admin</Badge>;
    if (roles.includes('instructor')) return <Badge>Instructor</Badge>;
    return <Badge variant="secondary">Student</Badge>;
  };

  const getEnrollmentStats = () => {
    // These would be fetched from actual data in production
    return {
      enrolled: 0,
      completed: 0,
      inProgress: 0,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getEnrollmentStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-strong border-b border-white/10 pt-24 md:pt-28">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            className="mb-4 gap-2"
            onClick={() => navigate('/education')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Education
          </Button>

          {/* Profile Header Card */}
          <Card className="glass-panel p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile?.full_name || 'User'}</h1>
                  <div className="flex flex-wrap gap-2 items-center">
                    {getRoleBadge()}
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                  {profile?.department && (
                    <p className="text-muted-foreground mt-2">{profile.department}</p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.enrolled}</div>
                    <p className="text-sm text-muted-foreground">Enrolled</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.completed}</div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Select value={i18n.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-panel w-full overflow-x-auto flex-nowrap justify-start gap-1 p-1.5">
            <TabsTrigger value="overview" className="gap-2 flex-shrink-0 snap-start">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2 flex-shrink-0 snap-start">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2 flex-shrink-0 snap-start">
              <Award className="h-4 w-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2 flex-shrink-0 snap-start">
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 flex-shrink-0 snap-start">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 flex-shrink-0 snap-start">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2 flex-shrink-0 snap-start">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="gap-2 border-l border-white/10 ml-2 flex-shrink-0 snap-start">
                <Shield className="h-4 w-4 text-primary" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            <ProfileOverview profile={profile} user={user} />
          </TabsContent>

          <TabsContent value="courses">
            <ProfileCourses userId={user?.id} />
          </TabsContent>

          <TabsContent value="certificates">
            <ProfileCertificates userId={user?.id} />
          </TabsContent>

          <TabsContent value="saved">
            <ProfileSaved userId={user?.id} />
          </TabsContent>

          <TabsContent value="notifications">
            <ProfileNotifications userId={user?.id} />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileSettings profile={profile} userId={user?.id} onUpdate={fetchUserData} />
          </TabsContent>

          <TabsContent value="privacy">
            <ProfilePrivacy profile={profile} userId={user?.id} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <ProfileAdminMode userId={user?.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserPlus, Search, Filter, MoreVertical, Shield, Ban, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { RoleManagementDialog } from '@/components/admin/RoleManagementDialog';

// Role badge colors
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/50',
  moderator: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  instructor: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  community_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  student: 'bg-green-500/20 text-green-400 border-green-500/50',
  user: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

interface UserRole {
  role: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  department: string;
  role: string;
  created_at: string;
  user_roles: UserRole[];
}

export const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data: profilesData, error } = await supabase
        .from('education_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Fetch user roles for all profiles
      // Admins can now see all roles thanks to the new RLS policy
      const profilesWithRoles = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { data: rolesData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id);
          return { ...profile, user_roles: rolesData || [] };
        })
      );
      
      return profilesWithRoles as UserProfile[];
    },
  });

  // Count roles for stats
  const roleStats = profiles?.reduce((acc, profile) => {
    profile.user_roles?.forEach((r) => {
      acc[r.role] = (acc[r.role] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>) || {};

  const filteredProfiles = profiles?.filter((profile) => {
    const matchesSearch = profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || profile.user_roles?.some((r) => r.role === roleFilter);
    return matchesSearch && matchesRole;
  });

  const handleManageRoles = (profile: UserProfile) => {
    setSelectedUser(profile);
    setIsRoleDialogOpen(true);
  };

  const handleRoleUpdated = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users & Roles</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button className="btn-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{profiles?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold">{roleStats['admin'] || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Moderators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span className="text-2xl font-bold">{roleStats['moderator'] || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Instructors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold">{roleStats['instructor'] || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="community_admin">Community Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading users...</p>
            </CardContent>
          </Card>
        ) : filteredProfiles && filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <Card key={profile.id} className="glass hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {profile.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold truncate">{profile.full_name}</h3>
                        {profile.user_roles && profile.user_roles.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {profile.user_roles.map((r, idx) => (
                              <Badge 
                                key={idx} 
                                className={`text-xs ${ROLE_COLORS[r.role] || ROLE_COLORS.user}`}
                              >
                                {r.role === 'community_admin' ? 'Community' : r.role.charAt(0).toUpperCase() + r.role.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {(!profile.user_roles || profile.user_roles.length === 0) && (
                          <Badge className={ROLE_COLORS.user}>No Roles</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{profile.department} • {profile.role}</p>
                        <p>Joined {format(new Date(profile.created_at), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong">
                      <DropdownMenuItem onClick={() => handleManageRoles(profile)}>
                        <Shield className="h-4 w-4 mr-2" />
                        Manage Roles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-400">
                        <Ban className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass">
            <CardContent className="p-12 text-center">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search' : 'Invite your first user'}
              </p>
              <Button className="btn-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Role Management Dialog */}
      <RoleManagementDialog
        user={selectedUser}
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        onRoleUpdated={handleRoleUpdated}
      />
    </div>
  );
};

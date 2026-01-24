import { useState, useEffect } from 'react';
import { Search, UserPlus, Mail, Shield, Users as UsersIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [communityAdmins, setCommunityAdmins] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'moderator',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('education_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles for each profile separately (no FK relationship exists)
      const profilesWithRoles = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { data: rolesData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id);
          return { ...profile, user_roles: rolesData || [] };
        })
      );

      setUsers(profilesWithRoles);

      // Filter admins and community admins
      const adminsList = profilesWithRoles.filter((p: any) =>
        p.user_roles?.some((r: any) => r.role === 'admin')
      );
      const communityAdminsList = profilesWithRoles.filter((p: any) =>
        p.user_roles?.some((r: any) => r.role === 'community_admin')
      );

      setAdmins(adminsList);
      setCommunityAdmins(communityAdminsList);

      // Fetch admin sessions separately (no FK join)
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('admin_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Enrich sessions with profile names
      const enrichedSessions = await Promise.all(
        (sessionsData || []).map(async (session) => {
          const { data: profileData } = await supabase
            .from('education_profiles')
            .select('full_name')
            .eq('user_id', session.user_id)
            .single();
          return { ...session, education_profiles: profileData };
        })
      );

      setSessions(enrichedSessions);
    } catch (error: any) {
      toast.error('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('admin_invitations').insert([{
        email: newInvite.email,
        role: newInvite.role as any,
        invited_by: user.id,
      }]);

      if (error) throw error;

      toast.success('Invitation sent successfully');
      setInviteDialogOpen(false);
      setNewInvite({ email: '', role: 'moderator' });
    } catch (error: any) {
      toast.error('Failed to send invitation: ' + error.message);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('admin_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast.success('Session revoked successfully');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to revoke session: ' + error.message);
    }
  };

  const getRoleBadge = (roles: any[]) => {
    if (!roles || roles.length === 0) return <Badge variant="secondary">User</Badge>;
    
    const roleNames = roles.map((r: any) => r.role);
    if (roleNames.includes('admin')) return <Badge variant="default">Admin</Badge>;
    if (roleNames.includes('community_admin')) return <Badge variant="outline">Community Admin</Badge>;
    return <Badge variant="secondary">User</Badge>;
  };

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users & Roles</h1>
          <p className="text-muted-foreground">Manage users, roles, and sessions</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Admin User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInvite.email}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, email: e.target.value })
                  }
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newInvite.role}
                  onValueChange={(value) =>
                    setNewInvite({ ...newInvite, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="community_admin">Community Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSendInvite} className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>
        <Card className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{admins.length}</div>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </Card>
        <Card className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{communityAdmins.length}</div>
              <p className="text-sm text-muted-foreground">Community Admins</p>
            </div>
          </div>
        </Card>
        <Card className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="community">Community Admins</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="glass-panel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getRoleBadge(user.user_roles)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card className="glass-panel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getRoleBadge(user.user_roles)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card className="glass-panel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communityAdmins.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getRoleBadge(user.user_roles)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card className="glass-panel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.education_profiles?.full_name || 'N/A'}</TableCell>
                    <TableCell>{session.ip_address || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(session.last_activity).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(session.expires_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

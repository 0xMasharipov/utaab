import { useState, useEffect } from 'react';
import { Search, UserPlus, Mail, Shield, Users as UsersIcon, Clock, Eye, FileUser, ExternalLink, Filter, GitMerge } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApplicantConversionDialog } from '@/components/admin/ApplicantConversionDialog';
import { RoleManagementDialog } from '@/components/admin/RoleManagementDialog';

// Status badge configuration
const STATUS_BADGES: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'outline', label: 'Pending' },
  approved: { variant: 'secondary', label: 'Approved' },
  rejected: { variant: 'destructive', label: 'Rejected' },
  converted: { variant: 'default', label: 'Converted' },
};

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [communityAdmins, setCommunityAdmins] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [previewApplicant, setPreviewApplicant] = useState<any>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [conversionDialogOpen, setConversionDialogOpen] = useState(false);
  const [selectedApplicantForConversion, setSelectedApplicantForConversion] = useState<any>(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState<any>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
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

      // Fetch community applicants
      const { data: applicantsData, error: applicantsError } = await supabase
        .from('community_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicantsError) throw applicantsError;
      setApplicants(applicantsData || []);
    } catch (error: any) {
      toast.error('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openApplicantPreview = (applicant: any) => {
    setPreviewApplicant(applicant);
    setPreviewDialogOpen(true);
  };

  const openConversionDialog = (applicant: any) => {
    setSelectedApplicantForConversion(applicant);
    setConversionDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_BADGES[status] || STATUS_BADGES.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSendInvite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if an invitation already exists for this email
      const { data: existingInvite, error: checkError } = await supabase
        .from('admin_invitations')
        .select('id, expires_at, accepted_at')
        .eq('email', newInvite.email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingInvite) {
        const isExpired = new Date(existingInvite.expires_at) < new Date();
        const isAccepted = existingInvite.accepted_at !== null;

        if (isAccepted) {
          toast.error('This user has already accepted an invitation');
          return;
        }

        if (!isExpired) {
          toast.error('An active invitation already exists for this email');
          return;
        }

        // Delete expired invitation before creating new one
        const { error: deleteError } = await supabase
          .from('admin_invitations')
          .delete()
          .eq('id', existingInvite.id);

        if (deleteError) throw deleteError;
      }

      // Insert new invitation
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

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div className="grid gap-4 md:grid-cols-5">
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
        <Card className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <FileUser className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{applicants.length}</div>
              <p className="text-sm text-muted-foreground">Applicants</p>
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
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
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
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Manage Roles"
                        onClick={() => {
                          setSelectedUserForRole(user);
                          setRoleDialogOpen(true);
                        }}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
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

        <TabsContent value="applicants">
          {/* Status Filter for Applicants */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
            </div>
          </div>

          <Card className="glass-panel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="font-medium">{applicant.full_name}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{applicant.department || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{applicant.experience_level || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(applicant.status || 'pending')}</TableCell>
                    <TableCell>
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => openApplicantPreview(applicant)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        {applicant.status === 'pending' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-1"
                            onClick={() => openConversionDialog(applicant)}
                          >
                            <UserPlus className="h-4 w-4" />
                            Convert
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredApplicants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No applicants found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Applicant Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
          </DialogHeader>
          {previewApplicant && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Full Name</Label>
                      <p className="font-medium">{previewApplicant.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Email</Label>
                      <p className="font-medium">{previewApplicant.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Telegram</Label>
                      <p className="font-medium">{previewApplicant.telegram || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Department</Label>
                      <p className="font-medium">{previewApplicant.department || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Country</Label>
                      <p className="font-medium">{previewApplicant.country || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">City</Label>
                      <p className="font-medium">{previewApplicant.city || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Experience & Interests */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Experience & Interests</h3>
                  <div>
                    <Label className="text-muted-foreground text-xs">Experience Level</Label>
                    <div className="mt-1">
                      <Badge>{previewApplicant.experience_level || 'N/A'}</Badge>
                    </div>
                  </div>
                  {previewApplicant.interests && previewApplicant.interests.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Interests</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {previewApplicant.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {previewApplicant.preferred_tracks && previewApplicant.preferred_tracks.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Preferred Tracks</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {previewApplicant.preferred_tracks.map((track: string) => (
                          <Badge key={track} variant="outline">{track}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Links</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {previewApplicant.github_url && (
                      <a
                        href={previewApplicant.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        GitHub: {previewApplicant.github_url}
                      </a>
                    )}
                    {previewApplicant.portfolio_url && (
                      <a
                        href={previewApplicant.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Portfolio: {previewApplicant.portfolio_url}
                      </a>
                    )}
                    {previewApplicant.linkedin_url && (
                      <a
                        href={previewApplicant.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn: {previewApplicant.linkedin_url}
                      </a>
                    )}
                    {!previewApplicant.github_url && !previewApplicant.portfolio_url && !previewApplicant.linkedin_url && (
                      <p className="text-muted-foreground">No links provided</p>
                    )}
                  </div>
                </div>

                {/* Availability & Motivation */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Availability & Motivation</h3>
                  <div>
                    <Label className="text-muted-foreground text-xs">Weekly Availability</Label>
                    <p className="font-medium">{previewApplicant.availability_hours || 'N/A'} hours</p>
                  </div>
                  {previewApplicant.motivation && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Motivation</Label>
                      <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md">{previewApplicant.motivation}</p>
                    </div>
                  )}
                </div>

                {/* Meta Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Application Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Applied On</Label>
                      <p className="font-medium">
                        {new Date(previewApplicant.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Language</Label>
                      <p className="font-medium">{previewApplicant.locale?.toUpperCase() || 'EN'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Status</Label>
                      {getStatusBadge(previewApplicant.status || 'pending')}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">KVKK Consent</Label>
                      <Badge variant={previewApplicant.kvkk_consent ? "default" : "destructive"}>
                        {previewApplicant.kvkk_consent ? 'Accepted' : 'Not Accepted'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Pending Applications */}
                {previewApplicant.status === 'pending' && (
                  <div className="pt-4 border-t">
                    <Button
                      className="w-full gap-2"
                      onClick={() => {
                        setPreviewDialogOpen(false);
                        openConversionDialog(previewApplicant);
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Convert to User
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Applicant Conversion Dialog */}
      <ApplicantConversionDialog
        applicant={selectedApplicantForConversion}
        open={conversionDialogOpen}
        onOpenChange={setConversionDialogOpen}
        onSuccess={fetchData}
      />

      {/* Role Management Dialog */}
      <RoleManagementDialog
        user={selectedUserForRole}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onRoleUpdated={fetchData}
      />
    </div>
  );
}

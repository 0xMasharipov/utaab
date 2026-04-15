import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminCommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    if (id) {
      fetchCommunityDetails();
    }
  }, [id]);

  const fetchCommunityDetails = async () => {
    try {
      // Fetch community
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();

      if (communityError) throw communityError;
      setCommunity(communityData);

      // Fetch admins
      const { data: adminsData, error: adminsError } = await supabase
        .from('community_admins')
        .select('*, education_profiles!inner(full_name, email:user_id)')
        .eq('community_id', id);

      if (adminsError) throw adminsError;
      setAdmins(adminsData || []);

      // Fetch members (from community_applications)
      const { data: membersData, error: membersError } = await supabase
        .from('community_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (membersError) throw membersError;
      setMembers(membersData || []);
    } catch (error: any) {
      toast.error('Failed to load community details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    try {
      // Use secure edge function to lookup user by email
      const { data: userData, error: lookupError } = await supabase.functions.invoke('lookup-user-by-email', {
        body: { email: adminEmail }
      });

      if (lookupError) throw lookupError;
      if (!userData) throw new Error('User not found');

      const user = userData;

      // Add community_admin role
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'community_admin',
      });

      if (roleError && !roleError.message.includes('duplicate')) throw roleError;

      // Assign to community
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const { error: assignError } = await supabase.from('community_admins').insert({
        community_id: id,
        user_id: user.id,
        assigned_by: currentUser?.id,
      });

      if (assignError) throw assignError;

      toast.success('Admin added successfully');
      setAddAdminDialogOpen(false);
      setAdminEmail('');
      fetchCommunityDetails();
    } catch (error: any) {
      toast.error('Failed to add admin: ' + error.message);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      const { error } = await supabase
        .from('community_admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast.success('Admin removed successfully');
      fetchCommunityDetails();
    } catch (error: any) {
      toast.error('Failed to remove admin: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!community) {
    return <div>Community not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate('/v8k2m9x4/r2f')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <p className="text-muted-foreground">{community.slug}</p>
          </div>
          <Badge variant={community.is_active ? 'default' : 'secondary'}>
            {community.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        {community.description && (
          <p className="mt-4 text-muted-foreground">{community.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-panel p-6">
          <div className="text-2xl font-bold">{community.member_count || 0}</div>
          <p className="text-sm text-muted-foreground">Total Members</p>
        </Card>
        <Card className="glass-panel p-6">
          <div className="text-2xl font-bold">{admins.length}</div>
          <p className="text-sm text-muted-foreground">Community Admins</p>
        </Card>
        <Card className="glass-panel p-6">
          {community.whatsapp_invite_url ? (
            <a
              href={community.whatsapp_invite_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              WhatsApp Group
            </a>
          ) : (
            <span className="text-muted-foreground">No WhatsApp link</span>
          )}
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Community Admins</h2>
            <Dialog open={addAdminDialogOpen} onOpenChange={setAddAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Community Admin</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">User Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <Button onClick={handleAddAdmin} className="w-full">
                    Add Admin
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="glass-panel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.education_profiles?.full_name || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(admin.assigned_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAdmin(admin.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <h2 className="text-xl font-semibold">Community Members</h2>
          <Card className="glass-panel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">Community Settings</h2>
          <Card className="glass-panel p-6">
            <p className="text-muted-foreground">Settings management coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

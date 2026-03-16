import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, Star, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TeamMemberFormDialog } from '@/components/admin/TeamMemberFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

interface TeamMemberRow {
  id: string;
  full_name: string;
  role_title: string;
  department: string;
  image_url: string | null;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

const DEPARTMENTS = ['All', 'Founder', 'Leadership', 'Engineering', 'Operations', 'Marketing', 'Design'];

const AdminTeamMembers = () => {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<any>(null);
  const [deleteMember, setDeleteMember] = useState<TeamMemberRow | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const filtered = members.filter(m => {
    const matchSearch = m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.role_title.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || m.department === deptFilter;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && m.is_published) ||
      (statusFilter === 'unpublished' && !m.is_published);
    return matchSearch && matchDept && matchStatus;
  });

  const handleDelete = async () => {
    if (!deleteMember) return;
    const { error } = await supabase.from('team_members').delete().eq('id', deleteMember.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Team member removed' });
      fetchMembers();
    }
    setDeleteMember(null);
  };

  const handleEdit = async (member: TeamMemberRow) => {
    const { data } = await supabase.from('team_members').select('*').eq('id', member.id).single();
    if (data) {
      setEditMember(data);
      setFormOpen(true);
    }
  };

  const togglePublish = async (member: TeamMemberRow) => {
    const { error } = await supabase
      .from('team_members')
      .update({ is_published: !member.is_published })
      .eq('id', member.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      fetchMembers();
    }
  };

  const toggleFeatured = async (member: TeamMemberRow) => {
    const { error } = await supabase
      .from('team_members')
      .update({ is_featured: !member.is_featured })
      .eq('id', member.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      fetchMembers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Manage your public team roster</p>
        </div>
        <Button onClick={() => { setEditMember(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Member
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="unpublished">Unpublished</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No team members found</div>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-12">#</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Member</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Department</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Featured</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Published</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                      {member.display_order}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted/20 flex-shrink-0">
                        {member.image_url ? (
                          <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {member.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{member.full_name}</span>
                          {member.is_featured && <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{member.role_title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">{member.department}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-center">
                    <Switch
                      checked={member.is_featured}
                      onCheckedChange={() => toggleFeatured(member)}
                    />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-center">
                    <Switch
                      checked={member.is_published}
                      onCheckedChange={() => togglePublish(member)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteMember(member)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TeamMemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        member={editMember}
        onSuccess={() => { setFormOpen(false); fetchMembers(); }}
      />

      <DeleteConfirmDialog
        open={!!deleteMember}
        onOpenChange={(open) => !open && setDeleteMember(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        description={`Are you sure you want to delete "${deleteMember?.full_name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminTeamMembers;

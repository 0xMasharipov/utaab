import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, Users, Edit, Trash2, Copy, MoreVertical, User } from 'lucide-react';
import AnimatedImage from '@/components/common/AnimatedImage';
import { TeamMemberFormDialog } from '@/components/admin/TeamMemberFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

export default function AdminTeam() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { data: members, isLoading } = useQuery({
    queryKey: ['admin-team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(
          'id, full_name, role_title, department, bio_en, bio_tr, bio_ru, bio_ar, image_url, linkedin_url, twitter_url, instagram_url, telegram_url, website_url, display_order, is_featured, is_published, created_at, updated_at'
        )
        .order('display_order', { ascending: true });
      if (error) throw error;

      // Contact details are admin-only and served through a role-checked function.
      const { data: contacts } = await supabase.rpc('get_team_member_contacts');
      const byId = new Map((contacts ?? []).map((c: any) => [c.id, c]));

      return (data ?? []).map((m: any) => ({
        ...m,
        email: byId.get(m.id)?.email ?? null,
        phone: byId.get(m.id)?.phone ?? null,
      }));
    },
  });


  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-public'] });
      toast.success('Team member deleted');
      setDeleteDialogOpen(false);
      setSelected(null);
    },
    onError: (error: any) => toast.error('Failed to delete: ' + error.message),
  });

  const orderMutation = useMutation({
    mutationFn: async ({ id, display_order }: { id: string; display_order: number }) => {
      const { error } = await supabase.from('team_members').update({ display_order }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-public'] });
    },
    onError: (error: any) => toast.error('Failed to reorder: ' + error.message),
  });

  const filtered = members?.filter((m: any) =>
    `${m.full_name} ${m.role_title} ${m.department}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = () => {
    setSelected(null);
    setFormMode('create');
    setFormDialogOpen(true);
  };

  const handleEdit = (m: any) => {
    setSelected(m);
    setFormMode('edit');
    setFormDialogOpen(true);
  };

  const handleDuplicate = (m: any) => {
    const { id, created_at, updated_at, ...rest } = m;
    setSelected({ ...rest, full_name: `${m.full_name} (copy)`, is_published: false });
    setFormMode('create');
    setFormDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Manage the people shown on the public team page</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, role or section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading team members...</div>
      ) : filtered?.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No team members found</h3>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered?.map((m: any) => (
            <Card key={m.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted/30 flex items-center justify-center">
                    {m.image_url ? (
                      <AnimatedImage src={m.image_url} alt={m.full_name} className="h-16 w-16 object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{m.full_name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {m.role_title} · {m.department}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className={m.is_published ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-gray-500/20 text-gray-700 dark:text-gray-300'}>
                        {m.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {m.is_featured && <Badge variant="outline">Featured</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      aria-label={`Display order for ${m.full_name}`}
                      className="w-20"
                      defaultValue={m.display_order}
                      onBlur={(e) => {
                        const next = parseInt(e.target.value) || 0;
                        if (next !== m.display_order) orderMutation.mutate({ id: m.id, display_order: next });
                      }}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" aria-label={`Actions for ${m.full_name}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(m)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(m)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400"
                          onClick={() => {
                            setSelected(m);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TeamMemberFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        member={selected}
        mode={formMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
        title="Delete Team Member"
        description={`Are you sure you want to delete "${selected?.full_name}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

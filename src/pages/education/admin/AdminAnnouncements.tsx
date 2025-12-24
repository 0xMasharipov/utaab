import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Calendar, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { AnnouncementFormDialog } from '@/components/admin/AnnouncementFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { toast } from 'sonner';

export const AdminAnnouncements = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', announcementId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast.success('Announcement deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedAnnouncement(null);
    },
    onError: (error: any) => {
      toast.error('Failed to delete announcement: ' + error.message);
    },
  });

  const filteredAnnouncements = announcements?.filter((announcement) =>
    announcement.title_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setFormMode('create');
    setFormDialogOpen(true);
  };

  const handleEdit = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setFormMode('edit');
    setFormDialogOpen(true);
  };

  const handleDelete = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const getVisibilityBadge = (visibility: string) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      published: 'bg-green-500/20 text-green-400 border-green-500/50',
      expired: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    return (
      <Badge className={colors[visibility as keyof typeof colors] || colors.draft}>
        {visibility}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Manage platform announcements and updates</p>
        </div>
        <Button className="btn-primary" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Search */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading announcements...</p>
            </CardContent>
          </Card>
        ) : filteredAnnouncements && filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="glass hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold truncate">{announcement.title_en}</h3>
                      {getVisibilityBadge(announcement.visibility)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {announcement.body_en?.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                      </span>
                      <span>•</span>
                      <span>Audience: {announcement.audience_type}</span>
                      <span>•</span>
                      <span>Views: {announcement.impressions}</span>
                      <span>•</span>
                      <span>Clicks: {announcement.clicks}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong">
                      <DropdownMenuItem onClick={() => handleEdit(announcement)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(announcement)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => handleDelete(announcement)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
              <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first announcement to reach your audience
              </p>
              <Button className="btn-primary" onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <AnnouncementFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        announcement={selectedAnnouncement}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => selectedAnnouncement && deleteMutation.mutate(selectedAnnouncement.id)}
        title="Delete Announcement"
        description={`Are you sure you want to delete "${selectedAnnouncement?.title_en}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

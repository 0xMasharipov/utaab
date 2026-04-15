import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminCommunities() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    slug: '',
    description: '',
    whatsapp_invite_url: '',
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*, community_admins(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error: any) {
      toast.error('Failed to load communities: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('communities').insert({
        ...newCommunity,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success('Community created successfully');
      setCreateDialogOpen(false);
      setNewCommunity({ name: '', slug: '', description: '', whatsapp_invite_url: '' });
      fetchCommunities();
    } catch (error: any) {
      toast.error('Failed to create community: ' + error.message);
    }
  };

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">Manage communities and their admins</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Community</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCommunity.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCommunity({
                      ...newCommunity,
                      name,
                      slug: name.toLowerCase().replace(/\s+/g, '-'),
                    });
                  }}
                  placeholder="Community name"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newCommunity.slug}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, slug: e.target.value })
                  }
                  placeholder="community-slug"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCommunity.description}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, description: e.target.value })
                  }
                  placeholder="Community description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Invite URL</Label>
                <Input
                  id="whatsapp"
                  value={newCommunity.whatsapp_invite_url}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, whatsapp_invite_url: e.target.value })
                  }
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
              <Button onClick={handleCreateCommunity} className="w-full">
                Create Community
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCommunities.map((community) => (
          <Card
            key={community.id}
            className="glass-panel p-6 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => navigate(`/v8k2m9x4/r2f/${community.id}`)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{community.name}</h3>
                  <p className="text-sm text-muted-foreground">{community.slug}</p>
                </div>
                <Badge variant={community.is_active ? 'default' : 'secondary'}>
                  {community.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {community.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {community.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{community.member_count || 0} members</span>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Manage
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No communities found</p>
        </div>
      )}
    </div>
  );
}

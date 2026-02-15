import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, Star, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlogPostFormDialog } from '@/components/admin/BlogPostFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  slug: string;
  title_en: string;
  status: string;
  featured: boolean;
  publish_date: string | null;
  created_at: string;
  author_name: string | null;
  tags: string[];
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title_en, status, featured, publish_date, created_at, author_name, tags')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title_en.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deletePost) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', deletePost.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Post deleted successfully' });
      fetchPosts();
    }
    setDeletePost(null);
  };

  const handleEdit = async (post: BlogPost) => {
    const { data } = await supabase.from('blog_posts').select('*').eq('id', post.id).single();
    if (data) {
      setEditPost(data);
      setFormOpen(true);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button onClick={() => { setEditPost(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No posts found</div>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {post.featured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                      <span className="font-medium text-sm">{post.title_en}</span>
                    </div>
                    {post.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="outline" className={statusColor(post.status)}>{post.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                    {post.publish_date ? format(new Date(post.publish_date), 'MMM d, yyyy') : format(new Date(post.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === 'published' && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeletePost(post)}>
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

      <BlogPostFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editPost}
        onSuccess={() => { setFormOpen(false); fetchPosts(); }}
      />

      <DeleteConfirmDialog
        open={!!deletePost}
        onOpenChange={(open) => !open && setDeletePost(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deletePost?.title_en}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminBlog;

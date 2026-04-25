import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface BlogPostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: any;
  onSuccess: () => void;
}

export const BlogPostFormDialog = ({ open, onOpenChange, post, onSuccess }: BlogPostFormDialogProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title_en: '', title_tr: '', title_ru: '', title_ar: '',
    excerpt_en: '', excerpt_tr: '', excerpt_ru: '', excerpt_ar: '',
    content_en: '[]', content_tr: '[]', content_ru: '[]', content_ar: '[]',
    slug: '',
    cover_image: '',
    gallery: [] as string[],
    video_type: '',
    video_url: '',
    tags: '',
    author_name: '',
    status: 'draft',
    featured: false,
    publish_date: '',
    scheduled_at: '',
    meta_title: '',
    meta_description: '',
    og_image: '',
  });

  useEffect(() => {
    if (post) {
      setForm({
        title_en: post.title_en || '',
        title_tr: post.title_tr || '',
        title_ru: post.title_ru || '',
        title_ar: post.title_ar || '',
        excerpt_en: post.excerpt_en || '',
        excerpt_tr: post.excerpt_tr || '',
        excerpt_ru: post.excerpt_ru || '',
        excerpt_ar: post.excerpt_ar || '',
        ...(() => {
          const c = post.content;
          const stringify = (v: any) => JSON.stringify(Array.isArray(v) ? v : [], null, 2);
          if (Array.isArray(c)) {
            return { content_en: stringify(c), content_tr: '[]', content_ru: '[]', content_ar: '[]' };
          }
          if (c && typeof c === 'object') {
            return {
              content_en: stringify(c.en),
              content_tr: stringify(c.tr),
              content_ru: stringify(c.ru),
              content_ar: stringify(c.ar),
            };
          }
          return { content_en: '[]', content_tr: '[]', content_ru: '[]', content_ar: '[]' };
        })(),
        slug: post.slug || '',
        cover_image: post.cover_image || '',
        gallery: Array.isArray(post.gallery) ? post.gallery.filter((g: any) => typeof g === 'string') : [],
        video_type: post.video_type || '',
        video_url: post.video_url || '',
        tags: (post.tags || []).join(', '),
        author_name: post.author_name || '',
        status: post.status || 'draft',
        featured: post.featured || false,
        publish_date: post.publish_date ? new Date(post.publish_date).toISOString().slice(0, 16) : '',
        scheduled_at: post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        og_image: post.og_image || '',
      });
    } else {
      setForm({
        title_en: '', title_tr: '', title_ru: '', title_ar: '',
        excerpt_en: '', excerpt_tr: '', excerpt_ru: '', excerpt_ar: '',
        content_en: '[]', content_tr: '[]', content_ru: '[]', content_ar: '[]',
        slug: '', cover_image: '', gallery: [], video_type: '', video_url: '',
        tags: '', author_name: '', status: 'draft', featured: false,
        publish_date: '', scheduled_at: '', meta_title: '', meta_description: '', og_image: '',
      });
    }
  }, [post, open]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (val: string) => {
    setForm(f => ({
      ...f,
      title_en: val,
      slug: !post ? generateSlug(val) : f.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.title_en || !form.slug) {
      toast({ title: 'Error', description: 'Title and slug are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    let contentJson;
    try { contentJson = JSON.parse(form.content); } catch { contentJson = []; }

    // Auto-set publish_date when publishing without a date
    const effectivePublishDate = form.status === 'published' && !form.publish_date
      ? new Date().toISOString()
      : form.publish_date ? new Date(form.publish_date).toISOString() : null;

    const payload: any = {
      title_en: form.title_en, title_tr: form.title_tr || null, title_ru: form.title_ru || null, title_ar: form.title_ar || null,
      excerpt_en: form.excerpt_en || null, excerpt_tr: form.excerpt_tr || null, excerpt_ru: form.excerpt_ru || null, excerpt_ar: form.excerpt_ar || null,
      content: contentJson,
      slug: form.slug,
      cover_image: form.cover_image || null,
      gallery: form.gallery.length > 0 ? form.gallery : [],
      video_type: form.video_type || null,
      video_url: form.video_url || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      author_name: form.author_name || null,
      status: form.status,
      featured: form.featured,
      publish_date: effectivePublishDate,
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      og_image: form.og_image || null,
    };

    let error;
    if (post) {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', post.id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: post ? 'Post updated' : 'Post created' });
      onSuccess();
    }
    setSaving(false);
  };

  const update = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Post' : 'New Post'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div>
              <Label>Title (EN) *</Label>
              <Input value={form.title_en} onChange={e => handleTitleChange(e.target.value)} />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={e => update('slug', e.target.value)} />
            </div>
            <div>
              <Label>Excerpt (EN)</Label>
              <Textarea value={form.excerpt_en} onChange={e => update('excerpt_en', e.target.value)} rows={2} />
            </div>
            <div>
              <Label>Content (JSON blocks)</Label>
              <Textarea value={form.content} onChange={e => update('content', e.target.value)} rows={8} className="font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Author</Label>
                <Input value={form.author_name} onChange={e => update('author_name', e.target.value)} />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="web3, blockchain" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => update('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.featured} onCheckedChange={v => update('featured', v)} />
                <Label>Featured</Label>
              </div>
            </div>
            {form.status === 'published' && (
              <div>
                <Label>Publish Date</Label>
                <Input type="datetime-local" value={form.publish_date} onChange={e => update('publish_date', e.target.value)} />
              </div>
            )}
            {form.status === 'scheduled' && (
              <div>
                <Label>Scheduled At</Label>
                <Input type="datetime-local" value={form.scheduled_at} onChange={e => update('scheduled_at', e.target.value)} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-4 mt-4">
            <div>
              <Label>Cover Image</Label>
              <ImageUpload
                value={form.cover_image}
                onChange={url => update('cover_image', url)}
              />
            </div>

            <div>
              <Label>Gallery Images</Label>
              <div className="space-y-3">
                {form.gallery.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border border-border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                      onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <ImageUpload
                  value={null}
                  onChange={url => {
                    if (url) setForm(f => ({ ...f, gallery: [...f.gallery, url] }));
                  }}
                  label="Add gallery image"
                  folder="blog-gallery"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Video Type</Label>
                <Select value={form.video_type} onValueChange={v => update('video_type', v)}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embed">Embed (YouTube/Vimeo)</SelectItem>
                    <SelectItem value="uploaded">Uploaded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Video URL</Label>
                <Input value={form.video_url} onChange={e => update('video_url', e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="translations" className="space-y-4 mt-4">
            {['tr', 'ru', 'ar'].map(lang => (
              <div key={lang} className="space-y-2 p-4 border border-white/10 rounded-xl">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground">{lang.toUpperCase()}</h4>
                <div>
                  <Label>Title ({lang})</Label>
                  <Input value={(form as any)[`title_${lang}`]} onChange={e => update(`title_${lang}`, e.target.value)} />
                </div>
                <div>
                  <Label>Excerpt ({lang})</Label>
                  <Textarea value={(form as any)[`excerpt_${lang}`]} onChange={e => update(`excerpt_${lang}`, e.target.value)} rows={2} />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <div>
              <Label>Meta Title</Label>
              <Input value={form.meta_title} onChange={e => update('meta_title', e.target.value)} />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea value={form.meta_description} onChange={e => update('meta_description', e.target.value)} rows={2} />
            </div>
            <div>
              <Label>OG Image URL</Label>
              <Input value={form.og_image} onChange={e => update('og_image', e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : post ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

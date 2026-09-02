import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface TeamMemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: any;
  mode: 'create' | 'edit';
}

const emptyForm = {
  full_name: '',
  role_title: '',
  department: '',
  bio_en: '',
  bio_tr: '',
  bio_ru: '',
  bio_ar: '',
  image_url: null as string | null,
  email: '',
  phone: '',
  linkedin_url: '',
  twitter_url: '',
  instagram_url: '',
  telegram_url: '',
  website_url: '',
  display_order: 0,
  is_featured: false,
  is_published: true,
};

export function TeamMemberFormDialog({ open, onOpenChange, member, mode }: TeamMemberFormDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (member && mode === 'edit') {
      setFormData({
        full_name: member.full_name || '',
        role_title: member.role_title || '',
        department: member.department || '',
        bio_en: member.bio_en || '',
        bio_tr: member.bio_tr || '',
        bio_ru: member.bio_ru || '',
        bio_ar: member.bio_ar || '',
        image_url: member.image_url || null,
        email: member.email || '',
        phone: member.phone || '',
        linkedin_url: member.linkedin_url || '',
        twitter_url: member.twitter_url || '',
        instagram_url: member.instagram_url || '',
        telegram_url: member.telegram_url || '',
        website_url: member.website_url || '',
        display_order: member.display_order ?? 0,
        is_featured: !!member.is_featured,
        is_published: member.is_published ?? true,
      });
    } else {
      setFormData({ ...emptyForm, ...(member ?? {}) });
    }
  }, [member, mode, open]);

  const mutation = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      const payload = {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        linkedin_url: data.linkedin_url || null,
        twitter_url: data.twitter_url || null,
        instagram_url: data.instagram_url || null,
        telegram_url: data.telegram_url || null,
        website_url: data.website_url || null,
      };
      if (mode === 'create') {
        const { error } = await supabase.from('team_members').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team_members').update(payload).eq('id', member.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-public'] });
      toast.success(mode === 'create' ? 'Team member added' : 'Team member updated');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Failed to save team member: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.role_title || !formData.department) {
      toast.error('Name, role title and department are required');
      return;
    }
    mutation.mutate(formData);
  };

  const set = (patch: Partial<typeof emptyForm>) => setFormData((prev) => ({ ...prev, ...patch }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Team Member' : 'Edit Team Member'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Photo</Label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => set({ image_url: url })}
              accept="image/*"
              folder="team"
              label="Upload Photo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" value={formData.full_name} onChange={(e) => set({ full_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="role_title">Role Title *</Label>
              <Input id="role_title" value={formData.role_title} onChange={(e) => set({ role_title: e.target.value })} placeholder="Lead Developer" />
            </div>
            <div>
              <Label htmlFor="department">Section / Department *</Label>
              <Input id="department" value={formData.department} onChange={(e) => set({ department: e.target.value })} placeholder="Engineering" />
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Tabs defaultValue="en" className="mt-1">
              <TabsList>
                <TabsTrigger value="en">EN</TabsTrigger>
                <TabsTrigger value="tr">TR</TabsTrigger>
                <TabsTrigger value="ru">RU</TabsTrigger>
                <TabsTrigger value="ar">AR</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <Textarea rows={4} value={formData.bio_en} onChange={(e) => set({ bio_en: e.target.value })} />
              </TabsContent>
              <TabsContent value="tr">
                <Textarea rows={4} value={formData.bio_tr} onChange={(e) => set({ bio_tr: e.target.value })} />
              </TabsContent>
              <TabsContent value="ru">
                <Textarea rows={4} value={formData.bio_ru} onChange={(e) => set({ bio_ru: e.target.value })} />
              </TabsContent>
              <TabsContent value="ar">
                <Textarea rows={4} dir="rtl" value={formData.bio_ar} onChange={(e) => set({ bio_ar: e.target.value })} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input id="linkedin_url" value={formData.linkedin_url} onChange={(e) => set({ linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <Label htmlFor="twitter_url">X / Twitter</Label>
              <Input id="twitter_url" value={formData.twitter_url} onChange={(e) => set({ twitter_url: e.target.value })} placeholder="https://x.com/..." />
            </div>
            <div>
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input id="instagram_url" value={formData.instagram_url} onChange={(e) => set({ instagram_url: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="telegram_url">Telegram</Label>
              <Input id="telegram_url" value={formData.telegram_url} onChange={(e) => set({ telegram_url: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="website_url">Website</Label>
              <Input id="website_url" value={formData.website_url} onChange={(e) => set({ website_url: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Contact Email (admin only)</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => set({ email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="phone">Contact Phone (admin only)</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => set({ phone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => set({ display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(v) => set({ is_featured: v })} />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch id="is_published" checked={formData.is_published} onCheckedChange={(v) => set({ is_published: v })} />
              <Label htmlFor="is_published">Published</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Add Member' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

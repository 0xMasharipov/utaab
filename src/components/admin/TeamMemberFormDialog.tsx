import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2 } from 'lucide-react';

const DEPARTMENTS = ['Founder', 'Leadership', 'Engineering', 'Operations', 'Marketing', 'Design'];

interface TeamMemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any | null;
  onSuccess: () => void;
}

export function TeamMemberFormDialog({ open, onOpenChange, member, onSuccess }: TeamMemberFormDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    role_title: '',
    department: 'Operations',
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
  });

  useEffect(() => {
    if (member) {
      setForm({
        full_name: member.full_name || '',
        role_title: member.role_title || '',
        department: member.department || 'Operations',
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
        is_featured: member.is_featured ?? false,
        is_published: member.is_published ?? true,
      });
    } else {
      setForm({
        full_name: '',
        role_title: '',
        department: 'Operations',
        bio_en: '',
        bio_tr: '',
        bio_ru: '',
        bio_ar: '',
        image_url: null,
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
      });
    }
  }, [member, open]);

  const handleSave = async () => {
    if (!form.full_name.trim() || !form.role_title.trim()) {
      toast({ title: 'Validation Error', description: 'Name and role are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (member?.id) {
        const { error } = await supabase
          .from('team_members')
          .update(form)
          .eq('id', member.id);
        if (error) throw error;
        toast({ title: 'Updated', description: 'Team member updated successfully' });
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert(form);
        if (error) throw error;
        toast({ title: 'Created', description: 'Team member added successfully' });
      }
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Role / Position *</Label>
              <Input value={form.role_title} onChange={e => update('role_title', e.target.value)} placeholder="Lead Developer" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <select
                value={form.department}
                onChange={e => update('department', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={form.display_order} onChange={e => update('display_order', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Profile Image */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <ImageUpload
              value={form.image_url}
              onChange={(url) => update('image_url', url)}
              folder="team"
              label="Upload profile photo"
              accept="image/jpeg,image/png,image/webp"
              maxSizeMB={10}
            />
          </div>

          {/* Bio (multi-lang) */}
          <div className="space-y-2">
            <Label>Bio / Description</Label>
            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
                <TabsTrigger value="ru">Русский</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <Textarea value={form.bio_en} onChange={e => update('bio_en', e.target.value)} placeholder="Short bio in English..." rows={3} />
              </TabsContent>
              <TabsContent value="tr">
                <Textarea value={form.bio_tr} onChange={e => update('bio_tr', e.target.value)} placeholder="Kısa biyografi..." rows={3} />
              </TabsContent>
              <TabsContent value="ru">
                <Textarea value={form.bio_ru} onChange={e => update('bio_ru', e.target.value)} placeholder="Краткая биография..." rows={3} />
              </TabsContent>
              <TabsContent value="ar">
                <Textarea value={form.bio_ar} onChange={e => update('bio_ar', e.target.value)} placeholder="نبذة مختصرة..." rows={3} dir="rtl" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+90 ..." />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Social Links</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                <Input value={form.linkedin_url} onChange={e => update('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">X / Twitter</Label>
                <Input value={form.twitter_url} onChange={e => update('twitter_url', e.target.value)} placeholder="https://x.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Instagram</Label>
                <Input value={form.instagram_url} onChange={e => update('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Telegram</Label>
                <Input value={form.telegram_url} onChange={e => update('telegram_url', e.target.value)} placeholder="https://t.me/..." />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Website</Label>
                <Input value={form.website_url} onChange={e => update('website_url', e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={v => update('is_featured', v)} />
              <Label>Featured Member</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={v => update('is_published', v)} />
              <Label>Published</Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {member ? 'Save Changes' : 'Add Member'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

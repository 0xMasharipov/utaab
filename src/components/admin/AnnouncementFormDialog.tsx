import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: any;
  mode: 'create' | 'edit';
}

export function AnnouncementFormDialog({ open, onOpenChange, announcement, mode }: AnnouncementFormDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title_en: '',
    title_tr: '',
    title_ru: '',
    title_ar: '',
    body_en: '',
    body_tr: '',
    body_ru: '',
    body_ar: '',
    audience_type: 'global',
    visibility: 'draft',
    cta_text: '',
    cta_link: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    if (announcement && mode === 'edit') {
      setFormData({
        title_en: announcement.title_en || '',
        title_tr: announcement.title_tr || '',
        title_ru: announcement.title_ru || '',
        title_ar: announcement.title_ar || '',
        body_en: announcement.body_en || '',
        body_tr: announcement.body_tr || '',
        body_ru: announcement.body_ru || '',
        body_ar: announcement.body_ar || '',
        audience_type: announcement.audience_type || 'global',
        visibility: announcement.visibility || 'draft',
        cta_text: announcement.cta_text || '',
        cta_link: announcement.cta_link || '',
        start_time: announcement.start_time ? new Date(announcement.start_time).toISOString().slice(0, 16) : '',
        end_time: announcement.end_time ? new Date(announcement.end_time).toISOString().slice(0, 16) : '',
      });
    } else {
      setFormData({
        title_en: '',
        title_tr: '',
        title_ru: '',
        title_ar: '',
        body_en: '',
        body_tr: '',
        body_ru: '',
        body_ar: '',
        audience_type: 'global',
        visibility: 'draft',
        cta_text: '',
        cta_link: '',
        start_time: '',
        end_time: '',
      });
    }
  }, [announcement, mode, open]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        start_time: data.start_time ? new Date(data.start_time).toISOString() : null,
        end_time: data.end_time ? new Date(data.end_time).toISOString() : null,
      };

      if (mode === 'create') {
        const { error } = await supabase.from('announcements').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', announcement.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast.success(mode === 'create' ? 'Announcement created successfully' : 'Announcement updated successfully');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Failed to save announcement: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en || !formData.body_en) {
      toast.error('Title and body are required');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Announcement' : 'Edit Announcement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title_en">Title (English) *</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Announcement title"
              />
            </div>
            <div>
              <Label htmlFor="title_tr">Title (Turkish)</Label>
              <Input
                id="title_tr"
                value={formData.title_tr}
                onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="title_ru">Title (Russian)</Label>
              <Input
                id="title_ru"
                value={formData.title_ru}
                onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="title_ar">Title (Arabic)</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="body_en">Body (English) *</Label>
            <Textarea
              id="body_en"
              value={formData.body_en}
              onChange={(e) => setFormData({ ...formData, body_en: e.target.value })}
              rows={4}
              placeholder="Announcement content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="body_tr">Body (Turkish)</Label>
              <Textarea
                id="body_tr"
                value={formData.body_tr}
                onChange={(e) => setFormData({ ...formData, body_tr: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="body_ru">Body (Russian)</Label>
              <Textarea
                id="body_ru"
                value={formData.body_ru}
                onChange={(e) => setFormData({ ...formData, body_ru: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="audience_type">Audience</Label>
              <Select
                value={formData.audience_type}
                onValueChange={(value) => setFormData({ ...formData, audience_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">All Users</SelectItem>
                  <SelectItem value="enrolled">Enrolled Students</SelectItem>
                  <SelectItem value="instructors">Instructors</SelectItem>
                  <SelectItem value="admins">Admins Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta_text">CTA Button Text</Label>
              <Input
                id="cta_text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Learn More"
              />
            </div>
            <div>
              <Label htmlFor="cta_link">CTA Link</Label>
              <Input
                id="cta_link"
                value={formData.cta_link}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Announcement' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

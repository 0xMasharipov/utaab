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
import { ImageUpload } from './ImageUpload';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: any;
  mode: 'create' | 'edit';
}

export function EventFormDialog({ open, onOpenChange, event, mode }: EventFormDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title_en: '',
    title_tr: '',
    title_ru: '',
    title_ar: '',
    subtitle_en: '',
    description_en: '',
    slug: '',
    start_date: '',
    end_date: '',
    location_type: 'physical',
    location_address: '',
    location_online_link: '',
    visibility: 'draft',
    capacity: 0,
    rsvp_link: '',
    cover_image: null as string | null,
  });

  useEffect(() => {
    if (event && mode === 'edit') {
      setFormData({
        title_en: event.title_en || '',
        title_tr: event.title_tr || '',
        title_ru: event.title_ru || '',
        title_ar: event.title_ar || '',
        subtitle_en: event.subtitle_en || '',
        description_en: event.description_en || '',
        slug: event.slug || '',
        start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
        location_type: event.location_type || 'physical',
        location_address: event.location_address || '',
        location_online_link: event.location_online_link || '',
        visibility: event.visibility || 'draft',
        capacity: event.capacity || 0,
        rsvp_link: event.rsvp_link || '',
        cover_image: event.cover_image || null,
      });
    } else {
      setFormData({
        title_en: '',
        title_tr: '',
        title_ru: '',
        title_ar: '',
        subtitle_en: '',
        description_en: '',
        slug: '',
        start_date: '',
        end_date: '',
        location_type: 'physical',
        location_address: '',
        location_online_link: '',
        visibility: 'draft',
        capacity: 0,
        rsvp_link: '',
        cover_image: null,
      });
    }
  }, [event, mode, open]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
        capacity: data.capacity || null,
      };

      if (mode === 'create') {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', event.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success(mode === 'create' ? 'Event created successfully' : 'Event updated successfully');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Failed to save event: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en || !formData.slug || !formData.start_date) {
      toast.error('Title, slug, and start date are required');
      return;
    }
    mutation.mutate(formData);
  };

  const generateSlug = () => {
    const slug = formData.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Event' : 'Edit Event'}
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
                placeholder="Event title"
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
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="event-url-slug"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="subtitle_en">Subtitle</Label>
            <Input
              id="subtitle_en"
              value={formData.subtitle_en}
              onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description_en">Description</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={4}
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <Label>Cover Image</Label>
            <ImageUpload
              value={formData.cover_image}
              onChange={(url) => setFormData({ ...formData, cover_image: url })}
              accept="image/*"
              folder="events"
              label="Upload Cover Image"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date & Time *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date & Time</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location_type">Location Type</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) => setFormData({ ...formData, location_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
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
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(formData.location_type === 'physical' || formData.location_type === 'hybrid') && (
            <div>
              <Label htmlFor="location_address">Address</Label>
              <Input
                id="location_address"
                value={formData.location_address}
                onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                placeholder="Event venue address"
              />
            </div>
          )}

          {(formData.location_type === 'online' || formData.location_type === 'hybrid') && (
            <div>
              <Label htmlFor="location_online_link">Online Link</Label>
              <Input
                id="location_online_link"
                value={formData.location_online_link}
                onChange={(e) => setFormData({ ...formData, location_online_link: e.target.value })}
                placeholder="https://zoom.us/..."
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="rsvp_link">RSVP Link</Label>
              <Input
                id="rsvp_link"
                value={formData.rsvp_link}
                onChange={(e) => setFormData({ ...formData, rsvp_link: e.target.value })}
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
              {mode === 'create' ? 'Create Event' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

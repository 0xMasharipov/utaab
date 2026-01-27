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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: any;
  mode: 'create' | 'edit';
}

export function CourseFormDialog({ open, onOpenChange, course, mode }: CourseFormDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<{
    title_en: string;
    title_tr: string;
    title_ru: string;
    title_ar: string;
    subtitle_en: string;
    description_en: string;
    slug: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    language: 'en' | 'tr' | 'ru' | 'ar';
    is_published: boolean;
    is_free: boolean;
    price: number;
    hero_image: string | null;
    promo_video: string | null;
  }>({
    title_en: '',
    title_tr: '',
    title_ru: '',
    title_ar: '',
    subtitle_en: '',
    description_en: '',
    slug: '',
    level: 'beginner',
    language: 'en',
    is_published: false,
    is_free: true,
    price: 0,
    hero_image: null,
    promo_video: null,
  });

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        title_en: course.title_en || '',
        title_tr: course.title_tr || '',
        title_ru: course.title_ru || '',
        title_ar: course.title_ar || '',
        subtitle_en: course.subtitle_en || '',
        description_en: course.description_en || '',
        slug: course.slug || '',
        level: course.level || 'beginner',
        language: course.language || 'en',
        is_published: course.is_published || false,
        is_free: course.is_free ?? true,
        price: course.price || 0,
        hero_image: course.hero_image || null,
        promo_video: course.promo_video || null,
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
        level: 'beginner',
        language: 'en',
        is_published: false,
        is_free: true,
        price: 0,
        hero_image: null,
        promo_video: null,
      });
    }
  }, [course, mode, open]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (mode === 'create') {
        const { error } = await supabase.from('courses').insert([data]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('courses')
          .update(data)
          .eq('id', course.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success(mode === 'create' ? 'Course created successfully' : 'Course updated successfully');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Failed to save course: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en || !formData.slug) {
      toast.error('Title and slug are required');
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
            {mode === 'create' ? 'Create New Course' : 'Edit Course'}
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
                placeholder="Course title in English"
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
                  placeholder="course-url-slug"
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
              placeholder="Brief course subtitle"
            />
          </div>

          <div>
            <Label htmlFor="description_en">Description</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={4}
              placeholder="Course description..."
            />
          </div>

          {/* Media Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Hero Image</Label>
              <ImageUpload
                value={formData.hero_image}
                onChange={(url) => setFormData({ ...formData, hero_image: url })}
                accept="image/*"
                folder="courses"
                label="Upload Hero Image"
              />
            </div>
            <div>
              <Label>Promo Video (Optional)</Label>
              <ImageUpload
                value={formData.promo_video}
                onChange={(url) => setFormData({ ...formData, promo_video: url })}
                accept="video/*"
                folder="courses"
                label="Upload Promo Video"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Primary Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value: 'en' | 'tr' | 'ru' | 'ar') => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="tr">Turkish</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_free">Free Course</Label>
              <Switch
                id="is_free"
                checked={formData.is_free}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_published">Published</Label>
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
            </div>
          </div>

          {!formData.is_free && (
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Course' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

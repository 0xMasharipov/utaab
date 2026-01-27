

## Plan: Fix Connection Indicator + Enable Media Uploads for Courses & Events

### Overview
This plan addresses three issues:
1. **Connection indicator always showing "Connecting..."** - Fix the realtime subscription logic to properly show connection status
2. **Enable video material upload for courses** - Add promo video and hero image upload fields
3. **Enable image upload for events** - Add cover image upload field

---

## Phase 1: Fix Connection Indicator

### Problem
The connection indicator in `AdminDashboard.tsx` (lines 388-394) shows "Connecting..." because:
- `isLive` starts as `false` and only becomes `true` when realtime status is 'SUBSCRIBED'
- If realtime tables don't have replication enabled, the subscription might not reach 'SUBSCRIBED' state
- The indicator doesn't account for successful initial data load as an indicator of connectivity

### Solution
Change the logic to show "Connected" when:
1. Initial stats have loaded successfully, OR
2. Realtime subscription is active

**Modify `src/pages/admin/AdminDashboard.tsx`:**

```typescript
// Change indicator logic to show Connected once data loads
const isConnected = !loading || isLive;

// In the JSX:
<div className={cn(
  "w-2 h-2 rounded-full",
  isConnected ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"
)} />
<span>{isConnected ? 'Connected' : 'Connecting...'}</span>
```

This ensures the indicator shows green once the admin-stats edge function returns successfully.

---

## Phase 2: Create Storage Bucket

### Problem
There are **no storage buckets** configured in the project. File uploads require a storage bucket.

### Solution
Create a database migration to set up a storage bucket for media files:

```sql
-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- RLS policies for the bucket
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');
```

---

## Phase 3: Create Reusable Image Upload Component

**Create `src/components/admin/ImageUpload.tsx`:**

A reusable component for uploading images/videos with:
- Drag & drop support
- File type validation
- Progress indicator
- Preview after upload
- Delete functionality

```typescript
interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  folder?: string;
  label?: string;
  maxSizeMB?: number;
}
```

Features:
- Uses `supabase.storage.from('media').upload()` for uploads
- Generates unique filenames to prevent conflicts
- Shows image/video preview
- Handles loading and error states

---

## Phase 4: Add Media Uploads to Course Form

**Modify `src/components/admin/CourseFormDialog.tsx`:**

Add two new fields:
1. **Hero Image** - Course thumbnail/banner image
2. **Promo Video** - Optional promotional video

```typescript
// Add to formData state:
hero_image: string | null;
promo_video: string | null;

// Add to form UI:
<div className="grid grid-cols-2 gap-4">
  <div>
    <Label>Course Hero Image</Label>
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
```

---

## Phase 5: Add Cover Image Upload to Event Form

**Modify `src/components/admin/EventFormDialog.tsx`:**

Add cover image field:

```typescript
// Add to formData state:
cover_image: string | null;

// Add to form UI:
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
```

---

## Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        Admin Panel                                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Dashboard Header                                                │ │
│  │ ┌──────────┐                                                    │ │
│  │ │ ● Connected │  (green when stats load OR realtime active)    │ │
│  │ └──────────┘                                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────┐    ┌─────────────────────┐                  │
│  │ Course Form Dialog  │    │ Event Form Dialog   │                  │
│  ├─────────────────────┤    ├─────────────────────┤                  │
│  │ • Hero Image Upload │    │ • Cover Image Upload│                  │
│  │ • Promo Video Upload│    │                     │                  │
│  │ • Other fields...   │    │ • Other fields...   │                  │
│  └─────────────────────┘    └─────────────────────┘                  │
│                │                       │                             │
│                └───────────┬───────────┘                             │
│                            ▼                                         │
│                  ┌─────────────────┐                                 │
│                  │ ImageUpload     │                                 │
│                  │ Component       │                                 │
│                  └────────┬────────┘                                 │
│                           │                                          │
│                           ▼                                          │
│                  ┌─────────────────┐                                 │
│                  │ Supabase Storage│                                 │
│                  │ 'media' bucket  │                                 │
│                  └─────────────────┘                                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/pages/admin/AdminDashboard.tsx` | Modify | Fix connection indicator logic |
| `src/components/admin/ImageUpload.tsx` | **Create** | Reusable upload component |
| `src/components/admin/CourseFormDialog.tsx` | Modify | Add hero_image & promo_video uploads |
| `src/components/admin/EventFormDialog.tsx` | Modify | Add cover_image upload |
| **Database Migration** | Create | Add 'media' storage bucket with RLS policies |

---

## Summary of Changes

1. **Connection Indicator Fix**: Show "Connected" when initial data loads successfully (not just when realtime is active)

2. **Storage Bucket**: Create 'media' bucket with admin-only upload permissions and public read access

3. **ImageUpload Component**: Reusable component supporting drag-drop, preview, and progress tracking

4. **Course Form Enhancement**: Add hero image and promo video upload fields

5. **Event Form Enhancement**: Add cover image upload field

All uploads will be stored in Supabase Storage and the public URLs will be saved to the respective database tables (`courses.hero_image`, `courses.promo_video`, `events.cover_image`).


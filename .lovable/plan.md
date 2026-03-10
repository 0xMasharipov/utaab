

# Make 20TB Storage Capacity More Prominent

The storage section already displays "X GB / 20,480 GB (20 TB)" but it's subtle. We'll make the 20TB capacity more visually prominent.

## Changes — `src/pages/education/admin/AdminMedia.tsx`

Update the storage card to include a bold "20 TB Cloud Storage" headline badge and make the capacity info more eye-catching:

- Add a badge or highlighted text reading **"20 TB Cloud Storage"** near the title
- Show remaining storage more prominently (e.g., "19,999 GB of 20 TB available")
- Keep the progress bar and file count as-is

```tsx
<div className="flex items-center gap-3 mb-2">
  <h3 className="text-sm font-semibold">Storage Usage</h3>
  <Badge variant="secondary" className="text-xs">20 TB Plan</Badge>
</div>
<div className="flex items-center justify-between mb-2">
  <span className="text-lg font-bold">{storageUsedGB} GB <span className="text-sm font-normal text-muted-foreground">used of 20 TB</span></span>
  <span className="text-sm text-muted-foreground">
    {(TOTAL_STORAGE_GB - storageUsedGB).toLocaleString()} GB remaining
  </span>
</div>
```

### File Modified
- `src/pages/education/admin/AdminMedia.tsx`


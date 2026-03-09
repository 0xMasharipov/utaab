

# Add Blog Description Localization and Gallery Display on BlogPost Page

## Changes

### 1. `src/pages/BlogPost.tsx`
- **Localized description/excerpt**: Below the title (after tags), render the localized excerpt (`excerpt_${lang}` falling back to `excerpt_en`) as a styled subtitle/description paragraph
- **Gallery section**: After the content blocks, render the `gallery` images from the post in a responsive grid (2-3 columns). Each image uses `AnimatedImage` with rounded corners. Clicking an image could open it full-size (simple link or lightbox)
- Extract gallery from `post.gallery` (already fetched as JSONB array of URL strings)

### 2. `src/i18n/locales/en.json`, `tr.json`, `ru.json`, `ar.json`
- Add `blog.gallery` label (e.g. "Gallery" / "Galeri" / "Галерея" / "معرض")
- Add `blog.attachments` label for the attachments heading (currently hardcoded "Attachments")

### Code sketch for BlogPost.tsx

```tsx
// After title, before content
const excerpt = (post as any)[`excerpt_${lang}`] || post.excerpt_en;

// In JSX, after tags block:
{excerpt && (
  <p className="text-muted-foreground text-lg leading-relaxed mt-6 max-w-4xl">
    {excerpt}
  </p>
)}

// After content blocks, before PDF attachments:
const gallery: string[] = Array.isArray(post.gallery) ? post.gallery : [];

{gallery.length > 0 && (
  <div className="max-w-3xl mx-auto mt-10">
    <h3 className="text-lg font-semibold text-foreground mb-4">{t('blog.gallery', 'Gallery')}</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {gallery.map((url, i) => (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
          <AnimatedImage src={url} alt={`Gallery ${i+1}`} className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform" />
        </a>
      ))}
    </div>
  </div>
)}
```

| File | Change |
|------|--------|
| `BlogPost.tsx` | Add localized excerpt display + gallery image grid |
| `en.json` | Add `blog.gallery` key |
| `tr.json` | Add `blog.gallery` key |
| `ru.json` | Add `blog.gallery` key |
| `ar.json` | Add `blog.gallery` key |


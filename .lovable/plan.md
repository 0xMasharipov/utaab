

# UTAAB Website Enhancement - Blog System, Team Page, and Footer Update

This plan covers a major enhancement across 4 workstreams, delivered in sequence. Each builds on the previous.

---

## Workstream 1: Database Schema (Blog System Backend)

### New Tables

**blog_posts**
- id (uuid, PK), slug (text, unique), title_en/tr/ru/ar (text), excerpt_en/tr/ru/ar (text), content (jsonb - rich text blocks), cover_image (text - URL), gallery (jsonb - array of image URLs), video_type (text - 'embed' or 'uploaded'), video_url (text), attachments (jsonb - array of {name, url, type}), tags (text[]), author_name (text), status (text - draft/published/scheduled), publish_date (timestamptz), scheduled_at (timestamptz), meta_title (text), meta_description (text), og_image (text), featured (boolean, default false), created_by (uuid), created_at (timestamptz), updated_at (timestamptz)

**blog_categories**
- id (uuid, PK), name_en/tr/ru/ar (text), slug (text, unique), created_at (timestamptz)

**blog_post_categories** (junction)
- id (uuid, PK), post_id (uuid, FK), category_id (uuid, FK), unique(post_id, category_id)

### RLS Policies
- SELECT on blog_posts: public for status='published' AND (publish_date IS NULL OR publish_date <= now())
- SELECT on blog_categories: public (true)
- INSERT/UPDATE/DELETE on all blog tables: admin only via has_role()

---

## Workstream 2: Admin Blog Management

### New Files
| File | Purpose |
|------|---------|
| `src/pages/admin/AdminBlog.tsx` | Blog posts list with search, filters, CRUD table |
| `src/components/admin/BlogPostFormDialog.tsx` | Full create/edit dialog with all fields |

### AdminBlog.tsx Features
- Table listing all posts (title, status, date, featured badge)
- Search bar, status filter tabs (All / Draft / Published / Scheduled)
- Create, Edit, Delete actions using existing dialog patterns
- Uses existing DeleteConfirmDialog for deletion

### BlogPostFormDialog.tsx Features
- Title fields (4 languages)
- Auto-generated slug from English title
- Excerpt fields (4 languages)
- Content textarea (rich text as JSON blocks - simple textarea initially)
- Cover image upload (reuses ImageUpload component)
- Gallery: multiple image uploads
- Video: type selector (embed/uploaded) + URL field
- Attachments: PDF upload with download preview
- Tags: comma-separated input
- Author name
- Status: draft / published / scheduled
- Scheduled date picker (shown when status = scheduled)
- Featured toggle
- SEO section: meta_title, meta_description, og_image

### Route Addition
- Add `/admin/blog` route inside AdminLayout in App.tsx
- Add sidebar link in AdminLayout.tsx

---

## Workstream 3: Public Blog Pages

### New Files
| File | Purpose |
|------|---------|
| `src/pages/Blog.tsx` | Blog listing page at /blog |
| `src/pages/BlogPost.tsx` | Blog detail page at /blog/:slug |
| `src/components/blog/BlogCard.tsx` | Reusable glass blog card |
| `src/components/blog/BlogHero.tsx` | Blog post hero with cover image overlay |
| `src/components/blog/ShareButtons.tsx` | Copy link, X, LinkedIn share |
| `src/components/blog/PDFAttachment.tsx` | PDF download/preview section |

### Blog Listing (/blog)
- Hero section: "UTAAB Blog" title, subtitle, glass container, animated gradient
- Featured post: large horizontal glass card (cover image, title, excerpt, category badge, date, Read More)
- Blog grid: 3 cols desktop, 2 tablet, 1 mobile
- Each card: cover image with gradient overlay, title, excerpt, date, tag badges, Read More button
- Glass search bar
- Category filter chips (from blog_categories)
- Pagination (12 posts per page)
- Framer Motion fade-in animations
- Uses AnimatedBlobBackground for consistency

### Blog Post (/blog/:slug)
- Hero: full-width cover image with gradient overlay, title, author, date, tags
- Content: rendered from JSON blocks supporting headings, paragraphs, lists, code blocks, quotes, images, embedded video
- Media support: lazy-loaded images, YouTube/Vimeo embeds, uploaded video player
- PDF attachments: styled section with preview icon and download button
- Share buttons: copy link, X (Twitter), LinkedIn
- Related posts: 3 posts matching tags
- Back to blog button
- SEO: document.title + meta description set dynamically

### Route Additions
- `/blog` and `/blog/:slug` in App.tsx

---

## Workstream 4: Team Page and Footer Update

### Team Page (/team)
| File | Purpose |
|------|---------|
| `src/pages/TeamPage.tsx` | Dedicated team page |

- Remove `<Team />` from Index.tsx
- Create standalone /team page with:
  - Hero: "Our Team" title, "Builders of UTAAB" subtitle, glass container, animated blob background
  - Team grid: same 5 members, larger cards than homepage version
  - Each card: circular image placeholder, name, position, description, LinkedIn icon placeholder
  - 3 cols desktop, 2 tablet, 1 mobile
  - Glass cards with hover lift, border glow, soft shadow
  - Framer Motion stagger animations

### Footer Update
- Restructure Footer.tsx columns:
  - Column 1: Logo + description (keep existing)
  - Column 2: Navigation - Home, Projects, Blog (NEW - link to /blog), Team (NEW - link to /team), Contact
  - Column 3: Community social links (keep existing)
  - Column 4: Newsletter (keep existing)
- Add Blog and Team links to all 4 locale files
- Glass-styled footer with transparent dark background

### Navbar Update
- Add Blog link (navigates to /blog)
- Add Team link (navigates to /team)
- Update both desktop nav items and mobile menu
- Add translations for nav.blog and nav.team

---

## Translation Updates

All 4 locale files (en, tr, ru, ar) will receive:
- `nav.blog`, `nav.team` keys
- `blog.title`, `blog.subtitle`, `blog.featured`, `blog.readMore`, `blog.search`, `blog.noResults`, `blog.backToBlog`, `blog.relatedPosts`, `blog.share`, `blog.copyLink`, `blog.linkCopied`
- `footer.blog`, `footer.team`, `footer.home`, `footer.contact`
- `teamPage.title`, `teamPage.subtitle` (reuses existing team member translations)

---

## Files Summary

| File | Action |
|------|--------|
| SQL migration | Create blog_posts, blog_categories, blog_post_categories + RLS |
| `src/pages/admin/AdminBlog.tsx` | Create |
| `src/components/admin/BlogPostFormDialog.tsx` | Create |
| `src/pages/Blog.tsx` | Create |
| `src/pages/BlogPost.tsx` | Create |
| `src/components/blog/BlogCard.tsx` | Create |
| `src/components/blog/BlogHero.tsx` | Create |
| `src/components/blog/ShareButtons.tsx` | Create |
| `src/components/blog/PDFAttachment.tsx` | Create |
| `src/pages/TeamPage.tsx` | Create |
| `src/pages/Index.tsx` | Remove Team import/usage |
| `src/components/Footer.tsx` | Update columns, add Blog/Team links |
| `src/components/Navbar.tsx` | Add Blog + Team nav items |
| `src/components/admin/AdminLayout.tsx` | Add blog sidebar link |
| `src/App.tsx` | Add /blog, /blog/:slug, /team, /admin/blog routes |
| `src/i18n/locales/en.json` | Add blog + team page translations |
| `src/i18n/locales/tr.json` | Add blog + team page translations |
| `src/i18n/locales/ru.json` | Add blog + team page translations |
| `src/i18n/locales/ar.json` | Add blog + team page translations |

---

## Performance and SEO

- All new pages lazy-loaded via React.lazy
- Images use loading="lazy"
- Blog posts set document.title dynamically
- Meta description set via useEffect
- Semantic HTML (article, section, header, nav)
- Pagination prevents loading all posts at once
- AnimatedBlobBackground shared across pages for visual consistency


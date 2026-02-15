

# UTAAB Website Enhancement - Phased Implementation Plan

This is a large-scope enhancement. Since Lovable uses **React + Vite** (not Next.js) and **Lovable Cloud** for the backend (not Payload CMS), we will deliver equivalent functionality using the existing stack. The plan is split into **4 phases** to keep each step manageable and testable.

---

## Phase 1: Background & Glassmorphism Fix + Team Section

### Background Blob System
- Create a new `AnimatedBlobBackground` component that renders 3-4 large, blurred, slowly moving gradient blobs using CSS animations
- Colors: brand blue/purple tones (`hsl(217, 91%, 35%)`, `hsl(260, 60%, 50%)`, `hsl(213, 94%, 68%)`)
- Each blob uses `filter: blur(80-120px)`, large size (300-500px), absolute positioning, slow float/morph keyframes
- Add subtle grain/noise overlay via CSS pseudo-element
- Place this background component at the root level in `Index.tsx` so it sits behind all sections
- This will make existing `glass` and `glass-strong` classes visually pop

### Reusable Glass Components
- Create `src/components/glass/GlassCard.tsx` - wraps content with glassmorphism styling (configurable opacity, blur, glow)
- Create `src/components/glass/GlassSectionWrapper.tsx` - section-level wrapper with consistent padding and glass backdrop

### Team Section
- Create `src/components/Team.tsx`
- Grid of glass profile cards (responsive: 1 col mobile, 2 col tablet, 4-5 col desktop)
- Team members: Zinurbek Masharipo (Founder), Yunus Emre Ercin (CTO), Abdulla Hamzali (Head of Engineering), Abdulbaki Karaman (CFO), Umut Tekbas (HR Manager)
- Each card: image placeholder (avatar icon), name, position, short Web3-oriented description
- Hover effects: slight lift (translateY), soft blue glow, scale
- Framer Motion fade-in-on-scroll animation
- Add i18n keys to all 4 locale files (en, tr, ru, ar)
- Add `<Team />` to `Index.tsx` between Resources and Join

### Files Changed
| File | Change |
|------|--------|
| `src/components/AnimatedBlobBackground.tsx` | New - animated gradient blobs |
| `src/index.css` | Add blob keyframes, grain overlay utility |
| `src/components/glass/GlassCard.tsx` | New - reusable glass card |
| `src/components/glass/GlassSectionWrapper.tsx` | New - section wrapper |
| `src/components/Team.tsx` | New - team section |
| `src/pages/Index.tsx` | Add AnimatedBlobBackground + Team |
| `src/i18n/locales/en.json` | Add team translations |
| `src/i18n/locales/tr.json` | Add team translations |
| `src/i18n/locales/ru.json` | Add team translations |
| `src/i18n/locales/ar.json` | Add team translations |

---

## Phase 2: Blog System (Database + Admin)

### Database Tables
- Create `blog_posts` table: id, slug (unique), title, excerpt, content (rich text as JSON), cover_image (URL), gallery (JSONB array of URLs), video_type (enum: embed/uploaded), video_url, attachments (JSONB for PDFs), tags (text array), author_name, status (draft/published/scheduled), publish_date, scheduled_at, meta_title, meta_description, og_image, featured (boolean), created_by (uuid), created_at, updated_at
- Create `blog_categories` table: id, name_en, name_tr, name_ru, name_ar, slug
- Create `blog_post_categories` junction table
- RLS: public SELECT for published posts, admin-only for INSERT/UPDATE/DELETE
- Enable realtime for live updates

### Admin Blog Management
- Add `/admin/blog` route inside AdminLayout
- Create `AdminBlog.tsx` page with CRUD table
- Create `BlogPostFormDialog.tsx` with: title, slug (auto-generated), excerpt, rich content editor (textarea initially, upgradeable), cover image upload (using existing ImageUpload component), gallery upload, video embed URL or upload, PDF attachment upload + preview, tags, draft/publish toggle, scheduled publishing date, SEO fields
- Integrate with existing admin role checks

### Files Changed
| File | Change |
|------|--------|
| SQL migration | Create blog_posts, blog_categories, blog_post_categories tables + RLS |
| `src/pages/admin/AdminBlog.tsx` | New - blog management page |
| `src/components/admin/BlogPostFormDialog.tsx` | New - create/edit blog post dialog |
| `src/App.tsx` | Add /admin/blog route |

---

## Phase 3: Blog Public Pages

### Blog Listing Page (`/blog`)
- Grid layout with glass cards
- Category filter chips
- Search input
- Pagination
- Featured post highlighted at top (larger card)
- Each card: cover image, title, excerpt, date, "Read More" button

### Blog Detail Page (`/blog/:slug`)
- Large hero cover image
- Title, meta info (author, date, tags)
- Rich content body (rendered from stored content)
- Embedded video support (YouTube/Vimeo iframe or uploaded MP4)
- Image gallery (lightbox or carousel)
- PDF attachment viewer + download button
- Share buttons (copy link, Twitter/X, LinkedIn)
- Related posts section (by matching tags)

### Homepage Blog Section
- Display 3 most recent published posts dynamically from database
- Glass cards matching site design

### Files Changed
| File | Change |
|------|--------|
| `src/pages/Blog.tsx` | New - blog listing page |
| `src/pages/BlogPost.tsx` | New - blog detail page |
| `src/components/blog/BlogCard.tsx` | New - reusable blog card |
| `src/components/blog/BlogHero.tsx` | New - blog post hero |
| `src/components/blog/PDFViewer.tsx` | New - PDF preview + download |
| `src/components/blog/ShareButtons.tsx` | New - social share buttons |
| `src/components/LatestPosts.tsx` | New - homepage blog section |
| `src/pages/Index.tsx` | Add LatestPosts section |
| `src/App.tsx` | Add /blog and /blog/:slug routes |
| All locale files | Add blog-related translations |

---

## Phase 4: Navbar Update

### Updated Navigation
- Add "Blog" and "Team" links to the navbar items array
- "Blog" navigates to `/blog` page (route navigation, not scroll)
- "Team" scrolls to the team section on homepage
- Keep existing links: Community, Learn, Events, Projects, Resources
- Add translations for new nav items in all locale files
- Ensure mobile menu includes new items

### Files Changed
| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Add Blog + Team nav items |
| All locale files | Add nav.blog, nav.team translations |

---

## Technical Notes

- **No Next.js**: The project uses React + Vite with react-router-dom. All routing, SEO metadata (via react-helmet or document.title), and page structure will use this stack.
- **No Payload CMS**: The admin panel already exists with role-based access. Blog management will be built as a new admin section using the same patterns (Supabase tables + edge functions + admin dialogs).
- **Media Storage**: Uses existing Supabase Storage `media` bucket for images, videos, and PDFs. No local disk storage.
- **SEO**: Dynamic document titles and meta tags per blog post using `useEffect` + `document.title`. OpenGraph tags via dynamic head manipulation.
- **Performance**: Images lazy-loaded, blog posts paginated, content code-split via lazy routes.

---

## Implementation Order

1. **Phase 1** (this session): Background blobs + Glass components + Team section -- immediate visual impact
2. **Phase 2** (next): Blog database + admin CRUD
3. **Phase 3** (after): Blog public pages + homepage integration
4. **Phase 4** (final): Navbar updates with new links

Shall I start with Phase 1?


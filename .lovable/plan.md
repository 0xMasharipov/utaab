# Past Events as a Banner Carousel

Add the three uploaded event posters as past events and change the "Past Events" area of the Events section so the banners are shown one at a time, swipeable/clickable.

## What gets added

Three past events (all 2026, published):

| Event | Date | Where |
| --- | --- | --- |
| Monad Blitz Kayseri | April 23 | Abdullah Gül University |
| Monad Blitz Çanakkale | May 16 | Çanakkale Onsekiz Mart Üniversitesi |
| Beyond Blockchain — Veli Uysal | May 20, 14:00 | UTAA Campus |

Each gets its uploaded poster as cover image, plus English/Turkish/Arabic/Russian titles and short descriptions so they follow the site's language switching.

## How the Past Events section changes

- Past events render as full posters (portrait 4:5, matching the uploaded artwork) inside the existing coverflow carousel: one banner in focus, neighbours angled to the sides, drag/swipe, arrow keys and dot indicators.
- Tapping the focused banner opens it full-screen in the existing image lightbox so it can be read comfortably on mobile.
- Under each banner: title, date and location in a compact caption — no big glass card, the poster is the hero.
- When there are no past events, the current "no events" message stays.
- Upcoming events keep the current card grid, unchanged.

## Technical notes

- Posters uploaded through the asset CDN; the resulting URLs are stored in `events.cover_image`, and the rows are inserted into the existing `events` table (visibility `published`, `location_type` `physical`), so they stay editable from the admin Events page.
- `src/components/Events.tsx`: keep the card renderer for upcoming events; add a banner renderer for past events wired into `CoverflowCarousel` (`cardAspectRatio` 4/5, `images` prop fed with the cover URLs for the ambient gradient) with `ImageLightbox` for the full-screen view.
- New translation keys for the three event titles/descriptions are not needed — the copy lives in the database's per-language columns.

Replace the founder's photo (Zinurbek Masharipov) used across the Team component and Team page with the newly uploaded `UTAAB_Founder.png`.

## Steps
1. Upload the new image via `lovable-assets` and overwrite `src/assets/team/zinurbek.png.asset.json` so all existing imports (`@/assets/team/zinurbek.png`) automatically pick up the new photo.
2. No code changes needed — `src/components/Team.tsx` and `src/pages/TeamPage.tsx` already reference this asset.

## Notes
- The asset URL is immutable per upload, so the pointer JSON is rewritten with a fresh `asset_id`/URL pointing to the new file.
- Both home page Team section and `/team` page will reflect the update.

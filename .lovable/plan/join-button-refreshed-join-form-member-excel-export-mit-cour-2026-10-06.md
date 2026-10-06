# Join button, refreshed join form, member Excel export, MIT course visuals

## 1. "Join UTAAB" goes straight to the form
- Every "Join UTAAB" / "Join us" button (navbar, mobile menu, hero, other pages like Team, About, footer) opens the home page and lands directly on the join form.
- From other pages: navigate to `/#join`, then scroll once the home page has rendered (retry until the section exists, offset for the fixed navbar).
- On the home page: smooth scroll to the form itself (not just the section heading).

## 2. Join form redesign
- Glass card on the existing navy/blue Web3 palette, Montserrat, no purple.
- Two-column layout on computer (short intro + benefits on the left, form on the right); single column on phones.
- Grouped steps with clear labels, soft focus glow, rounded inputs, animated submit button, polished success state.
- Keeps every current field, captcha protection, validation, saving, and the WhatsApp redirect after submit.

## 3. Admin: download all members as Excel
- "Export to Excel" button on the admin members/applications page.
- Downloads an `.xlsx` with every member application (name, email, phone, university, department, community, status, date, etc.).
- Data is fetched by a protected server function that checks the admin role; the browser never queries members directly as admin.

## 4. Courses use the MIT course data and your image
- Upload the provided "Blockchain Finance Network" image and use it as the MIT "Blockchain and Money" course image everywhere courses appear (education home, catalog, course detail, MIT course page).
- Course listings show the MIT course (title, Prof. Gary Gensler, 24 lectures, level, duration) as the featured course for now.

## Technical details
- Navbar/Hero/other join buttons: shared `goToJoin()` helper using `useNavigate` + hash scroll handler in `Index.tsx`.
- Form: restyle `CommunityJoinForm.tsx` and `Join.tsx` with semantic tokens only.
- Export: new edge function `export-members` (JWT check + `has_role(admin)`, Zod, rate limit, generic 500s) returning rows; client builds the workbook with `xlsx` (SheetJS) in `AdminUsers.tsx`/`AdminCommunities.tsx`.
- Image: `lovable-assets` pointer `src/assets/courses/blockchain-finance-network.png.asset.json`, referenced from `externalCourses.ts` and MIT page hero.

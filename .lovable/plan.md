

# Contributor Match Page

## Overview
A premium multi-step assessment page at `/contributor-match` where users answer questions about their skills, interests, and work style, then receive AI-powered role recommendations within UTAAB. Uses Lovable AI (Gemini) via an edge function for analysis.

## Files to Create

### 1. Edge Function: `supabase/functions/contributor-match/index.ts`
- Accepts form submission data, constructs a detailed prompt for Lovable AI
- Uses `google/gemini-2.5-flash` model via gateway
- Returns structured role recommendation using tool calling (JSON schema)
- Output: primary role, secondary role, compatibility score, profile summary, strengths, growth path, suggested first steps
- Handles 429/402 errors properly
- CORS with allowed origins pattern (matches existing `cutii-chat`)

### 2. Database Migration
- Create `contributor_assessments` table to store submissions + AI results
- Columns: `id`, `full_name`, `email`, `form_data` (jsonb), `ai_result` (jsonb), `created_at`
- RLS: insert allowed for anonymous (public form), select/update for admins only
- No auth required to submit (public-facing recruitment form)

### 3. Page: `src/pages/ContributorMatch.tsx`
- Main page component with Navbar, AnimatedBlobBackground, Footer
- Hero section, How It Works, Assessment Form, Archetypes, Final CTA
- Route: `/contributor-match`

### 4. Component: `src/components/contributor/ContributorHero.tsx`
- Headline, subtitle, CTA buttons, trust badge
- Gradient overlay matching UTAAB style

### 5. Component: `src/components/contributor/HowItWorks.tsx`
- 3 GlassCard steps with icons, hover animations

### 6. Component: `src/components/contributor/AssessmentForm.tsx`
- Multi-step form with 6 steps + review step
- Progress bar at top
- LocalStorage autosave
- Framer-motion step transitions
- Each step as a sub-component rendering appropriate fields
- Validation per step before advancing
- Previous/Next navigation

### 7. Component: `src/components/contributor/AssessmentResult.tsx`
- Dashboard-style result display after AI analysis
- Circular compatibility score (animated)
- Primary/secondary role cards
- Strengths/interests tags
- Growth path timeline
- Loading skeleton during analysis

### 8. Component: `src/components/contributor/ContributorArchetypes.tsx`
- 6 archetype cards (Builder, Researcher, Operator, Connector, Creator, Strategist)
- Each with description + matching UTAAB roles

### 9. Component: `src/components/contributor/ContributorCTA.tsx`
- Bottom CTA section with headline + two buttons

### 10. Route Registration in `src/App.tsx`
- Add lazy-loaded route for `/contributor-match`

## Form Data Schema
All form fields organized into sections A-F as specified. Multi-select fields use checkbox groups, ratings use a custom 1-5 slider/button group, open-ended questions use textareas.

## AI Integration
- Edge function sends structured form data to Lovable AI gateway
- Uses tool calling to extract: `primary_role`, `secondary_role`, `compatibility_score` (0-100), `profile_summary`, `strengths` (array), `growth_recommendations`, `suggested_first_step`, `recommended_department`, `growth_path`
- Frontend calls edge function via `supabase.functions.invoke('contributor-match', { body: formData })`
- Shows skeleton loading state during analysis (~5-10s)

## Design
- Reuses `GlassCard`, `AnimatedBlobBackground`, existing color system
- Dark theme matching site (navy/blue/glass)
- Framer-motion for step transitions, result reveals
- Mobile-first responsive layout
- Premium spacing and typography (Montserrat)

## Key Technical Decisions
- No auth required (public recruitment form)
- Form state persisted to localStorage to survive refresh
- Results saved to database for admin review
- AI analysis happens server-side only (prompt not exposed to client)


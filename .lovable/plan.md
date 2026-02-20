

# Update Community Projects Section

## Overview
Replace the current 3 placeholder project cards with the 7 real UTAAB project cards, update all 4 locale files, and refine the component styling to match the specified design requirements.

## Changes

### 1. Update `src/components/Projects.tsx`
Complete rewrite of the projects data and card rendering:

- **7 project cards** with hardcoded project data (not i18n keys for tags, since tags are short labels)
- **Status logic**: UBP and TonRa get `"underDevelopment"` status; all others get `"planning"`
- **Status badge styling**:
  - Under Development: soft blue gradient (`bg-blue-500/20 text-blue-400`)
  - Planning: muted amber (`bg-yellow-500/20 text-yellow-400`)
- **"Soon" label**: For Planning projects, a small muted gray `"Soon"` text appears next to the "View Project" button text
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive layout
- **Hover**: subtle card lift (`hover:-translate-y-1`) with soft shadow increase, no glow
- **Staggered fade-in** on scroll (existing framer-motion pattern)
- **Button**: full width on mobile, includes ExternalLink icon; Planning projects append a subtle "Soon" label

### 2. Update all 4 locale files

Add the new project translations and new status/tag keys.

**`src/i18n/locales/en.json`** projects section becomes:
- New status: `"underDevelopment": "Under Development"`
- 7 projects (ubp, tonra, asn, dvs, ubpoint, did, dao) each with title + description
- New tags: rewards, community, engagement, ton, research, academic, payments, blockchain, university, identity, validation, nodes, students, privacy, layer2, governance, dao
- New key: `"soon": "Soon"`

**`src/i18n/locales/tr.json`** -- Turkish translations for all 7 projects, tags, and statuses

**`src/i18n/locales/ar.json`** -- Arabic translations for all 7 projects, tags, and statuses

**`src/i18n/locales/ru.json`** -- Russian translations for all 7 projects, tags, and statuses

### 3. Project Card Content (English)

| # | Key | Title | Status | Tags |
|---|-----|-------|--------|------|
| 1 | ubp | UBP -- UTAA Blockchain Point System | Under Development | Rewards, Community, Engagement |
| 2 | tonra | TonRa -- TON Research & Academic Network | Under Development | TON, Research, Academic |
| 3 | asn | ASN -- Academic Settlement Network | Planning | Payments, Blockchain, University |
| 4 | dvs | DVS -- Decentralized Validation System | Planning | Identity, Validation, Nodes |
| 5 | ubpoint | UB Point -- University Benefit Point System | Planning | Rewards, Students, Engagement |
| 6 | did | DID -- Decentralized Identity System | Planning | Identity, Privacy, Layer 2 |
| 7 | dao | DAO Governance Platform | Planning | Governance, DAO, Community |

## Technical Details

### Projects Component Structure
```text
Projects.tsx
  |-- projects array (7 items, each with status, titleKey, descriptionKey, tags[])
  |-- Status badge: conditional class based on status string
  |-- "Soon" label: rendered inline next to button text when status === 'planning'
  |-- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  |-- Cards: glass rounded-[28px] p-6 hover:-translate-y-1 transition-all
```

### Files Modified

| File | Change |
|------|--------|
| `src/components/Projects.tsx` | Rewrite project data (7 cards), add status badge styling, add "Soon" label, refine hover/grid |
| `src/i18n/locales/en.json` | Replace projects section with 7 projects, new tags, new statuses |
| `src/i18n/locales/tr.json` | Turkish translations for all new content |
| `src/i18n/locales/ar.json` | Arabic translations for all new content |
| `src/i18n/locales/ru.json` | Russian translations for all new content |


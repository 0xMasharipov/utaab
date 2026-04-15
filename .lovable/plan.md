

# Replace Icons with Iconoir Across the Website

## Summary
Install `iconoir-react` and replace all lucide-react icon imports in custom components with Iconoir equivalents. Shadcn/ui internal components (accordion, dialog, etc.) will keep lucide-react since they depend on it — only user-facing feature/section icons change.

## Scope — Files to Modify (~30 files)

### Homepage Sections
| File | Lucide Icons | Iconoir Replacements |
|------|-------------|---------------------|
| `Hero.tsx` | ArrowRight | NavArrowRight |
| `AboutBlurb.tsx` | GraduationCap, Rocket, Globe, Heart, ArrowRight | GraduationCap, Rocket, Globe, Heart, NavArrowRight |
| `Community.tsx` | ArrowRight, Rocket, Newspaper | NavArrowRight, Rocket, Newspaper |
| `Events.tsx` | Calendar, MapPin, Users, Globe, ExternalLink, Loader2 | Calendar, MapPin, Group, Globe, OpenNewWindow, — (Loader2 stays lucide for spinner) |
| `Projects.tsx` | ExternalLink, Coins, Search, CreditCard, ShieldCheck, Fingerprint, Vote | OpenNewWindow, BitcoinCircle, Search, CreditCard, ShieldCheck, Fingerprint, CommunityIcon |
| `Learn.tsx` | BookOpen, Video, GraduationCap | Book, MediaVideoList, GraduationCap |
| `Resources.tsx` | FileText, Code, BookMarked | Page, Code, BookmarkBook |
| `BlogSection.tsx` | Loader2, ArrowRight | (Loader2 stays), NavArrowRight |
| `Team.tsx` | User | User |

### Navigation & Footer
| File | Changes |
|------|---------|
| `Navbar.tsx` | X→Xmark, Globe→Globe, ChevronDown→NavArrowDown, User→User |
| `Footer.tsx` | Linkedin→Linkedin, Instagram→Instagram, Twitter→X (Twitter), Send→SendDiagonal, Mail→Mail |

### Contributor Pages
| File | Key Icons |
|------|-----------|
| `ContributorHero.tsx` | GitMerge→GitMerge, ArrowDown→NavArrowDown |
| `ContributorArchetypes.tsx` | Hammer→Hammer, Search→Search, Settings→Settings, Users→Group, Palette→ColorFilter, Lightbulb→LightBulb |
| `ContributorCTA.tsx` | ArrowRight→NavArrowRight, MessageCircle→ChatBubble |
| `HowItWorks.tsx` | ClipboardList→ClipboardCheck, Brain→Brain, Target→Target |
| `AssessmentForm.tsx` | ChevronLeft/Right→NavArrowLeft/Right, Send→SendDiagonal |
| `AssessmentResult.tsx` | Award→Trophy, Star→StarSolid, TrendingUp→TrendUp, Target→Target, Zap→Flash, ArrowRight→NavArrowRight |

### Other Visible Pages
| File | Key Icons |
|------|-----------|
| `About.tsx` | Various — map all to Iconoir equivalents |
| `Blog.tsx` | Search, Calendar, etc. |
| `BlogPost.tsx` | ArrowLeft, Calendar, Clock, etc. |
| `PrivacyPopup.tsx` | X→Xmark, Shield→Shield, Cookie→Cookie, FileText→Page |
| `FloatingPrivacyButton.tsx` | Shield icon |
| `WhatsAppButton.tsx` | MessageCircle→ChatBubble, ExternalLink→OpenNewWindow |
| `EducationNavbar.tsx` | Menu→Menu, X→Xmark, Globe→Globe, User→User, LogOut→LogOut |

### Pages with icon usage
- `TermsOfService.tsx`, `PrivacyPolicy.tsx`, `KVKKRequest.tsx`, `ContributorMatch.tsx`
- `Profile.tsx` and profile sub-components
- Education pages (EducationHome, CourseDetail, etc.)
- Admin pages (keep as-is or update — admin is internal)

## Technical Approach

1. **Install** `iconoir-react` via npm
2. **Create** `src/components/common/IconProvider.tsx` — wrap app with `IconoirProvider` setting `strokeWidth={1.5}` globally for consistency
3. **Replace imports** file by file: change `from 'lucide-react'` to `from 'iconoir-react'` with mapped names
4. **Keep lucide-react** installed — shadcn/ui components depend on it
5. **Loader2 (spinner)** stays as lucide since Iconoir doesn't have an animated spinner equivalent
6. **Add subtle glow** via a utility class `.icon-glow` applied to icon containers in feature sections

## Visual Enhancement
- Add `.icon-glow` CSS class: `filter: drop-shadow(0 0 6px hsl(var(--accent) / 0.3))`
- Apply to icon containers in AboutBlurb, Projects, Learn, Resources, Events cards
- Hover effect: scale(1.05) + increased glow opacity (already exists on most cards)

## What Does NOT Change
- Layout, spacing, text, structure
- Admin/CMS functionality and connections
- shadcn/ui internal icons (accordion, dialog, select, etc.)
- Backend logic, edge functions, database
- Loader/spinner animations (keep Loader2 from lucide)

## Files Modified
~30 component files (icon imports only) + `index.css` (add `.icon-glow` class) + `package.json` (add iconoir-react)


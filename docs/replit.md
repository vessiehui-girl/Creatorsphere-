# CreatorSphere — Creator Ecosystem Platform

## Product Overview
CreatorSphere is a premium cosmic-dark creator platform — one connected space for creators to create, store, plan, schedule, share, and grow content. Sphere Intel is the embedded intelligent layer woven throughout the platform. The design philosophy is visual, premium, and creator-focused — not robotic or admin-dashboard-like.

## Tech Stack
- **Frontend:** React 18, TypeScript, Wouter routing, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, TypeScript, Passport.js (local auth)
- **Database:** PostgreSQL with Drizzle ORM
- **Build:** Vite (frontend), tsx (backend)

## Ecosystem Architecture

CreatorSphere is intentionally designed as one layer in a wider, expandable platform ecosystem. The current codebase is structured to accommodate future independent systems that will slot in alongside the creator platform without requiring restructuring.

> **CURRENT BUILD FOCUS:** The core CreatorSphere creator platform only. All ecosystem expansion layers listed below are architecture roadmap items only — not active build priorities. Do not add features, routes, or UI for these systems until the core platform is stable and the user explicitly initiates a new build phase for them.

### Active Ecosystem Layers

- **NDIS Navigator Hub** — Fully active at `/ndis`. 4-tab hub (Participants, Providers, Guides, Book Support) with booking form, official NDIS links, guides, and provider resources. Added to sidebar nav. Component: `client/src/pages/NdisHub.tsx`.

### Future Expansion Layers (Architecture Roadmap Only — Not Active)
- **Community Services Hub** — A community support and services directory layer. Not currently built or stubbed.
- **Drug Intake & Health Tracking** — A personal health log system (dosage schedules, tracking, reminders, reports). Route prefix: `/health-tracker/*`. Stub exists as a placeholder only.
- **Community Swap Marketplace** — A peer-to-peer item lending/swap system (list items, request loans, mark returned, swap history). Route prefix: `/swap/*`. Stub exists as a placeholder only.

Each future system will be added as its own section of routes under a separate path prefix with its own schema tables appended to `shared/schema.ts` and its own storage methods in `server/storage.ts`. The AppShell navigation, Sphere Intel, and Auth layer are shared infrastructure that these systems can hook into when the time comes.

## Architecture

### Key Directories
- `client/src/pages/` — All main pages
- `client/src/pages/node143/` — Node 143 (Support) pages
- `client/src/lib/diagnostic-flows.ts` — Complete diagnostic flow engine + guide catalog
- `client/src/components/AppShell.tsx` — Main navigation shell (sidebar + mobile nav)
- `shared/schema.ts` — Database schema (all tables)
- `server/storage.ts` — Database operations (all CRUD)
- `server/routes.ts` — All API endpoints

### Main Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.tsx` | Dashboard — greeting, activity stats, quick actions (Create/Studio/Vault/Planner), upcoming post widget (creator_posts status=scheduled), recent vault items, platform status chips, Sphere Intel prompts, community activity, analytics shortcut |
| `/creator-studio` | `CreatorPlatform.tsx` | Platform Hub, Bio & Links, Portfolio, Design Review tabs |
| `/collaboration` | `Collaboration.tsx` | Send proposals, discover creators |
| `/community` | `CommunityFeed.tsx` | Creator feed — posts, photos, videos, comments, likes, shares |
| `/capital-builder` | `CapitalBuilderProgram.tsx` | Revenue and funding tools |
| `/marketplace` | `Marketplace.tsx` | Creator marketplace — real DB-backed listings (jobs, services, collaborations, local); category tabs + search; featured section; "Post a Listing" opens full form dialog (POST /api/marketplace) |
| `/marketplace/offer/:id` | `OfferDetails.tsx` | Full listing detail view — fetches from DB by ID, shows deliverables, skills, author, related listings; Accept/Express Interest navigates to messages; Share uses Web Share API; Report routes to /support |
| `/messages` | `Messages.tsx` | Direct messages |
| `/search` | `Search.tsx` | Unified search + discovery — creators, posts, vault items, trending |
| `/music` | `MusicUniverse.tsx` | Music tools |
| `/vault` | `VaultDashboard.tsx` | Idea vault — category tabs (Ideas / Screen Recordings), real DB-backed items |
| `/planner` | `Planner.tsx` | Content Planner — large month-view calendar, planning layers (tasks/events/stories/posts/notes), DB-backed |
| `/record` | `RecordStudio.tsx` | Screen Record Studio — MediaRecorder API, IndexedDB blob storage, save/post/schedule flow |
| `/onboarding` | `Onboarding.tsx` | 5-step onboarding wizard (new users) |
| `/auth` | `AuthPage.tsx` | Sign in / register |

### Node 143 (Support Section — `/support/*`)
| Route | Component | Description |
|-------|-----------|-------------|
| `/support` | `node143/Home.tsx` | Support landing with search + categories |
| `/support/diagnose` | `node143/Diagnose.tsx` | Guided diagnostic sessions |
| `/support/downloads` | `node143/Downloads.tsx` | 16-guide catalog |
| `/support/history` | `node143/History.tsx` | Past sessions (auth required) |

## Creator Studio Features (4 Tabs)

### 1. Platform Hub
- Connect/disconnect social accounts (TikTok, Instagram, YouTube, X, Facebook, Telegram)
- View total follower count across all platforms
- AI content generator: enter a topic + platform → get caption, hook, CTA, hashtags, post ideas
- Discover creators grid

### 2. Bio & Links
- Edit display name, bio (500 char), website URL, link-in-bio URL
- Add/remove skill tags
- Profile preview mode showing public-facing profile card

### 3. Portfolio
- Add portfolio items with title, description, image URL, project URL, category, tags, featured flag
- Grid display with delete; supports all creative categories
- Image preview with link to live project

### 4. Design Review
- Submit designs for community feedback (title, description, image, Figma/design URL, category)
- Community tab shows all open submissions
- Mine tab shows user's own submissions
- Per-design feedback dialog with 1-5 star rating + comment system

## Collaboration Hub (`/collaboration`)
- Send collaboration proposals (Brand Deal, Content Swap, Shoutout, Joint Project, Skill Trade, Other)
- Target specific creators or send open proposals
- Track proposal status (pending/accepted/declined/withdrawn)
- Discover Creators grid with "Pitch Them" quick action
- My Proposals tab with withdraw option

## Database Schema (PostgreSQL)

| Table | Purpose |
|-------|---------|
| `users` | Auth + profile (bio, website, bio_link, skills, avatar, header_image) |
| `sessions` | Passport session store |
| `portfolio_items` | Creator portfolio pieces |
| `collaboration_proposals` | Collab pitch requests |
| `design_reviews` | Design submissions for peer review |
| `design_review_feedback` | Feedback/ratings on designs |
| `diagnostic_sessions` | Node 143 troubleshooting sessions |
| `session_feedback` | Post-session outcome feedback |
| `downloaded_guides` | Guide download records |
| `support_tickets` | Escalated support tickets |
| `build_projects` | Build studio projects |
| `social_platforms` | Connected social platform handles |
| `feed_posts` | Community feed posts (text, photo, video, share) |
| `feed_comments` | Nested comments on feed posts |
| `feed_likes` | Likes on feed posts |
| `vault_items` | User content vault items (ideas, clips, notes) |
| `scheduled_posts` | Content planner scheduled posts |
| `notifications` | Per-user notification feed (type, title, body, actionUrl, read flag) |
| `moderation_reports` | User-submitted content reports (post/comment) |
| `moderation_actions` | Admin action log (warn, suspend, remove) |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user
- `PATCH /api/auth/profile` — Update bio/links/skills/avatar/headerImage

### Creator Studio
- `GET/POST /api/social-platforms` — Social platform connections
- `DELETE /api/social-platforms/:id` — Remove platform

### Vault
- `GET/POST /api/vault-items` — List/create vault items
- `PATCH /api/vault-items/:id` — Update item
- `DELETE /api/vault-items/:id` — Remove item

### Content Planner
- `GET/POST /api/scheduled-posts` — List/create scheduled posts
- `PATCH /api/scheduled-posts/:id` — Reschedule/update post
- `DELETE /api/scheduled-posts/:id` — Remove post

### Portfolio
- `GET/POST /api/portfolio` — List/create items
- `PATCH /api/portfolio/:id` — Update item
- `DELETE /api/portfolio/:id` — Remove item

### Collaboration
- `GET/POST /api/proposals` — List/create proposals
- `PATCH /api/proposals/:id/status` — Update status

### Design Review
- `GET /api/design-reviews` — Community open reviews
- `GET /api/design-reviews/mine` — User's own reviews
- `POST /api/design-reviews` — Submit design
- `GET /api/design-reviews/:id/feedback` — Get feedback for design
- `POST /api/design-reviews/feedback` — Leave feedback

### Notifications
- `GET /api/notifications` — User's notifications (unread first)
- `PATCH /api/notifications/:id/read` — Mark notification read
- `POST /api/notifications/read-all` — Mark all read

### Media Upload
- `POST /api/upload` — Single file upload (multer, max 100MB, images+video); returns `{ url, filename, mimetype, size }`
- Files stored in `./uploads/` and served at `/uploads/filename`

### Moderation (Admin only)
- `GET /api/admin/reports` — Pending content reports
- `POST /api/admin/reports/:id/action` — Take moderation action (warn/suspend/remove)
- `GET /api/admin/users` — All users with role/status
- `PATCH /api/admin/users/:id/role` — Change user role
- `PATCH /api/admin/users/:id/suspend` — Suspend/unsuspend
- `GET /api/admin/action-log` — Full moderation action history

### Node 143 (Support)
- `GET/POST /api/sessions` — Diagnostic sessions
- `PATCH /api/sessions/:id` — Update session
- `POST /api/feedback` — Session feedback
- `GET/POST /api/downloads` — Guide downloads
- `GET/POST /api/tickets` — Support tickets
- `PATCH /api/tickets/:id/status` — Update ticket status

## Authentication
- Passport.js local strategy (username + bcrypt password)
- Session stored in PostgreSQL (`sessions` table)
- Google OAuth enabled — `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` set; `/api/auth/google/available` returns true (duplicate hard-coded `false` route removed from routes.ts)
- Protected routes redirect to `/auth`

## Project Map — Sphere Intel Engine (`/project-map`)

A dynamic dashboard driven entirely by live user state. Not a static homepage.

### Key Files
| File | Purpose |
|------|---------|
| `client/src/lib/sphere-intel.ts` | Intelligence engine: 7 build functions + `computeSphereIntel()` |
| `client/src/lib/creator-types.ts` | All shared types: `SphereContext`, `SphereOutput`, `SectionId`, etc. |
| `client/src/pages/ProjectMap.tsx` | Orchestrator: state, queries, one `useMemo` call, dynamic render |
| `client/src/components/project-map/` | 7 extracted components (see below) |

### Sphere Intel Output (`SphereOutput`)
- `focus` — FocusItem: title, guidance (style-aware), `primaryCta`, `primaryRoute`
- `nextMove` — NextMove: title, why, route
- `resumeItems` — ResumeItem[]: sorted by unfinished → revisits → recency
- `pathwaySnaps` — PathwaySnap[]: stage progress (goal-ordered)
- `reflection` — ReflectionData: insight, pattern, prompt (goal-aware tension checks)
- `rankedTools` — RankedTools: primary[4] + secondary[2], goal + data scored
- `sectionOrder` — SectionId[]: computed order driven by live state + depthPreference
- `stage`, `score` — Explorer/Builder/Creator/Maker/Pro (score = platforms×2 + portfolio×3 + proposals×2)

### Section Ordering Logic (`buildSectionOrder`)
Produces `SectionId[]` driving which sections render and in what order:
- **Brand new** → `[suggested-move, quick-tools, reflection]`
- **Active proposals/collabs** → `[recent-work, suggested-move, pathway, quick-tools, reflection]`
- **Collab goal + portfolio** → `[pathway, suggested-move, recent-work, quick-tools, reflection]`
- **Strong portfolio, no outreach** → `[suggested-move, pathway, recent-work, quick-tools, reflection]`
- **Revisit pattern** → `[recent-work, suggested-move, pathway, quick-tools, reflection]`
- **light depth pref** → strips `pathway` and `reflection` from any order above

### FocusCard CTA Labels (dynamic, state-driven)
State 1 (nothing): "Get started" / "Build your presence" / "Shape your offer"
State 2 (platforms, no portfolio): "Add your first piece"
State 3 (active collab): "Open Build Space"
State 4 (pending proposals): "Review proposal(s)"
State 5 (ready to pitch): "Start outreach"
State 6 (early portfolio): "Keep building" or "Start outreach"
State 7 (brand/consistent): "Keep creating" / "Keep building"

### Creator Goals (localStorage: `cs_creator_goals`)
4 goals: `launch-offer`, `land-collabs`, `grow-brand`, `explore`
All 7 build functions are goal-aware (adjusted thresholds, copy, ordering, tension checks)

### User Preferences (localStorage: `cs_user_prefs`)
- `guidanceStyle`: soft / direct / structured / creative → changes all guidance text
- `depthPreference`: light / medium / deep → `light` strips pathway + reflection from sectionOrder

### Components
| Component | Role |
|-----------|------|
| `DashboardHeader` | Sticky: greeting + focus subtitle + settings + avatar |
| `FocusCard` | Hero anchor — always first; dynamic CTA label; single action |
| `SuggestedMoveCard` | Left-accent bar; "Next move" label; start action |
| `RecentWorkCard` | Resume list: unfinished flagged amber, collab purple, portfolio blue |
| `PathwaySnapshotCard` | Top pathway only; dot-segment progress track |
| `QuickToolsGrid` | 3-col, top 3 tools from rankedTools |
| `ReflectionCard` | Quiet divider section; goal-tension aware insight |

## Sphere Intel — Ambient AI Intelligence System

Three-layer system spanning all authenticated pages:

### Layer 1 — Floating Orb
- `client/src/components/sphere-intel/SphereIntelPanel.tsx` — Global floating orb + bottom-sheet panel
- 4 modes: **Write** (suggest), **Plan** (organize), **Insights** (analyze), **Support** (solve)
- Orb label text: SUGGEST / PLAN / INSIGHT / SUPPORT
- Mode word: Suggestion / Plan / Insight / Support
- All references to orb use: "Open Sphere Intel — {modeWord}" aria-label

### Layer 2 — Embedded Intel Cards
- `client/src/components/sphere-intel/SphereIntelCard.tsx` — Per-page contextual cards
- Badge labels: Suggestion / Plan / Insight / Support (never: Create/Organize/Analyze/Solve)
- Footer CTA: "Ask Sphere Intel →" (never "Full Intel" or "Open Intel")

### Layer 3 — In-page Intel Strips
- Each main page has a Sphere Intel section card with `Ask Sphere Intel` header button
- Pages: Home, Analytics, Planner, VaultDashboard, CreatorPlatform, SphereSolvePage, Settings

### Tier System
- `client/src/lib/sphere-intel-tiers.ts` — free/pro tiers, TASK_TIERS, RESPONSE_DEPTH, buildTierContextBlock()
- Free: 1 variant / 10 requests/day; Pro: 3 variants / unlimited

## Phase Completion Notes

### Phase 1 — Foundations (Completed)
- **Landing page**: 9-slide BenefitSlideshow with unique gradient per slide, auto-advance, dot nav, prev/next, stat badges, CTA
- **Onboarding guard**: Home.tsx redirects unauthenticated users to `/onboarding` until `creatorsphere_onboarded` localStorage key is set
- **Media upload**: `POST /api/upload` (multer, 100MB, images+video); files in `./uploads/`; FeedComposer + VaultDashboard wired
- **Platform connections**: Settings.tsx uses real `/api/social-platforms` API (connect dialog with handle/url/followers, disconnect by ID)
- **Real notifications**: comment → `comment_received` for post owner; follow → `new_activity`; vault create → `draft_saved`; scheduled post → `post_scheduled`
- **Planner language humanization**: toast messages and stats copy updated to creator-native language ("Added to your week ✓", "open slots this week", "Vault ideas ready to schedule")

### Phase 2 — Creator Engine (Completed)
- **Planner visual redesign**: 7-column WeeklyGrid, ScheduleModal bottom-sheet, IntelBanner, Intel suggestion ghost cards
- **Voiceover + Lip-sync in Vault**: StudioSection with real file upload (audio/*), in-line players, saves to vault_items
- **Messages real file upload**: hidden fileInputRef, `/api/upload` integration, filename preview badge, UploadCloud import cleaned
- **Analytics real data**: pulls `/api/social-platforms` (real followers, platform names with Live badge), `/api/vault-items` count, own post count; falls back to sample data gracefully
- **Home Dashboard real data**: pulls real platforms (PLATFORM_ICONS/PLATFORM_BG mapping), real vault items; `getDashboardRecommendation` uses real platform state
- **Creator Profile video support**: posts tab renders video URLs via `<video>` element with controls
- **DashboardIntelCard**: queries real platforms, shows "no platforms" message when none connected

### Phase 4 — Stabilization (Completed)
- **Comments/reactions fixed**: Added `credentials: "include"` to all CommunityFeed fetch calls (POST comment, DELETE comment, POST share, POST react) — was returning 401
- **Watermark text**: `buildBrandedCaption` changed from "Made with Creatorsphere" → "Posted from Creatorsphere" in `watermark.ts`; Studio.tsx description copy updated to match
- **Dead Pro badge removed**: Removed fake "Pro" lock badge from watermark toggle in Studio StepPost (no Pro tier exists)
- **Facebook share dialog**: `ShareOutwardRow.copyAndOpen` now builds a real Facebook sharer URL (`/sharer/sharer.php?u=...&quote=...`) instead of opening plain `facebook.com`
- **Mobile bottom padding**: Added `pb-24 lg:pb-10` to VaultDashboard, Marketplace, PersonaEngine pages that were missing it

### Phase 5 — Private Beta Readiness (Completed)
- **Domain locked**: `PRODUCTION_DOMAIN=creatorsphere2.com` env secret set; `getBaseUrl()` always returns `https://creatorsphere2.com`; all OAuth callbacks use this domain
- **Session trust proxy**: `app.set("trust proxy", 1)` now set unconditionally (was only on `NODE_ENV=production`); cookie `secure` tied to `PRODUCTION_DOMAIN` presence — fixes YouTube/Google OAuth state round-trip in production
- **Nav cleanup**: Removed `capital-builder`, `collaboration`, `project-map` from AppShell sidebar; added `messages` to nav; order: Home → Search → Creator Studio → Screen Record → Vault → Planner → Platforms → Analytics → Community → Persona Engine → Marketplace → Messages → Settings → Command Centre
- **Stale routes removed**: `/learning`, `/truth-hub` (both ComingSoon stubs) removed from App.tsx router; `ComingSoon` import removed
- **YouTube OAuth setup guide**: Clicking "Connect" on YouTube now shows a pre-flight dialog with the exact redirect URI (`https://creatorsphere2.com/api/platforms/youtube/callback`) and 4-step Google Cloud Console setup instructions before redirecting to Google OAuth — prevents silent failures from misconfigured redirect URIs
- **CommunityFeed.tsx bug fixed**: Missing `const [, setLocation] = useLocation()` in main `CommunityFeed` component caused TS error at line 2019; now correctly declared

### Phase 3 — Depth (Completed)
- **Analytics rebuilt** — real top posts by engagement from feed, content type breakdown bar chart (text/photo/video), posting time heatmap (midnight/morning/afternoon/evening), Sphere Intel card adapts to real vs sample data, stat cards show real follower/post/vault counts
- **Membership upgraded** — renamed "Free" → "Core", added `COMPARE_ROWS` feature table (expandable), founder-friendly upgrade messaging ("Coming soon" toast instead of dead link), current plan banner chip at top of section
- **Collaboration Hub** — pulls real creators from `/api/trending` for the Discover tab; gracefully falls back to 6 sample creators; stats row (active creators / open to collabs / avg response); view profile button per card; coloured avatar gradients by username hash

## Visual Theme — Cosmic Dark

- **Global:** `client/index.html` has `class="dark"` on `<html>`; dark is always the default
- **CSS:** `client/src/index.css` — full cosmic dark vars (bg: `272 44% 5%`, card: `270 38% 9%`, primary: `265 72% 64%`, border: `270 38% 15%`), glass utilities (`.glass-panel`, `.glow-violet`, `.sidebar-glow-border`), cosmic animations
- **AppShell:** Dark glass sidebar, bottom nav, mobile header
- **AuthPage:** Layered ambient sphere glows, glass panel, cosmic entry experience

### Theme Conventions
- Page wrappers: `min-h-screen pb-24 lg:pb-8` (no `bg-muted/20` on outer divs)
- Avatar gradients: `from-violet-500 to-purple-700` (not `from-primary to-purple-600`)
- Nav active states: `bg-primary/15 text-primary` (not `bg-primary text-primary-foreground`)
- Nav hover: `hover:bg-white/5 hover:text-foreground`
- Intel cards: glass `bg-card/80 backdrop-blur-sm` with `border-border/60`

## DB Migration Note
`drizzle-kit push` fails with TTY error in this environment. Use `executeSql()` in the code_execution sandbox to run raw SQL for schema changes.

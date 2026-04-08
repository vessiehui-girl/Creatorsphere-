# CreatorSphere — Master Features Map
## Accurate Build State + Implementation Roadmap

---

## HOW TO READ THIS MAP

Each feature has a **status**:
- ✅ **Built** — live and working in the codebase
- ⚠️ **Partial** — scaffolded but incomplete or needs env config
- ❌ **Not built** — not yet implemented

---

## LEVEL 1 — MUST BUILD NOW

These are the backbone. The platform cannot function without them.

### Auth & Access
| Feature | Status | Notes |
|---------|--------|-------|
| Username/password login | ✅ Built | Passport.js LocalStrategy, session-based |
| Register new account | ✅ Built | Hashed passwords, stored in PostgreSQL |
| Persistent sessions | ✅ Built | express-session + PostgreSQL session store |
| Google OAuth sign-in | ⚠️ Partial | Strategy coded; needs `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` env vars |
| Facebook OAuth sign-in | ❌ Not built | No FacebookStrategy in auth.ts |
| Google/Facebook return flow | ⚠️ Partial | Google callback route exists; Facebook missing entirely |
| Protected route guards | ✅ Built | `requireAuth` middleware on all private routes |
| Auth error messages | ✅ Built | Clear toasts for wrong password, user not found |

### Platform Connection Flow
| Feature | Status | Notes |
|---------|--------|-------|
| Connect TikTok/Instagram/YouTube/X/Facebook/Telegram | ✅ Built | Manual handle+URL+followers input saved to `social_platforms` table |
| View connected platforms | ✅ Built | Settings → Connected Platforms section |
| Disconnect platform | ✅ Built | DELETE `/api/social-platforms/:id` |
| Real OAuth platform linking | ❌ Not built | Currently manual input only — no TikTok/Instagram OAuth handshake |
| Platform follower sync | ❌ Not built | Followers entered manually; no API sync |

### Media Upload
| Feature | Status | Notes |
|---------|--------|-------|
| File upload route | ✅ Built | `POST /api/upload` — multer, 100MB limit |
| Image upload | ✅ Built | Accepted: `image/*` |
| Video upload | ✅ Built | Accepted: `video/*` |
| Audio upload | ✅ Built | Accepted: `audio/*` |
| Upload in feed composer | ✅ Built | CommunityFeed FeedComposer with file picker |
| Upload in Vault | ✅ Built | VaultDashboard → Studio section |
| Upload in Messages | ✅ Built | Messages.tsx hidden fileInputRef |
| Upload size/type validation | ✅ Built | Server-side mime check + 100MB limit |

### Creator Vault
| Feature | Status | Notes |
|---------|--------|-------|
| Vault page | ✅ Built | `/vault` → VaultDashboard.tsx |
| Save idea/draft/caption | ✅ Built | Category tabs: Ideas, Drafts, Captions, Media, Ready, Archive |
| Save voiceover clip | ✅ Built | Studio section → upload to `/api/vault-items` with `assetType: voiceover` |
| Save lip-sync clip | ✅ Built | Studio section → upload to `/api/vault-items` with `assetType: lipSync` |
| Vault items persisted to DB | ✅ Built | `vault_items` PostgreSQL table |
| Per-item Sphere Intel actions | ✅ Built | Generate caption, turn into post, repurpose, best platform |
| Status tags (unused/ready/archived) | ✅ Built | PATCH `/api/vault-items/:id` |
| Vault item delete | ✅ Built | DELETE `/api/vault-items/:id` |
| Vault Intel banner | ✅ Built | AI suggestion strip at top of Vault |

### Dashboard
| Feature | Status | Notes |
|---------|--------|-------|
| Home dashboard | ✅ Built | `/` → Home.tsx |
| Real platform data in dashboard | ✅ Built | Queries `/api/social-platforms` |
| Real vault count in dashboard | ✅ Built | Queries `/api/vault-items` |
| Sphere Intel recommendation card | ✅ Built | DashboardIntelCard with real platform state |
| Quick actions | ✅ Built | Post, Schedule, Save idea, Record |
| Creator DNA / streak widget | ✅ Built | ContentStreak, CreatorDNA components |
| Platform list in dashboard | ✅ Built | Merged real + fallback display |

### Scheduler
| Feature | Status | Notes |
|---------|--------|-------|
| Schedule a post | ✅ Built | Planner → ScheduleModal → `POST /api/scheduled-posts` |
| Weekly grid view | ✅ Built | 7-column WeeklyGrid, time slots 6 AM–10 PM |
| Edit scheduled post | ✅ Built | PATCH `/api/scheduled-posts/:id` |
| Delete scheduled post | ✅ Built | DELETE `/api/scheduled-posts/:id` |
| Schedule from Vault | ✅ Built | VaultDashboard → Schedule button on asset |
| Post notifications on schedule | ✅ Built | `post_scheduled` notification fired on save |

### First-Use Experience
| Feature | Status | Notes |
|---------|--------|-------|
| Onboarding wizard | ✅ Built | 5-step Onboarding.tsx — niche, goals, idea, platform start |
| Onboarding guard | ✅ Built | Home.tsx checks `creatorsphere_onboarded` in localStorage |
| Landing for logged-out users | ⚠️ Partial | Onboarding shows but no public marketing landing page |
| Creator-native language | ✅ Built | "Save your first idea", "Drop rough thoughts", "Added to your week ✓" |
| Visual cosmic dark design | ✅ Built | Full cosmic dark theme — gradient spheres, glass cards, ambient glows |

---

## LEVEL 2 — NEXT WAVE

These make the platform feel alive and social. Most are built.

### Community Feed
| Feature | Status | Notes |
|---------|--------|-------|
| Text posts | ✅ Built | CommunityFeed.tsx FeedComposer |
| Photo posts | ✅ Built | Image upload + multi-image grid |
| Video posts | ✅ Built | Video URL or upload → `<video>` player |
| Recording posts | ✅ Built | Post from RecordStudio directly to feed |
| Like posts | ✅ Built | Optimistic update + `POST /api/feed/:id/like` |
| Comments | ✅ Built | Inline CommentsSection, real DB storage |
| Share posts | ✅ Built | ShareDialog with copy link + `POST /api/feed/:id/share` |
| Emoji reactions | ✅ Built | ReactionBar — 6 emoji types |
| Delete own post | ✅ Built | DELETE `/api/feed/:id` |
| Report post | ✅ Built | ReportModal → `POST /api/reports` |
| Post scheduling from feed | ✅ Built | FeedComposer → Schedule option |

### Messaging
| Feature | Status | Notes |
|---------|--------|-------|
| Direct messages | ✅ Built | Messages.tsx with conversation list |
| Send text message | ✅ Built | `POST /api/messages/:userId` |
| Send file/image/video | ✅ Built | Upload via `/api/upload` + inline preview |
| Read receipts | ✅ Built | `POST /api/messages/:userId/read` |
| Real-time polling | ✅ Built | 5s refetch on messages list |
| Message notifications | ✅ Built | `message_received` notification type |

### Notifications
| Feature | Status | Notes |
|---------|--------|-------|
| Notification bell | ✅ Built | AppShell bell with unread count badge |
| 30-second polling | ✅ Built | useQuery refetchInterval in AppShell |
| notification types | ✅ Built | comment_received, message_received, draft_saved, post_scheduled, post_failed, platform_disconnected, new_activity, sphere_intel |
| Mark as read | ✅ Built | Per-notification + mark all read |
| Notification action links | ✅ Built | Each notification links to relevant page |

### Screen Recording
| Feature | Status | Notes |
|---------|--------|-------|
| Record Studio page | ✅ Built | `/record` → RecordStudio.tsx |
| MediaRecorder API | ✅ Built | Screen capture with mic option |
| IndexedDB blob storage | ✅ Built | Local recording persistence |
| Save to Vault | ✅ Built | `POST /api/vault-items` with `source: recording` |
| Post to feed | ✅ Built | Direct to FeedComposer |
| Schedule recording | ✅ Built | Schedule from RecordStudio |

### Content Planner
| Feature | Status | Notes |
|---------|--------|-------|
| Planner page | ✅ Built | `/planner` → Planner.tsx |
| Weekly grid | ✅ Built | 7-column layout, time slots |
| Schedule modal | ✅ Built | Title, platform, time, vault link |
| Intel suggestion cards | ✅ Built | Ghost suggestion cells with Sphere Intel tips |
| Platform selector | ✅ Built | TikTok, Instagram, YouTube, X, LinkedIn |
| Creator-language copy | ✅ Built | "open slots", "ready to schedule", "Added to your week ✓" |

### Creator Profile
| Feature | Status | Notes |
|---------|--------|-------|
| Public creator profile | ✅ Built | `/creator/:username` → CreatorProfile.tsx |
| Posts tab | ✅ Built | Shows images + video from `mediaUrls` |
| Work tab | ✅ Built | Portfolio items |
| About tab | ✅ Built | Bio, joined date, social links |
| Follow button | ✅ Built | `POST /api/users/:id/follow` |
| Message button | ✅ Built | Links to `/messages` |
| Social platform pills | ✅ Built | Shows connected platforms |
| Profile edit | ⚠️ Partial | Edit via Settings → Profile; no in-page edit on profile itself |

### Vault / Media Categories
| Feature | Status | Notes |
|---------|--------|-------|
| Ideas category | ✅ Built | Filtered by assetType |
| Drafts category | ✅ Built | Filtered by assetType |
| Captions category | ✅ Built | Filtered by assetType |
| Media category | ✅ Built | Recordings, photos, videos |
| Ready to Post | ✅ Built | Filtered by status: ready |
| Archive | ✅ Built | Filtered by status: archived |
| Voiceovers | ✅ Built | Studio section with upload + player |
| Lip-sync | ✅ Built | Studio section with upload + player |

---

## LEVEL 3 — FUTURE SCALE

These add depth, revenue, and long-term platform value.

### Content Editing Tools
| Feature | Status | Notes |
|---------|--------|-------|
| Video trimmer | ❌ Not built | Requires FFmpeg or browser-based trim library |
| Image crop / resize | ❌ Not built | Needs canvas-based crop tool (e.g. react-image-crop) |
| Thumbnail picker | ❌ Not built | Video frame extraction via canvas |
| Text overlay on image/video | ❌ Not built | Canvas API layer over media |
| Add voiceover to video | ❌ Not built | Web Audio API + MediaRecorder combination |
| Watermark toggle | ✅ Built | Canvas bakes into images; captions branded on external platforms; shared config via `lib/watermark.ts` |

### Deeper Analytics
| Feature | Status | Notes |
|---------|--------|-------|
| Content type breakdown | ✅ Built | Text/photo/video bar chart from real posts |
| Posting time heatmap | ✅ Built | Midnight/morning/afternoon/evening from real posts |
| Top posts by engagement | ✅ Built | Real feed posts sorted by likes + comments |
| Platform breakdown | ✅ Built | Real connected platforms with followers |
| Engagement time-series chart | ❌ Not built | No historical engagement data stored per post |
| Follower growth chart | ❌ Not built | No follower history snapshots in DB |
| Platform API analytics | ❌ Not built | Would need real platform OAuth + API calls |
| Intel-powered interpretation | ✅ Built | Sphere Intel card with deep-dive analysis actions |

### Search & Discovery
| Feature | Status | Notes |
|---------|--------|-------|
| Search page | ✅ Built | `/search` → Search.tsx |
| Search posts | ✅ Built | Full-text search via `/api/search` |
| Search creators | ✅ Built | Returns matching users |
| Search Vault items | ✅ Built | Included in unified search |
| Trending posts | ✅ Built | `/api/trending` — last 30 days by score |
| Trending creators | ✅ Built | Returned in trending API |
| Hashtag/topic filtering | ⚠️ Partial | Content tags exist but no dedicated hashtag browse page |

### Collaboration Hub
| Feature | Status | Notes |
|---------|--------|-------|
| Send collaboration proposal | ✅ Built | 6 types: brand deal, swap, shoutout, joint, skill trade, other |
| Discover creators | ✅ Built | Real creators from trending + fallback grid |
| Proposal status tracking | ✅ Built | Pending / accepted / declined / withdrawn |
| Withdraw proposal | ✅ Built | PATCH to withdrawn status |
| View creator profile from collab | ✅ Built | "View" button → `/creator/:username` |
| Shared creator spaces | ❌ Not built | Requires multi-user project/workspace architecture |
| Permissions / team roles | ❌ Not built | No team entity in DB |

### Moderation & Admin
| Feature | Status | Notes |
|---------|--------|-------|
| Admin panel | ✅ Built | `/admin` → AdminPanel.tsx |
| Report post/comment/user | ✅ Built | ReportModal → `POST /api/reports` |
| View reports (admin) | ✅ Built | GET `/api/reports` (admin only) |
| Suspend user | ✅ Built | PATCH user suspension with reason + duration |
| Remove content | ✅ Built | Admin delete post/comment |
| Role system | ✅ Built | `user` / `moderator` / `admin` on users table |
| Moderation queue | ⚠️ Partial | Reports visible in admin panel; no priority queue or status workflow |

### Subscription & Billing
| Feature | Status | Notes |
|---------|--------|-------|
| Tier display (Core/Creator/Pro) | ✅ Built | Settings → Membership with feature comparison table |
| Upgrade CTA surfaces | ✅ Built | Upgrade buttons with "coming soon" toast |
| Feature comparison table | ✅ Built | Expandable side-by-side table in Membership section |
| Stripe payment integration | ❌ Not built | No Stripe keys or checkout flow |
| Usage limit enforcement | ❌ Not built | Limits defined in sphere-intel-tiers.ts but not enforced server-side |
| Tier-gated API responses | ❌ Not built | All features available to all users currently |
| Subscription management | ❌ Not built | No cancel/upgrade/downgrade flow |
| Founder pricing tier | ❌ Not built | Not in pricing table yet |

### Sphere Intel Pro
| Feature | Status | Notes |
|---------|--------|-------|
| Intel floating orb | ✅ Built | SphereIntelPanel.tsx — 4 modes |
| Per-page Intel cards | ✅ Built | SphereIntelCard.tsx on all main pages |
| Intel tier definitions | ✅ Built | sphere-intel-tiers.ts — free 3/day, pro unlimited |
| Pro variant count (3 vs 1) | ⚠️ Partial | Defined in tier config but not enforced |
| Daily request cap | ❌ Not built | No request counting or cap enforcement |
| Pro upgrade gate | ❌ Not built | No paywall before Intel actions |

---

## GENUINE GAPS SUMMARY

Stripping to only what is **genuinely not built yet**:

### Immediate (blocks real use)
1. **Facebook OAuth** — no strategy at all in auth.ts
2. **Google OAuth env config** — needs `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` set in environment
3. **Real platform OAuth** — TikTok/Instagram platform connection is manual input only (no API handshake)
4. **Public marketing landing** — no unauthenticated landing page; new visitors hit onboarding directly

### Short term (makes product feel complete)
5. **In-profile edit modal** — profile editing redirects to Settings instead of editing in-place
6. **Hashtag browse page** — no way to browse all posts with a specific tag
7. **Moderation queue status** — reports have no "resolved / in review / dismissed" workflow
8. **Follower growth snapshots** — no historical data stored, so growth chart is not possible yet

### Future (revenue + depth)
9. **Stripe billing** — subscription UI exists, no payment flow
10. **Usage limit enforcement** — tier limits defined but not enforced server-side
11. **Video editing tools** — trim, crop, text overlay, thumbnail pick
12. **Engagement time-series** — no per-post engagement history stored in DB
13. **Shared collaboration spaces** — no multi-user workspace entity

---

## RECOMMENDED NEXT BUILD ORDER

```
Priority 1 — Fix access layer
  → Set GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET env vars
  → Add Facebook OAuth strategy (passport-facebook)
  → Add public-facing landing page for logged-out visitors

Priority 2 — Polish identity
  → In-profile edit modal (quick edit without going to Settings)
  → Hashtag browse / tag feed page

Priority 3 — Make moderation real
  → Report status workflow (open → in review → resolved)
  → Moderation queue with priority + assignment

Priority 4 — Revenue architecture
  → Stripe Checkout integration (Creator tier first)
  → Server-side usage counting for Sphere Intel
  → Tier-gated API responses

Priority 5 — Content depth
  → Image crop / thumbnail tool (canvas-based, no backend needed)
  → Per-post engagement history table → follower growth chart
  → Shared project spaces for collab
```

---

*Last updated: March 2026 — CreatorSphere v1.0*
*All "built" items are live in the PostgreSQL-backed codebase and accessible in the app.*

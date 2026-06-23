# Eschatia Phase 2 / V2 — Feature Roadmap

> **Status:** Planned — implement after MVP ships.

## Goal

Hard-earned engagement: features that make the app feel worth returning to repeatedly, reward depth, and make sessions feel meaningful rather than passive.

---

## Phase 2A — Depth & Return Value

### 1. Guided Tours
Curated multi-destination journeys with a connective narrative arc.

**Examples:**
- "The Life Cycle of a Star" → L1527 → Pillars of Creation → Carina Nebula → Ring Nebula → Crab Nebula
- "Our Solar System Through Webb" → Jupiter → Neptune → Orion Nebula
- "The Scale of the Universe" → Herbig-Haro 211 → Tarantula Nebula → Pandora's Cluster → SMACS 0723

**Data shape:** `src/data/tours/*.json` — `{ id, title, theme, destinations: [id...], transitions: [{ from, to, bridgeText }] }`

**Files to create/modify:**
- `src/pages/Tours.jsx` (new) — tour index at `/tours`
- `src/pages/Tour.jsx` (new) — tour runner with progress bar + bridge text + Next/Prev controls
- `src/data/tours/*.json` (new) — 5-8 curated tours
- `src/App.jsx` — add `/tours` and `/tours/:id` routes
- `src/pages/Explore.jsx` — add "Guided Tours" section below grid

---

### 2. Cosmic Passport — Progress Tracking
Track which destinations the user has visited. Completion indicator on each Explore card (gold dot). `/passport` page with constellation-map-style grid showing visited vs. unvisited, percentage complete.

**Implementation:** `localStorage` keyed by destination ID. No auth required.

**Files to create/modify:**
- `src/hooks/usePassport.js` (new)
- `src/pages/Passport.jsx` (new) — at `/passport`
- `src/components/DestinationCard.jsx` — visited indicator
- `src/pages/Destination.jsx` — mark visited on mount

---

### 3. Share a Moment — Deep Link Sharing
"Share this view" button in the destination top bar. Copies a URL encoding current zoom level + center coordinates + active hotspot. Loading that URL restores the exact view.

**Implementation:** Encode OSD viewport state (`zoom`, `centerX`, `centerY`, `hotspot?`) as URL search params. Toast notification on copy.

**Files to create/modify:**
- `src/pages/Destination.jsx` — read/write viewport state from URL params, share button
- `src/components/ShareButton.jsx` (new) — clipboard + toast
- `src/hooks/useCinematicTransition.js` — preserve search params through navigation

---

### 4. Audio Narration
Each destination gets voiced narration (1-2 min) that plays as the user explores. Auto-advances to hotspot descriptions when a hotspot is clicked.

**Short term:** Web Speech API (`speechSynthesis`) using existing `introduction` text — zero cost, instant.  
**V2 proper:** Pre-generated TTS `.mp3` files (ElevenLabs or similar) in `public/narration/`. Add optional `narrationUrl` field to destination JSON.

**Files to create/modify:**
- `src/hooks/useNarration.js` (new)
- `src/components/NarrationPanel.jsx` — play/pause control
- `src/components/HotspotOverlay.jsx` — trigger narration segment on hotspot click
- `src/data/destinations/*.json` — add optional `narrationUrl`

---

## Phase 2B — Exploration & Discovery

### 5. Discoveries Page V2
Upgrade the basic observations grid with:
- Instrument filter pills (NIRCam / MIRI / NIRSpec / NIRISS)
- Category filter (nebula / galaxy / exoplanet / calibration)
- "Today in Webb" featured observation at top
- Visual spectrum badges (wavelength bands captured)

**Files to modify:**
- `src/pages/Discoveries.jsx`
- `src/hooks/useJWSTFeed.js` — complete the stub, add filtering

---

### 6. Search & Filter on Explore
Search bar + filter chips on Explore page header. Filter by `type` field, search by name. Framer Motion animate in/out on filter change.

**Files to modify:**
- `src/pages/Explore.jsx`

---

### 7. Related Destinations
"You might also explore" section at the bottom of NarrationPanel showing 2-3 thematically related destinations. Clicking triggers cinematic transition.

**Files to modify:**
- `src/data/destinations/*.json` — add `related: [id, id, id]` field
- `src/components/NarrationPanel.jsx` — render related cards
- `src/pages/Destination.jsx` — pass DESTINATIONS map to NarrationPanel

---

## Phase 2C — Platform & Habit Formation

### 8. Progressive Web App (PWA)
Install to home screen. Cache visited destination data + images for offline access.

**Implementation:** `vite-plugin-pwa`. Pre-cache 20 destination JSONs and card images.

**Files to create/modify:**
- `vite.config.js` — VitePWA plugin
- `public/manifest.json` (new)
- `src/main.jsx` — register service worker

---

### 9. Keyboard Navigation & Hotspot Cycling
- `H` — cycle through hotspots (1→2→3→4→1)
- `←` / `→` — previous/next destination
- `F` — fullscreen
- `1`–`4` — jump to specific hotspot

**Files to modify:**
- `src/pages/Destination.jsx` — global keydown handler
- `src/components/HotspotOverlay.jsx` — expose `activeIndex` cycling

---

## Verification

| Feature | Test |
|---|---|
| Guided Tours | Load `/tours`, advance through all stops, verify bridge text + progress bar |
| Cosmic Passport | Visit 3 destinations, refresh, verify state persists on `/passport` |
| Share a Moment | Zoom into hotspot, click Share, paste URL in new tab — verify exact view restored |
| Audio Narration | Click play, verify intro reads; click hotspot, verify correct segment plays |
| PWA | `npm run build && vite preview` → Chrome install prompt appears |
| Search/Filter | Type "nebula", verify only matching cards shown |
| Related Destinations | Open Ring Nebula, verify 2-3 related appear at panel bottom, clicking transitions |

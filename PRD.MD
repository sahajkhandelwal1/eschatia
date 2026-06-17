Eschatia — MVP Product Requirements Document
Overview
Eschatia is a web application that transforms publicly available James Webb Space Telescope data into narrated, interactive journeys for a general audience. The core experience is a portal landing page from which users select a cosmic destination, enter a full-screen deep-zoom viewer, and receive spatially-aware narration about what they're looking at — no scientific background required.
The MVP scopes to a curated set of 10 destinations, static narration written by hand, a working deep-zoom viewer, and a live data feed from the JWST API. The goal is a shippable, demo-able product that proves the core loop: land → choose a destination → enter → explore → understand something you didn't before.

Problem
NASA's JWST data is publicly accessible but practically inaccessible. The existing tools — MAST portal, JADES interactive viewer, FITS file archives — are built for astronomers. A curious non-scientist who wants to understand what JWST has actually discovered has nowhere to go that isn't either a static NASA press release image with a caption, or a Wikipedia article. The gap between "I saw a JWST image go viral" and "I actually understand what I'm looking at" has no product filling it.

Users
Primary: curious non-scientists aged 14–35 who have seen JWST images on social media and want to go deeper without needing a physics background. Secondary: high school and undergraduate science educators looking for engaging visual material. Tertiary: Hack Club / Stardance community of teen builders who will vote on the project.

Goals for MVP
Ship a working, publicly accessible web app at eschatia.space (or similar) that demonstrates the full core loop end to end. Achieve a Stardance voting score sufficient for 20+ stardust per logged hour. Generate at least 50 return visitors in the first two weeks. Produce a demo video suitable for the Karpathy/Mark Rober YouTube format.

Non-goals for MVP
User accounts, saved progress, or personalization. Mobile-native app. Real-time AI narration generation (static text only for MVP). Spectroscopic data visualization. Full MAST archive search. Accessibility beyond basic WCAG compliance.

Core user flow
Landing page
    → user clicks a destination card
        → cinematic transition (zoom + fade)
            → full-screen viewer loads
                → narration panel appears
                    → user pans / zooms the image
                        → clicking a highlighted region
                            → narration updates to describe that region
                                → scale translation sidebar shows human-scale comparisons
Every step of this flow must work end to end before anything else is built.

Pages and screens
1. Landing page
The portal. Full-screen dark background with procedurally generated starfield (200 randomized points, CSS-animated twinkle at staggered intervals). Horizon line composition with gold accent color — the aesthetic of standing at the edge looking out. Navigation: logo mark, Explore, Discoveries, About, Enter CTA.
Hero section contains: site name in spaced uppercase, subtitle "The outermost frontier", one-line tagline, two CTAs ("Begin the journey" primary, "What is this?" secondary).
Below the fold: stat strip (13.8B years of lookback time · 6,200+ JWST observations · 0 prerequisites). Destination card grid (3 columns, 10 total destinations paginated or scrollable). Footer with the Greek etymology definition and NASA/ESA/MAST attribution.
2. Destination viewer
Full-screen. No chrome except a minimal top bar with the destination name, distance, and a back arrow. The image occupies the entire viewport via OpenSeadragon deep-zoom.
Three overlaid UI layers:
Narration panel — slides in from the right on load. 280px wide, dark semi-transparent background. Contains: destination name, one-paragraph plain-language introduction, 3–5 "points of interest" listed with icons. Collapsible to an icon.
Hotspot markers — SVG circles overlaid on the image at specific coordinates. On hover: tooltip with a 1-line label. On click: narration panel updates to describe that region. MVP ships 3–5 hotspots per destination.
Scale sidebar — a fixed bottom-left panel showing 3 scale translations. Example for the Pillars of Creation: "Each pillar is roughly 4 light-years tall — about the same distance as from Earth to the nearest star outside our solar system." These are written statically per destination for MVP.
3. Discoveries feed
A reverse-chronological list of JWST data releases pulled from the JWST API (jwstapi.com). Each entry shows: thumbnail, observation name, program ID, release date, and a one-sentence plain-language description written by hand for the MVP's initial 20 entries. Links to the full viewer if the destination exists, or to the MAST source if not.
This page proves the "living feed" concept that makes Eschatia a recurring destination rather than a one-time experience.
4. About page
One screen. Contains: the etymology definition of eschatia in Greek with transliteration. A 3-paragraph explanation of what JWST is, why its data is remarkable, and why Eschatia exists. Attribution: NASA, ESA, CSA, STScI, MAST. Link to the GitHub repo (open source, required for Stardance). Built by line with your name and links.

The 10 MVP destinations
Selected for visual drama, scientific significance, and range of object type. Each requires: a web-ready high-resolution image (PNG/JPEG from NASA public releases), a written introduction (150–200 words), 3–5 hotspot coordinates with descriptions, and 3 scale translations.
#
Destination
Type
Distance
Why it's here
1
SMACS 0723
Deep field / gravitational lensing
4.6B ly
JWST's first released image, most recognizable
2
Pillars of Creation
Stellar nursery
6,500 ly
Most viral JWST image, emotionally resonant
3
Stephan's Quintet
Galaxy cluster
290M ly
Shows galaxy collision in real time
4
Carina Nebula
Star-forming region
7,600 ly
Dramatic cliff-of-creation composition
5
Southern Ring Nebula
Planetary nebula
2,000 ly
Shows stellar death, binary star system
6
Cartwheel Galaxy
Ring galaxy
500M ly
Rare ring structure from ancient collision
7
Tarantula Nebula
Star-forming region
161,000 ly
Largest known star-forming region
8
Neptune rings
Solar system
4.4B km
First clear view of Neptune's rings in decades
9
Phantom Galaxy (M74)
Spiral galaxy
32M ly
JWST's sharpest spiral galaxy, face-on
10
Webb's First Deep Field
Earliest galaxies
13.1B ly
Farthest light ever imaged


Technical architecture
Stack
React 18 with Vite for the build toolchain. React Router v6 for client-side routing. OpenSeadragon for the deep-zoom viewer — it handles tile-based pan/zoom natively and is the same engine used by major museum digital collections. Tailwind CSS for utility styling. Framer Motion for the landing-to-viewer transition animation. Deployed on Vercel, free tier.
Data layer
MVP uses a hybrid approach. The 10 destination images are served as static assets — NASA public release images downloaded and hosted in /public/destinations/. This avoids CORS issues, rate limits, and load time unpredictability for the core experience.
The Discoveries feed hits the JWST API (jwstapi.com) live, with a simple Express or Vercel edge function proxy to handle the API key. Response cached at the edge for 1 hour.
Narration content (introductions, hotspot descriptions, scale translations) is stored as a JSON file per destination in /src/data/destinations/. Each file has the schema below. This makes content editing trivial without touching component code, and makes it easy to later swap static text for AI-generated text.
Destination data schema
json
{
  "id": "pillars-of-creation",
  "name": "Pillars of Creation",
  "type": "Stellar nursery",
  "distance": "6,500 light-years",
  "constellation": "Serpens",
  "image": "/destinations/pillars-of-creation.jpg",
  "introduction": "...",
  "hotspots": [
    {
      "id": "pillar-1",
      "label": "The tallest pillar",
      "x": 0.42,
      "y": 0.31,
      "description": "..."
    }
  ],
  "scaleTranslations": [
    "Each pillar is roughly 4 light-years tall — about the distance from Earth to the nearest star outside our solar system.",
    "The gas and dust in this image weighs roughly 2,000 times the mass of our Sun.",
    "The newly forming stars inside these pillars are between 100,000 and 7 million years old — infants by cosmic standards."
  ],
  "nasaSource": "https://www.nasa.gov/...",
  "releaseDate": "2022-10-19"
}
Routing
/                   → Landing page
/explore            → Full destination grid
/destination/:id    → Viewer for a specific destination
/discoveries        → Live JWST feed
/about              → About page
Transition system
The landing-to-viewer transition is the signature interaction. When a user clicks a destination card, Framer Motion runs: the card scales up to fill the viewport (600ms, ease-in-out), followed by a fade to black (200ms), followed by the viewer fading in (300ms). Total: ~1.1 seconds. This should feel like entering, not navigating.

Narration system (MVP)
All narration is hand-written for the MVP. Each piece of writing follows a fixed structure:
Introduction (150–200 words): what is this thing, why does it matter, what does it feel like to be "looking" at it. Written in second person — "you're looking at..." Opens with a scale-establishing hook.
Hotspot descriptions (50–80 words each): triggered when the user clicks a highlighted region. Plain language, one interesting fact per hotspot, ends with a question that invites further curiosity.
Scale translations (1–2 sentences each): always anchored to something human-scale. The rule: never use a number without a comparison. "6,500 light-years" is meaningless; "6,500 light-years — if you could drive there at highway speed, it would take 70 billion years" is not.
Writing voice: Carl Sagan meets a really good museum audio guide. Warm, specific, never condescending, never dumbed down.

File structure
eschatia/
├── public/
│   └── destinations/
│       ├── smacs-0723.jpg
│       ├── pillars-of-creation.jpg
│       └── ...
├── src/
│   ├── components/
│   │   ├── Starfield.jsx          # procedural star canvas
│   │   ├── HorizonHero.jsx        # animated landing hero
│   │   ├── DestinationCard.jsx    # grid card component
│   │   ├── Viewer.jsx             # OpenSeadragon wrapper
│   │   ├── NarrationPanel.jsx     # sliding right panel
│   │   ├── HotspotOverlay.jsx     # SVG hotspot markers
│   │   ├── ScaleSidebar.jsx       # bottom-left scale widget
│   │   └── DiscoveriesFeed.jsx    # live API feed
│   ├── data/
│   │   └── destinations/
│   │       ├── smacs-0723.json
│   │       ├── pillars-of-creation.json
│   │       └── ...
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Explore.jsx
│   │   ├── Destination.jsx
│   │   ├── Discoveries.jsx
│   │   └── About.jsx
│   ├── hooks/
│   │   ├── useJWSTFeed.js         # fetches discoveries feed
│   │   └── useViewerState.js      # hotspot + narration state
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── api/
│   └── discoveries.js             # Vercel edge function proxy
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── README.md

Stardance shipping requirements
These are the non-negotiables for review approval and high voting scores, mapped to the four scoring categories.
Originality: the narrated, spatially-aware viewer with hotspot-triggered explanations and scale translations does not exist as an open-source tool. The combination is the differentiator — make sure the README leads with this.
Technicality: the project must demonstrate OpenSeadragon integration with custom hotspot overlay, live API data fetching, Framer Motion cinematic transitions, and responsive layout. Each of these should be visible in the demo.
Usability: the demo URL must work immediately with zero instructions. A user who has never heard of JWST should be able to land on the page, click a destination, and learn something real within 60 seconds.
Storytelling: devlogs posted throughout the build. Minimum one per week, ideally more during active build sprints. Each devlog shows a specific technical decision or a piece of narration being written and explains why it matters. The build story — "I tried to understand what JWST found and nothing explained it to me, so I built the thing I wanted to exist" — is the narrative spine.
README must include: what the project is, why it exists, a live demo link, a screenshot or GIF of the viewer in action, the data sources and attribution, and how to run it locally. This is the first thing Stardance reviewers and voters see.

Build timeline
Designed around burst-friendly work sessions, compatible with MIT BWSI and Stanford CNI-X schedules.
Week 1 (June 14–20): Project scaffold. Vite + React + Tailwind + Router setup. Starfield component. Landing page hero, stat strip, destination card grid with static data for 3 destinations. Deploy to Vercel. First devlog.
Week 2 (June 21–27): Viewer core. OpenSeadragon integrated and rendering the first destination image. Narration panel component (static content). Framer Motion transition from card click to viewer. Second devlog.
Week 3 (June 28 – July 4): Hotspot system. SVG overlay on viewer with 3 hotspots per destination wired to narration panel updates. Scale sidebar. All 10 destination JSON files written.
Week 4 (July 5–11): Discoveries feed. Vercel edge proxy to JWST API. Feed page rendering live data. All 10 destination images sourced from NASA public releases and optimized. Narration written for all 10 destinations.
Week 5 (July 12–18): Polish sprint. About page. Transition refinements. README written. Ship to Stardance. Third devlog. Demo video recorded.
Buffer (July 19 – Sept 30): Post-ship improvements. AI narration pipeline if time allows. Additional destinations. Show & Tell presentations for bonus stardust.

Open questions to resolve before building
One: image tiling. NASA's public release images for some destinations are very large (50–100MB TIFFs). OpenSeadragon works best with pre-tiled Deep Zoom Images (DZI format). Decision needed: either use the lower-resolution JPEG releases (simpler, faster) or run libvips or sharp to pre-tile the HD images (better zoom experience). Recommend starting with JPEG for MVP and upgrading to DZI in the post-ship buffer.
Two: hotspot coordinate system. Hotspot x/y values need to be expressed as fractions of image dimensions (0.0–1.0) so they scale correctly at any zoom level in OpenSeadragon. This needs testing early — get one destination fully working with hotspots before writing coordinates for all ten.
Three: narration writing. This is the most time-intensive part of the project and the hardest to parallelize with coding. Consider writing narration for 3 destinations first (enough to ship), then completing the remaining 7 during the post-ship buffer.
Four: domain. eschatia.space is the ideal domain and almost certainly available. Costs ~$12/year. Spend 40 stardust from the Stardance shop on the free domain grant to cover it.

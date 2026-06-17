# Eschatia

**The outermost frontier** — a narrated, interactive deep-zoom viewer for James Webb Space Telescope images.

Eschatia transforms publicly available JWST data into accessible journeys for curious non-scientists. Choose a cosmic destination, enter the full-screen viewer, and learn what you're actually looking at — no physics background required.

## Live demo

_Coming soon — deploying to eschatia.space_

## What makes this different

NASA's JWST data is publicly accessible but practically inaccessible. Existing tools are built for astronomers. Eschatia fills the gap: spatially-aware narration, clickable hotspots that explain specific features, and human-scale comparisons that make the numbers feel real.

## Features (MVP)

- 10 curated JWST destinations with hand-written narration
- Deep-zoom viewer powered by OpenSeadragon — pan and zoom at full resolution
- Clickable hotspot markers with per-region explanations
- Scale translations anchored to human-familiar distances and sizes
- Live JWST discoveries feed from jwstapi.com
- Cinematic landing-to-viewer transition via Framer Motion

## Tech stack

React 18 · Vite · React Router v6 · OpenSeadragon · Tailwind CSS · Framer Motion · Vercel

## Data sources

All images are NASA public release assets. Observational data sourced via [MAST](https://mast.stsci.edu/) and [jwstapi.com](https://jwstapi.com/). Credit: NASA, ESA, CSA, STScI.

## Run locally

```bash
npm install
cp .env.example .env.local  # add your JWST API key
npm run dev
```

## Built by

Sahaj Khandelwal — built for [Stardance](https://stardance.hackclub.com/)

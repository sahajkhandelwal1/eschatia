# Eschatia

A narrated, interactive deep-zoom explorer for James Webb Space Telescope imagery with 20 cosmic destinations and no astronomy background required.

![Eschatia — destination viewer](./docs/CleanShot%202026-06-23%20at%2015.39.26@2x.png)

![Eschatia — destination walkthrough](./docs/CleanShot%202026-06-23%20at%2015.43.58.gif)

## Try it

**[eschatia.vercel.app](https://eschatia.vercel.app)**


## Features

- **20 curated JWST destinations** — from the Pillars of Creation to Pandora's Cluster, each with hand-written narration and science context
- **Gigapixel deep-zoom viewer** — pan and zoom at full ESA Webb resolution (up to 14,500 px wide) via tiled streaming; no heavy download
- **Clickable hotspot markers** — 4 per destination, pinned to specific image features with per-region explanations
- **Human-scale comparisons** — the Scale sidebar anchors cosmic numbers to familiar distances ("the tallest pillar is 4 light-years — the same as the distance to our nearest star")
- **Cinematic drift mode** — one click drops any destination into a fullscreen ambient view with ambient drone audio, ideal for classroom projection
- **Live JWST discoveries feed** — raw observational data from the MAST archive, parsed by instrument and pipeline stage into readable cards

## Run locally

Requires Node 20+.

```bash
git clone https://github.com/sahajkhandelwal1/eschatia.git
cd eschatia
npm install
cp .env.example .env.local   # add your JWST API key (from jwstapi.com)
npm run dev                   # starts at http://localhost:5100
```

## How it works

**Tile streaming.** JWST images from the ESA Webb archive are served as Zoomify tile pyramids — thousands of small JPEG tiles arranged by zoom level. OpenSeadragon fetches only the tiles visible in the current viewport, so a 123-megapixel image loads at the speed of a thumbnail and sharpens as you zoom. No preprocessing required; the CDN URLs are referenced directly from each destination's JSON.

**Hotspot coordinate system.** Each hotspot stores normalized x/y coordinates (0.0–1.0 in image space). On render, these are converted to OSD viewport coordinates and injected as overlay elements that track the image regardless of zoom level, pan position, or viewport size. A proximity detection pass on canvas-click events (22 px radius) opens the detail modal — no DOM hit targets that would break at arbitrary zoom.

**Cinematic transition.** When a user clicks a destination card, its DOM bounding rect is captured and passed to a fullscreen overlay. Framer Motion animates the card's dimensions from that exact rect to 100vw × 100vh, creating the physical "expand to fill" feel, before React Router fires the navigation. The effect runs in ~900ms with no layout jank because the overlay is `position: fixed`, outside the document flow.

**Ambient audio.** Cinematic mode generates a drone soundtrack entirely via the Web Audio API — three sine oscillators at 55, 82.4, and 110 Hz (an open-fifth chord in the bass) with a 0.04 Hz LFO that breathes the master gain over a 25-second cycle. No audio files and no network request

## Credits

All images are NASA public release assets. Observational data sourced via [MAST](https://mast.stsci.edu/) and [jwstapi.com](https://jwstapi.com/).  
Image credit: NASA, ESA, CSA, STScI.

Built by Sahaj Khandelwal for [Stardance](https://stardance.hackclub.com/).

import { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { motion, AnimatePresence } from 'framer-motion';

const STYLE_ID = 'hotspot-pin-styles';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* Visual-only overlay — clicks handled by OSD canvas-click, not DOM */
    .hotspot-pin {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(212, 175, 55, 0.9);
      border: 2px solid #d4af37;
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
      position: relative;
      pointer-events: none;
    }
    .hotspot-pin::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid rgba(212, 175, 55, 0.45);
      animation: hpin-pulse 2s ease-out infinite;
    }
    .hotspot-pin::after {
      content: '';
      position: absolute;
      inset: -13px;
      border-radius: 50%;
      border: 1px solid rgba(212, 175, 55, 0.2);
      animation: hpin-pulse 2s ease-out infinite 0.65s;
    }
    @keyframes hpin-pulse {
      0%   { transform: scale(1); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export default function HotspotOverlay({ viewer, hotspots }) {
  const [active, setActive] = useState(null);
  const overlayEls = useRef([]);

  useEffect(() => {
    if (!viewer || !hotspots?.length) return;
    injectStyles();

    overlayEls.current.forEach(el => {
      try { viewer.removeOverlay(el); } catch (_) {}
    });
    overlayEls.current = [];

    // Visual-only pins — no click handlers on DOM elements
    hotspots.forEach(hotspot => {
      const el = document.createElement('div');
      el.className = 'hotspot-pin';

      viewer.addOverlay({
        element: el,
        location: new OpenSeadragon.Point(hotspot.x, hotspot.y),
        placement: OpenSeadragon.Placement.CENTER,
        checkResize: false,
      });

      overlayEls.current.push(el);
    });

    const nearHotspot = (pos) => {
      for (const hotspot of hotspots) {
        const pinPx = viewer.viewport.viewportToViewerElementCoordinates(
          new OpenSeadragon.Point(hotspot.x, hotspot.y)
        );
        const dx = pos.x - pinPx.x;
        const dy = pos.y - pinPx.y;
        if (Math.sqrt(dx * dx + dy * dy) < 22) return hotspot;
      }
      return null;
    };

    const handleCanvasMove = (event) => {
      viewer.canvas.style.cursor = nearHotspot(event.position) ? 'pointer' : '';
    };

    const handleCanvasClick = (event) => {
      const hit = nearHotspot(event.position);
      if (hit) {
        event.preventDefaultAction = true;
        setActive(hit);
      }
    };

    viewer.addHandler('canvas-move', handleCanvasMove);
    viewer.addHandler('canvas-click', handleCanvasClick);

    return () => {
      overlayEls.current.forEach(el => {
        try { viewer.removeOverlay(el); } catch (_) {}
      });
      overlayEls.current = [];
      viewer.canvas.style.cursor = '';
      viewer.removeHandler('canvas-move', handleCanvasMove);
      viewer.removeHandler('canvas-click', handleCanvasClick);
    };
  }, [viewer, hotspots]);

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
          />
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.93, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4"
          >
            <div className="bg-space-950 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/10">
                <div>
                  <p className="text-gold text-xs uppercase tracking-widest mb-1">Point of Interest</p>
                  <h2 className="text-white text-lg font-medium leading-snug">{active.label}</h2>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="text-white/40 hover:text-white transition-colors text-2xl leading-none mt-0.5 shrink-0"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-5">
                <p className="text-white/75 text-sm leading-relaxed">{active.description}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

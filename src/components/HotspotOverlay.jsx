import { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';

const STYLE_ID = 'hotspot-overlay-styles';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .hotspot-pin {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: rgba(212, 175, 55, 0.85);
      border: 2px solid rgba(212, 175, 55, 1);
      cursor: pointer;
      position: relative;
    }
    .hotspot-pin::before {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      border: 2px solid rgba(212, 175, 55, 0.5);
      animation: hotspot-pulse 2s ease-out infinite;
    }
    .hotspot-pin::after {
      content: '';
      position: absolute;
      inset: -11px;
      border-radius: 50%;
      border: 1px solid rgba(212, 175, 55, 0.2);
      animation: hotspot-pulse 2s ease-out infinite 0.6s;
    }
    @keyframes hotspot-pulse {
      0%   { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.9); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export default function HotspotOverlay({ viewer, hotspots, onHotspotClick }) {
  const [tooltip, setTooltip] = useState(null);
  const overlayEls = useRef([]);

  useEffect(() => {
    if (!viewer || !hotspots?.length) return;
    injectStyles();

    // Remove any overlays from a previous render
    overlayEls.current.forEach(el => {
      try { viewer.removeOverlay(el); } catch (_) {}
    });
    overlayEls.current = [];

    hotspots.forEach(hotspot => {
      const el = document.createElement('div');
      el.className = 'hotspot-pin';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onHotspotClick(hotspot);
      });

      el.addEventListener('mouseenter', () => {
        const rect = el.getBoundingClientRect();
        setTooltip({
          label: hotspot.label,
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      });

      el.addEventListener('mouseleave', () => setTooltip(null));

      viewer.addOverlay({
        element: el,
        location: new OpenSeadragon.Point(hotspot.x, hotspot.y),
        placement: OpenSeadragon.Placement.CENTER,
        checkResize: false,
      });

      overlayEls.current.push(el);
    });

    return () => {
      overlayEls.current.forEach(el => {
        try { viewer.removeOverlay(el); } catch (_) {}
      });
      overlayEls.current = [];
    };
  }, [viewer, hotspots]);

  if (!tooltip) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: tooltip.x,
        top: tooltip.y,
        transform: 'translate(-50%, calc(-100% - 8px))',
        pointerEvents: 'none',
        zIndex: 60,
      }}
      className="bg-space-950/95 border border-gold/30 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
    >
      {tooltip.label}
    </div>
  );
}

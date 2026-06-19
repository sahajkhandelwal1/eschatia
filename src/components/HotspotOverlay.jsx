import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HotspotOverlay({ hotspots }) {
  const [active, setActive] = useState(null);

  if (!hotspots?.length) return null;

  return (
    <>
      {/* Pins — positioned as % of the viewer container */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={() => setActive(hotspot)}
            style={{ left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
            aria-label={hotspot.label}
          >
            {/* Outer pulse ring */}
            <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
            {/* Core dot */}
            <span className="relative block w-3.5 h-3.5 rounded-full bg-gold border-2 border-gold/80 shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:scale-125 transition-transform duration-150" />
            {/* Hover label */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-space-950/95 border border-gold/20 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {hotspot.label}
            </span>
          </button>
        ))}
      </div>

      {/* Popup modal */}
      <AnimatePresence>
        {active && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Card */}
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4"
            >
              <div className="bg-space-950 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-gold text-xs uppercase tracking-widest mb-1">Point of Interest</p>
                    <h2 className="text-white text-lg font-medium leading-snug">{active.label}</h2>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="text-white/40 hover:text-white transition-colors text-xl leading-none mt-0.5 shrink-0"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <p className="text-white/75 text-sm leading-relaxed">{active.description}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

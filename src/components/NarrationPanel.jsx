import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NarrationPanel({ destination }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.6 }}
      className="fixed right-0 top-0 bottom-0 z-20 flex"
    >
      {/* Chevron toggle strip */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center w-10 h-full bg-space-950/70 border-l border-white/10 hover:bg-space-900/80 transition-colors"
        aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <span className="text-white/60 text-xs select-none">
          {collapsed ? '‹' : '›'}
        </span>
      </button>

      {!collapsed && (
        <div className="w-72 bg-space-950/90 backdrop-blur-sm border-l border-white/10 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <p className="text-gold text-xs uppercase tracking-widest">
              {destination.name}
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              {destination.introduction}
            </p>
            {destination.hotspots?.length > 0 && (
              <div className="pt-1">
                <p className="text-white/35 text-xs uppercase tracking-widest mb-2">
                  Points of Interest
                </p>
                <ul className="space-y-1">
                  {destination.hotspots.map((hotspot) => (
                    <li key={hotspot.id} className="text-white/55 text-xs flex items-center gap-2">
                      <span className="text-gold/70">·</span>
                      {hotspot.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Ctx = createContext({ triggerFade: (cb) => cb() });

export function usePageTransition() {
  return useContext(Ctx);
}

export function PageTransitionProvider({ children }) {
  const [fading, setFading] = useState(false);

  // Fades to black at app level, calls cb() mid-fade, then fades back out
  // after the new page has had time to render underneath.
  const triggerFade = useCallback((cb) => {
    setFading(true);
    setTimeout(cb, 360);           // navigate while overlay is fully black
    setTimeout(() => setFading(false), 750); // start fade-out after swap settles
  }, []);

  return (
    <Ctx.Provider value={{ triggerFade }}>
      {children}
      <AnimatePresence>
        {fading && (
          <motion.div
            key="page-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            style={{
              position: 'fixed', inset: 0,
              background: '#000',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

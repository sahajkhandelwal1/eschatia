import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicOverlay({ transition, blackOverlay }) {
  return (
    <AnimatePresence>
      {transition && (
        <>
          <motion.div
            key="expanding-card"
            initial={{
              top: transition.rect.top,
              left: transition.rect.left,
              width: transition.rect.width,
              height: transition.rect.height,
              borderRadius: 8,
              zIndex: 9998,
              overflow: 'hidden',
            }}
            animate={{ top: 0, left: 0, width: '100vw', height: '100vh', borderRadius: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'fixed' }}
          >
            <img
              src={transition.image}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(4,4,8,0.95) 0%, rgba(4,4,8,0.3) 40%, transparent 100%)',
            }} />
          </motion.div>

          <motion.div
            key="black-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: blackOverlay ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999, pointerEvents: 'none' }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function startAmbientAudio() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    // Fade in over 4 seconds so it isn't jarring
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4);
    master.connect(ctx.destination);

    // Three sine drones: A1, E2, A2 — an open fifth chord in the bass
    [[55, 0.5], [82.4, 0.3], [110, 0.2]].forEach(([freq, weight]) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = weight;
      osc.connect(g);
      g.connect(master);
      osc.start();
    });

    // Slow LFO on master gain — one breath every ~25 seconds
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04;
    const lfoAmt = ctx.createGain();
    lfoAmt.gain.value = 0.018;
    lfo.connect(lfoAmt);
    lfoAmt.connect(master.gain);
    lfo.start();

    return ctx;
  } catch {
    return null;
  }
}

const SHUFFLE_INTERVAL_MS = 15_000;

export default function AmbientMode({ destination, onExit, onNext }) {
  const audioCtxRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const hintTimer = useRef(null);

  // Hint fades out after 5s, reappears on mouse move
  const resetHint = useCallback(() => {
    setHintVisible(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHintVisible(false), 5000);
  }, []);

  useEffect(() => {
    resetHint();
    window.addEventListener('mousemove', resetHint);
    return () => {
      clearTimeout(hintTimer.current);
      window.removeEventListener('mousemove', resetHint);
    };
  }, [resetHint]);

  // Escape to exit
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onExit(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onExit]);

  // Shuffle to next destination after SHUFFLE_INTERVAL_MS
  useEffect(() => {
    if (!onNext) return;
    const t = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onNext, 800);
    }, SHUFFLE_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [onNext]);

  // Ambient audio — created on mount (which is inside a user gesture)
  useEffect(() => {
    const ctx = startAmbientAudio();
    audioCtxRef.current = ctx;
    return () => ctx?.close();
  }, []);

  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (muted) ctx.suspend(); else ctx.resume();
  }, [muted]);

  return (
    <div
      className="fixed inset-0 z-50 cursor-none"
      onClick={onExit}
    >
      {/* Full-screen image — plain img, no OSD dependency */}
      <img
        src={destination.image}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Fade-to-black on shuffle transition */}
      <AnimatePresence>
        {fadingOut && (
          <motion.div
            key="fadeout"
            className="absolute inset-0 bg-black z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
      {/* Bottom-left: persistent destination label for classroom projection */}
      <div className="absolute bottom-8 left-8 pointer-events-none select-none">
        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1 font-light">
          {destination.type}&nbsp;·&nbsp;{destination.distance}
        </p>
        <p className="text-white/75 text-2xl md:text-3xl font-light tracking-wide">
          {destination.name}
        </p>
        <p className="text-white/30 text-[10px] mt-1 uppercase tracking-widest">
          James Webb Space Telescope · eschatia
        </p>
      </div>

      {/* Top-right: hint + mute toggle */}
      <div
        className="absolute top-6 right-6 flex items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence>
          {hintVisible && (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/20 text-[10px] uppercase tracking-widest cursor-default"
            >
              {onNext ? 'Drifting · Esc to exit' : 'Esc · click anywhere to exit'}
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMuted((m) => !m)}
          title={muted ? 'Unmute ambient audio' : 'Mute ambient audio'}
          className="text-white/20 hover:text-white/50 transition-colors duration-300 text-xs uppercase tracking-widest cursor-pointer"
        >
          {muted ? 'audio off' : 'audio on'}
        </button>
      </div>
    </div>
  );
}

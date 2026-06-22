import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HorizonHero({ onRandom }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="text-white font-light italic whitespace-nowrap"
          style={{ fontSize: 'clamp(6rem, 22vw, 22rem)', opacity: 0.025, letterSpacing: '-0.02em' }}
        >
          ἐσχατιά
        </span>
      </div>

      {/* Horizon glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-16 bg-gold/5 blur-2xl pointer-events-none" />

      {/* Eyebrow */}
      <motion.p
        className="text-gold text-xs uppercase tracking-ultra-wide font-medium mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        James Webb Space Telescope
      </motion.p>

      {/* Site name */}
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-widest uppercase mb-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.25}
      >
        Eschatia
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-white/40 text-sm md:text-base uppercase tracking-widest mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        The outermost frontier
      </motion.p>

      {/* Tagline */}
      <motion.p
        className="text-white/70 text-base md:text-lg max-w-md mb-10 font-light leading-relaxed"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.55}
      >
        Narrated journeys through the universe's most astonishing imagery.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="flex flex-col items-center gap-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.7}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/explore"
            className="px-8 py-3 bg-gold text-space-950 text-sm uppercase tracking-widest font-medium rounded hover:bg-gold-light transition-colors duration-200"
          >
            Begin the journey
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 border border-white/20 text-white/70 text-sm uppercase tracking-widest font-medium rounded hover:border-white/40 hover:text-white transition-colors duration-200"
          >
            What is this?
          </Link>
        </div>

        {onRandom && (
          <button
            onClick={onRandom}
            className="group flex items-center gap-2 text-white/35 text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300 mt-1"
          >
            <span
              className="inline-block transition-transform duration-500 group-hover:rotate-180"
              aria-hidden="true"
            >
              ✦
            </span>
            Take me anywhere
          </button>
        )}
      </motion.div>

      {/* Scroll indicator — placeholder line kept for layout */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 text-white/30"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1.0}
      >
        <span className="text-xs uppercase tracking-widest"></span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}

HorizonHero.propTypes = {
  onRandom: PropTypes.func,
};

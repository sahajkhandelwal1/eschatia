import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';
import HorizonHero from '../components/HorizonHero';
import DestinationCard from '../components/DestinationCard';
import CinematicOverlay from '../components/CinematicOverlay';
import { useCinematicTransition } from '../hooks/useCinematicTransition';
import pillars from '../data/destinations/pillars-of-creation.json';
import smacs from '../data/destinations/smacs-0723.json';
import carina from '../data/destinations/carina-nebula.json';

const FEATURED = [pillars, smacs, carina];

const STATS = [
  { value: '13.8B', label: 'years of lookback time' },
  { value: '6,200+', label: 'JWST observations' },
  { value: '0', label: 'prerequisites' },
];

export default function Landing() {
  const { cardRefs, transition, blackOverlay, handleEnter } = useCinematicTransition();

  return (
    <div className="relative min-h-screen bg-space-950 text-white overflow-x-hidden">
      <Starfield />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" className="text-white/90 text-base font-light italic tracking-wide hover:text-gold transition-colors">ἐσχατιά</Link>
        <div className="flex items-center gap-6 text-white/50 text-xs uppercase tracking-widest">
          <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link to="/discoveries" className="hover:text-white transition-colors">Discoveries</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link
            to="/explore"
            className="px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 transition-colors rounded text-xs"
          >
            Enter
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <HorizonHero />

      {/* Stat strip */}
      <motion.div
        className="relative z-10 border-y border-white/10 py-6 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 text-center sm:text-left">
              {i > 0 && <span className="hidden sm:block text-white/20 text-xl">·</span>}
              <div>
                <span className="text-gold font-medium text-lg">{stat.value}</span>
                <span className="text-white/40 text-sm ml-2">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Featured destinations */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-2">Featured destinations</p>
          <h2 className="text-2xl md:text-3xl font-light text-white">
            Choose where you want to go
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED.map((dest, i) => (
            <motion.div
              key={dest.id}
              ref={(el) => { if (el) cardRefs.current[dest.id] = el; }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <DestinationCard destination={dest} onEnter={(id) => handleEnter(id, dest.image)} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/explore"
            className="text-white/40 text-sm uppercase tracking-widest hover:text-gold transition-colors"
          >
            See all 20 destinations →
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center">
        <p className="text-white/30 text-xs mb-2">
          <span className="text-gold/60 italic">ἐσχατιά</span>
          {' '}(eschatia) — the outermost edge of the known world; the farthest boundary of Greek territory
        </p>
        <p className="text-white/20 text-xs">
          Image credit: NASA, ESA, CSA, STScI · Data via MAST / jwstapi.com
        </p>
      </footer>

      <CinematicOverlay transition={transition} blackOverlay={blackOverlay} />
    </div>
  );
}

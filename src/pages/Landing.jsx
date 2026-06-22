import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import StarfieldCanvas from '../components/StarfieldCanvas';
import HorizonHero from '../components/HorizonHero';
import DestinationCard from '../components/DestinationCard';
import CinematicOverlay from '../components/CinematicOverlay';
import { useCinematicTransition } from '../hooks/useCinematicTransition';

import carinaNebula from '../data/destinations/carina-nebula.json';
import cartwheelGalaxy from '../data/destinations/cartwheel-galaxy.json';
import crabNebula from '../data/destinations/crab-nebula.json';
import herbigHaro211 from '../data/destinations/herbig-haro-211.json';
import ic1623 from '../data/destinations/ic-1623.json';
import jupiter from '../data/destinations/jupiter.json';
import l1527 from '../data/destinations/l1527.json';
import neptuneRings from '../data/destinations/neptune-rings.json';
import ngc346 from '../data/destinations/ngc-346.json';
import ngc7469 from '../data/destinations/ngc-7469.json';
import orionNebula from '../data/destinations/orion-nebula.json';
import phantomGalaxy from '../data/destinations/phantom-galaxy.json';
import pillarsOfCreation from '../data/destinations/pillars-of-creation.json';
import ringNebula from '../data/destinations/ring-nebula.json';
import smacs0723 from '../data/destinations/smacs-0723.json';
import southernRingNebula from '../data/destinations/southern-ring-nebula.json';
import stephansQuintet from '../data/destinations/stephans-quintet.json';
import tarantulaNebula from '../data/destinations/tarantula-nebula.json';
import pandorasCluster from '../data/destinations/pandoras-cluster.json';
import wolfRayet124 from '../data/destinations/wolf-rayet-124.json';

const ALL_DESTINATIONS = [
  pillarsOfCreation, ringNebula, crabNebula, tarantulaNebula, l1527,
  smacs0723, carinaNebula, wolfRayet124, stephansQuintet, herbigHaro211,
  southernRingNebula, jupiter, cartwheelGalaxy, ngc346, ngc7469,
  neptuneRings, ic1623, phantomGalaxy, orionNebula, pandorasCluster,
];

const STATS = [
  { value: '13.8B', label: 'years of lookback time' },
  { value: '6,200+', label: 'JWST observations' },
  { value: '0', label: 'prerequisites' },
];

export default function Landing() {
  const { cardRefs, transition, blackOverlay, handleEnter } = useCinematicTransition();
  const carouselRef = useRef(null);

  const handleRandom = useCallback(() => {
    const dest = ALL_DESTINATIONS[Math.floor(Math.random() * ALL_DESTINATIONS.length)];
    handleEnter(dest.id, dest.image);
  }, [handleEnter]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  function scrollCarousel(dir) {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const cardWidth = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  }

  return (
    <div className="relative min-h-screen bg-space-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true"><StarfieldCanvas /></div>

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
      <HorizonHero onRandom={handleRandom} />

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

      {/* Featured destinations carousel */}
      <section className="relative z-10 py-20">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 max-w-6xl mx-auto flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-gold text-xs uppercase tracking-widest mb-2">Featured destinations</p>
            <h2 className="text-2xl md:text-3xl font-light text-white">Choose where you want to go</h2>
          </div>

          {/* Arrow controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCarousel(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold/50 hover:text-gold transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={() => scrollCarousel(1)}
              disabled={!canScrollRight}
              aria-label="Next"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold/50 hover:text-gold transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </motion.div>

        {/* Scrollable track */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-6 pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {ALL_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              data-card
              ref={(el) => { if (el) cardRefs.current[dest.id] = el; }}
              className="flex-none w-[78vw] sm:w-[42vw] lg:w-[30vw] max-w-sm"
              style={{ scrollSnapAlign: 'start' }}
            >
              <DestinationCard destination={dest} onEnter={(id) => handleEnter(id, dest.image)} />
            </div>
          ))}

          {/* Trailing padding so last card doesn't sit flush against edge */}
          <div className="flex-none w-4" aria-hidden="true" />
        </motion.div>

        {/* See all link */}
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

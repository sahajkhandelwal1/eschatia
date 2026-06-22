import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Starfield from '../components/Starfield';
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
  pillarsOfCreation,
  smacs0723,
  carinaNebula,
  tarantulaNebula,
  stephansQuintet,
  southernRingNebula,
  cartwheelGalaxy,
  neptuneRings,
  phantomGalaxy,
  pandorasCluster,
  crabNebula,
  ringNebula,
  wolfRayet124,
  ngc346,
  jupiter,
  ic1623,
  herbigHaro211,
  ngc7469,
  orionNebula,
  l1527,
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Explore() {
  const { cardRefs, transition, blackOverlay, handleEnter } = useCinematicTransition();

  return (
    <div className="relative min-h-screen bg-space-950 text-white overflow-x-hidden">
      <Starfield />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <Link
          to="/"
          className="text-white/90 text-base font-light italic tracking-wide hover:text-gold transition-colors"
        >
          ἐσχατιά
        </Link>
        <div className="flex items-center gap-6 text-white/50 text-xs uppercase tracking-widest">
          <Link to="/discoveries" className="hover:text-white transition-colors">Discoveries</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pt-8 pb-12"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-3">All destinations</p>
          <h1 className="text-3xl md:text-4xl font-light text-white">
            Where do you want to go?
          </h1>
          <p className="text-white/40 text-sm mt-3 max-w-md">
            Twenty narrated journeys through the universe's most astonishing Webb imagery.
            Each one a different chapter of cosmic history.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.id}
              ref={(el) => { if (el) cardRefs.current[dest.id] = el; }}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <DestinationCard destination={dest} onEnter={(id) => handleEnter(id, dest.image)} />
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center">
        <p className="text-white/20 text-xs">
          Image credit: NASA, ESA, CSA, STScI · Data via MAST / jwstapi.com
        </p>
      </footer>

      <CinematicOverlay transition={transition} blackOverlay={blackOverlay} />
    </div>
  );
}

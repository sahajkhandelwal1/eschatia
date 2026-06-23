import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useCallback, useRef } from 'react';

import Viewer from '../components/Viewer';
import NarrationPanel from '../components/NarrationPanel';
import HotspotOverlay from '../components/HotspotOverlay';
import ScaleSidebar from '../components/ScaleSidebar';
import AmbientMode from '../components/AmbientMode';

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

const DESTINATIONS = {
  'carina-nebula': carinaNebula,
  'cartwheel-galaxy': cartwheelGalaxy,
  'crab-nebula': crabNebula,
  'herbig-haro-211': herbigHaro211,
  'ic-1623': ic1623,
  'jupiter': jupiter,
  'l1527': l1527,
  'neptune-rings': neptuneRings,
  'ngc-346': ngc346,
  'ngc-7469': ngc7469,
  'orion-nebula': orionNebula,
  'phantom-galaxy': phantomGalaxy,
  'pillars-of-creation': pillarsOfCreation,
  'ring-nebula': ringNebula,
  'smacs-0723': smacs0723,
  'southern-ring-nebula': southernRingNebula,
  'stephans-quintet': stephansQuintet,
  'tarantula-nebula': tarantulaNebula,
  'pandoras-cluster': pandorasCluster,
  'wolf-rayet-124': wolfRayet124,
};

const DESTINATION_IDS = Object.keys(DESTINATIONS);

export default function Destination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: routeState } = useLocation();
  const destination = DESTINATIONS[id];
  const [viewer, setViewer] = useState(null);
  const [ambientMode, setAmbientMode] = useState(() => routeState?.cinematic === true);

  const isShuffle = routeState?.shuffle === true;
  const exitedAmbient = useRef(false);

  const navTo = (path) => navigate(path);
  const exitAmbient = useCallback(() => {
    exitedAmbient.current = true;
    setAmbientMode(false);
  }, []);

  const handleShuffleNext = useCallback(() => {
    const others = DESTINATION_IDS.filter((d) => d !== id);
    const nextId = others[Math.floor(Math.random() * others.length)];
    navigate(`/destination/${nextId}`, {
      state: { cinematic: true, shuffle: true },
    });
  }, [id, navigate]);

  if (!destination) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-space-950 text-white gap-4">
        <p className="text-white/60 text-lg">Destination not found.</p>
        <Link
          to="/"
          className="text-gold text-sm uppercase tracking-widest hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950">
      {/* Full-screen viewer */}
      <div className="absolute inset-0">
        <Viewer
          imageUrl={destination.image}
          tileSource={destination.tileSource || null}
          onViewerReady={setViewer}
        />
      </div>

      {!ambientMode && <HotspotOverlay viewer={viewer} hotspots={destination.hotspots} />}

      {/* Top bar */}
      {!ambientMode && (
        <motion.div
          initial={exitedAmbient.current ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: exitedAmbient.current ? 0 : 0.6 }}
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-space-950/80 to-transparent"
        >
          {/* Back button */}
          <button
            onClick={() => navTo('/explore')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <span className="text-sm group-hover:-translate-x-0.5 transition-transform">←</span>
            <span className="text-xs uppercase tracking-widest">All destinations</span>
          </button>

          {/* Destination name + distance */}
          <div className="flex flex-col items-center">
            <span className="text-white text-sm font-medium leading-tight">{destination.name}</span>
            <span className="text-white/40 text-xs">{destination.distance}</span>
          </div>

          {/* Right side: home */}
          <div className="flex items-center">
            <button
              onClick={() => navTo('/')}
              className="text-white/60 hover:text-gold transition-colors"
              aria-label="Home"
            >
              <span className="italic font-light text-sm">ἐσχατιά</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Cinematic mode trigger — bottom-center, above both sidebars, clear of NarrationPanel */}
      {!ambientMode && (
        <motion.button
          initial={exitedAmbient.current ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: exitedAmbient.current ? 0 : 1.0 }}
          onClick={() => setAmbientMode(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-space-950/70 border border-white/20 backdrop-blur-sm text-white/60 hover:text-gold hover:border-gold/50 transition-all text-[10px] uppercase tracking-widest group"
          title="Enter cinematic / screensaver mode"
        >
          <span className="text-base leading-none group-hover:scale-110 transition-transform">✦</span>
          Cinematic
        </motion.button>
      )}

      {!ambientMode && <NarrationPanel destination={destination} skipDelay={exitedAmbient.current} />}
      {!ambientMode && <ScaleSidebar scaleTranslations={destination.scaleTranslations} skipDelay={exitedAmbient.current} />}

      {ambientMode && (
        <AmbientMode
          destination={destination}
          onExit={exitAmbient}
          onNext={isShuffle ? handleShuffleNext : undefined}
        />
      )}
    </div>
  );
}

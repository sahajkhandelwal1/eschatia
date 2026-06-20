import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

import Viewer from '../components/Viewer';
import NarrationPanel from '../components/NarrationPanel';
import HotspotOverlay from '../components/HotspotOverlay';
import ScaleSidebar from '../components/ScaleSidebar';

import carinaNebula from '../data/destinations/carina-nebula.json';
import cartwheelGalaxy from '../data/destinations/cartwheel-galaxy.json';
import neptuneRings from '../data/destinations/neptune-rings.json';
import phantomGalaxy from '../data/destinations/phantom-galaxy.json';
import pillarsOfCreation from '../data/destinations/pillars-of-creation.json';
import smacs0723 from '../data/destinations/smacs-0723.json';
import southernRingNebula from '../data/destinations/southern-ring-nebula.json';
import stephansQuintet from '../data/destinations/stephans-quintet.json';
import tarantulaNebula from '../data/destinations/tarantula-nebula.json';
import webbsFirstDeepField from '../data/destinations/webbs-first-deep-field.json';

const DESTINATIONS = {
  'carina-nebula': carinaNebula,
  'cartwheel-galaxy': cartwheelGalaxy,
  'neptune-rings': neptuneRings,
  'phantom-galaxy': phantomGalaxy,
  'pillars-of-creation': pillarsOfCreation,
  'smacs-0723': smacs0723,
  'southern-ring-nebula': southernRingNebula,
  'stephans-quintet': stephansQuintet,
  'tarantula-nebula': tarantulaNebula,
  'webbs-first-deep-field': webbsFirstDeepField,
};

export default function Destination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = DESTINATIONS[id];
  const [viewer, setViewer] = useState(null);

  const navTo = (path) => navigate(path);

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

      <HotspotOverlay viewer={viewer} hotspots={destination.hotspots} />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-space-950/80 to-transparent"
      >
        {/* Back button — always goes to explore */}
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

        {/* ἐσχατιά — always goes home */}
        <button
          onClick={() => navTo('/')}
          className="text-white/60 hover:text-gold transition-colors"
          aria-label="Home"
        >
          <span className="italic font-light text-sm">ἐσχατιά</span>
        </button>
      </motion.div>

      <NarrationPanel destination={destination} />
      <ScaleSidebar scaleTranslations={destination.scaleTranslations} />
    </div>
  );
}

// Live JWST data feed — latest science observations from the James Webb Space Telescope
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Starfield from '../components/Starfield';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

// Maps JWST pipeline file suffixes to plain-English descriptions
const SUFFIX_LABELS = {
  '_thumb':  'Science image',
  '_cal':    'Calibrated exposure',
  '_crf':    'Cosmic-ray cleaned image',
  '_i2d':    'Fully processed mosaic',
  '_s2d':    'Spectral image',
  '_x1d':    'Extracted spectrum',
  '_c1d':    'Combined spectrum',
  '_cat':    'Source catalog',
};

// Plain-English descriptions for the most common JWST pipeline stages
const SUFFIX_EXPLAINERS = {
  '_thumb':  'A calibrated science frame — one of thousands of individual exposures JWST collects every week.',
  '_cal':    'A fully calibrated 2D exposure. Raw counts have been corrected for detector artifacts and converted to physical brightness units.',
  '_crf':    'A calibrated exposure with cosmic rays removed. High-energy particles hit the detector mid-exposure and are flagged out, leaving only real signal.',
  '_i2d':    'Multiple exposures combined and mapped onto a single image grid — the "final" picture from this observing sequence.',
  '_s2d':    'A 2D spectrum: light spread by wavelength across one axis and space across the other, used to measure what molecules or elements are present.',
  '_x1d':    'A 1D spectrum — the brightness of a source measured at every wavelength, like a barcode that reveals chemical composition.',
};

// Parses which JWST instrument took the observation from the observation ID
function parseInstrument(observationId) {
  if (!observationId) return null;
  const id = observationId.toLowerCase();
  if (id.includes('nrcalong') || id.includes('nrca') || id.includes('nrcb')) return 'NIRCam';
  if (id.includes('mirimage') || id.includes('mirifushort') || id.includes('mirifulong')) return 'MIRI';
  if (id.includes('niriss')) return 'NIRISS';
  if (id.includes('nirspec') || id.includes('nrs1') || id.includes('nrs2')) return 'NIRSpec';
  if (id.includes('fgs')) return 'Fine Guidance Sensor';
  return null;
}

// Short names for each instrument
const INSTRUMENT_FULL = {
  'NIRCam':  'Near Infrared Camera — detects light from early galaxies and star-forming regions',
  'MIRI':    'Mid-Infrared Instrument — sees through dust clouds to reveal hidden stars and planets',
  'NIRISS':  'Near Infrared Imager and Slitless Spectrograph — studies exoplanet atmospheres and distant galaxies',
  'NIRSpec': 'Near Infrared Spectrograph — simultaneously measures the spectra of up to 100 objects',
  'Fine Guidance Sensor': 'Keeps the telescope locked on its target with milliarcsecond precision',
};

function getSuffix(item) {
  const suffix = item.details?.suffix ?? '';
  // Match the longest suffix that appears in our table
  return Object.keys(SUFFIX_LABELS).find(s => suffix === s || suffix.endsWith(s)) ?? null;
}

function SkeletonCard({ index }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0.1 + index * 0.05}
      className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]"
    >
      <div className="w-full aspect-video bg-white/[0.04] animate-pulse" />
      <div className="p-5">
        <div className="flex gap-2 mb-3">
          <div className="h-4 w-16 rounded bg-white/[0.06] animate-pulse" />
          <div className="h-4 w-24 rounded bg-white/[0.04] animate-pulse" />
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-3 w-full rounded bg-white/[0.04] animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-white/[0.04] animate-pulse" />
          <div className="h-3 w-4/6 rounded bg-white/[0.04] animate-pulse" />
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
          <div className="h-3 w-20 rounded bg-white/[0.04] animate-pulse" />
          <div className="h-3 w-32 rounded bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

function ObservationCard({ item, index }) {
  const instrument = parseInstrument(item.observation_id);
  const suffix = getSuffix(item);
  const label = suffix ? SUFFIX_LABELS[suffix] : 'Science observation';
  const explainer = suffix ? SUFFIX_EXPLAINERS[suffix] : null;
  const image = item.location ?? null;
  const mastUrl = `https://mast.stsci.edu/search/ui/#/jwst/results?program_id=${item.program}`;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0.1 + index * 0.05}
      className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-200"
    >
      {/* Image */}
      {image && (
        <div className="w-full aspect-video bg-black overflow-hidden">
          <img
            src={image}
            alt={label}
            className="w-full h-full object-contain opacity-90"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {instrument && (
            <span
              className="text-gold text-[10px] uppercase tracking-widest border border-gold/30 rounded px-2 py-0.5"
              title={INSTRUMENT_FULL[instrument]}
            >
              {instrument}
            </span>
          )}
          <span className="text-white/40 text-[10px] uppercase tracking-widest border border-white/10 rounded px-2 py-0.5">
            {label}
          </span>
        </div>

        {/* Human-friendly explanation */}
        {explainer && (
          <p className="text-white/70 text-sm leading-relaxed mb-3">{explainer}</p>
        )}

        {/* Program + observation meta */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-white/30 text-xs">Program</span>
            <a
              href={mastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/70 text-xs hover:text-gold transition-colors font-mono"
            >
              #{item.program}
            </a>
          </div>
          <span className="text-white/20 text-[10px] font-mono truncate max-w-[180px]" title={item.observation_id}>
            {item.observation_id?.slice(0, 24)}…
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Discoveries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/discoveries')
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not reach the telescope. Try again later.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-space-950 text-white overflow-x-hidden">
      <Starfield />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" className="text-white/90 text-base font-light italic tracking-wide hover:text-gold transition-colors">
          ἐσχατιά
        </Link>
        <div className="flex items-center gap-6 text-white/50 text-xs uppercase tracking-widest">
          <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.0}
          className="mb-14 pb-14 border-b border-white/10"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-5">Live feed</p>
          <h1 className="text-5xl md:text-6xl font-light italic text-white mb-6">Discoveries</h1>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl">
            Every few hours, JWST downlinks fresh data to Earth. What you see below are the latest
            science images straight from the telescope — unfiltered, unedited, just calibrated
            and released to the public archive. Each frame is a real observation from an active
            research program, taken minutes to hours before it appears here.
          </p>
        </motion.div>

        {/* Explainer callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="mb-12 p-5 border border-white/10 rounded-lg bg-white/[0.02]"
        >
          <p className="text-gold text-[10px] uppercase tracking-widest mb-2">What you're looking at</p>
          <p className="text-white/50 text-sm leading-relaxed">
            These are not press-release images — those take weeks of color processing by image specialists.
            These are raw calibrated frames: the real scientific product. They look like this because
            JWST captures infrared light, which is invisible to our eyes. Scientists use these to
            measure distances, temperatures, chemical compositions, and the motion of distant objects.
            Each one clicked will open the full archive record on STScI's MAST portal.
          </p>
        </motion.div>

        {/* Skeleton grid while loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-white/50 text-sm leading-relaxed"
          >
            {error}
          </motion.p>
        )}

        {!loading && !error && entries.length === 0 && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-white/40 text-sm"
          >
            No observations returned.
          </motion.p>
        )}

        {/* Grid */}
        {!loading && !error && entries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {entries.map((entry, i) => (
              <ObservationCard key={entry.id ?? i} item={entry} index={i} />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center">
        <p className="text-white/20 text-xs">
          Image credit: NASA, ESA, CSA, STScI · Data via MAST / jwstapi.com
        </p>
      </footer>
    </div>
  );
}

// Live JWST data feed page — reverse-chronological releases from jwstapi.com
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

function EntryCard({ entry, index }) {
  const description =
    entry.details?.[0]?.description ?? entry.mission ?? 'No description available.';
  const fileType = entry.file_type ?? null;
  const thumbnail = entry.thumbnail ?? null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0.1 + index * 0.06}
      className="flex gap-4 border border-white/10 rounded-lg p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-200"
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt=""
          className="w-20 h-20 object-cover rounded flex-shrink-0 opacity-80"
          loading="lazy"
        />
      )}
      <div className="flex-1 min-w-0">
        {fileType && (
          <span className="inline-block text-gold text-[10px] uppercase tracking-widest border border-gold/30 rounded px-2 py-0.5 mb-2">
            {fileType}
          </span>
        )}
        <p className="text-white/80 text-sm leading-relaxed line-clamp-4">{description}</p>
        {entry.mission && (
          <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">{entry.mission}</p>
        )}
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
      .then((data) => {
        // API returns an array; reverse so newest is first
        const list = Array.isArray(data) ? [...data].reverse() : [];
        setEntries(list);
      })
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

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-20">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.0}
          className="mb-14 pb-14 border-b border-white/10"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-5">Live feed</p>
          <h1 className="text-5xl md:text-6xl font-light italic text-white mb-4">Discoveries</h1>
          <p className="text-white/50 text-sm uppercase tracking-widest">
            Live feed from the James Webb Space Telescope
          </p>
        </motion.div>

        {/* Body */}
        {loading && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-white/40 text-sm uppercase tracking-widest"
          >
            Scanning the cosmos…
          </motion.p>
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
            No entries returned by the telescope.
          </motion.p>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="flex flex-col gap-4">
            {entries.map((entry, i) => (
              <EntryCard key={entry.id ?? i} entry={entry} index={i} />
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

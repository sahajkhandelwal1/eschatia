import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  return (
    <div className="relative min-h-screen bg-space-950 text-white overflow-x-hidden">
      <Starfield />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" className="text-white text-sm uppercase tracking-widest font-medium hover:text-gold transition-colors">
          Eschatia
        </Link>
        <div className="flex items-center gap-6 text-white/50 text-xs uppercase tracking-widest">
          <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link to="/discoveries" className="hover:text-white transition-colors">Discoveries</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-20">

        {/* Etymology */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="mb-16 pb-16 border-b border-white/10"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-6">Etymology</p>
          <p className="text-4xl md:text-5xl font-light text-white mb-3 italic">ἐσχατιά</p>
          <p className="text-white/40 text-sm uppercase tracking-widest mb-6">
            eschatia · Ancient Greek
          </p>
          <p className="text-white/70 text-base leading-relaxed">
            The outermost edge of the known world. The farthest boundary of Greek territory —
            beyond which lay the unmapped, the unknown, the vast dark that no one had yet named.
            The word carried both terror and invitation.
          </p>
        </motion.div>

        {/* What is JWST */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="mb-12"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-4">What is JWST?</p>
          <p className="text-white/80 text-base leading-relaxed">
            The James Webb Space Telescope is the most powerful observatory humanity has ever
            built. Launched on Christmas Day 2021 and positioned 1.5 million kilometers from
            Earth, it observes the universe in infrared light — wavelengths invisible to the
            human eye but capable of piercing the dust clouds that hide newborn stars, and
            stretching back far enough in cosmic time to see the first galaxies that formed
            after the Big Bang. Its mirror spans 6.5 meters, folded like origami to fit inside
            a rocket and unfolded in the cold of space.
          </p>
        </motion.div>

        {/* Why the data is remarkable */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mb-12"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-4">Why this data is different</p>
          <p className="text-white/80 text-base leading-relaxed">
            Every image JWST releases is a primary scientific document — raw light from objects
            billions of light-years away, encoded as data and then translated into color by
            astronomers at STScI. When you look at a Webb image, you are looking at actual
            photons that left their source before Earth existed. The telescope has revealed
            stars forming inside dust pillars that Hubble couldn't see through, galaxies
            colliding in slow motion across hundreds of millions of years, and light from the
            universe's first 500 million years. None of this required interpretation or
            artistic license — the universe really looks like this.
          </p>
        </motion.div>

        {/* Why Eschatia exists */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.55}
          className="mb-16 pb-16 border-b border-white/10"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-4">Why this exists</p>
          <p className="text-white/80 text-base leading-relaxed">
            NASA's JWST data is publicly accessible but practically inaccessible. The existing
            tools — MAST portal, FITS file archives, interactive viewers — are built for
            astronomers. A curious person who saw a Webb image go viral on social media and
            wants to understand what they're actually looking at has nowhere to go that isn't
            either a caption-sized description or a Wikipedia article dense with jargon.
            Eschatia is the thing I wanted to exist: a narrated, spatially-aware journey
            through the images, where clicking a region of the Pillars of Creation tells you
            what's happening inside that specific column of gas. No prerequisites. No
            physics degree. Just curiosity and a willingness to look.
          </p>
        </motion.div>

        {/* Attribution */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="mb-12"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-4">Image credit</p>
          <p className="text-white/60 text-sm leading-relaxed">
            All images are public releases from NASA, ESA, CSA, and STScI. Observational data
            sourced via the{' '}
            <a
              href="https://mast.stsci.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold transition-colors underline underline-offset-2"
            >
              Mikulski Archive for Space Telescopes (MAST)
            </a>
            . High-resolution tiled imagery served by the{' '}
            <a
              href="https://esawebb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold transition-colors underline underline-offset-2"
            >
              ESA Webb portal
            </a>
            . Live observation data via{' '}
            <a
              href="https://jwstapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold transition-colors underline underline-offset-2"
            >
              jwstapi.com
            </a>
            .
          </p>
        </motion.div>

        {/* Built by */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.85}
          className="mb-12"
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-4">Built by</p>
          <p className="text-white/60 text-sm leading-relaxed">
            Sahaj Khandelwal — built for{' '}
            <a
              href="https://stardance.hackclub.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold transition-colors underline underline-offset-2"
            >
              Stardance
            </a>{' '}
            by Hack Club.{' '}
            <a
              href="https://github.com/sahajkhandelwal1/eschatia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold transition-colors underline underline-offset-2"
            >
              Open source on GitHub.
            </a>
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.0}
        >
          <Link
            to="/explore"
            className="inline-block px-8 py-3 bg-gold text-space-950 text-sm uppercase tracking-widest font-medium rounded hover:bg-gold-light transition-colors duration-200"
          >
            Begin exploring →
          </Link>
        </motion.div>

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

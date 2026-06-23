import { motion } from 'framer-motion';

export default function ScaleSidebar({ scaleTranslations, skipDelay }) {
  if (!scaleTranslations?.length) return null;

  return (
    <motion.div
      initial={skipDelay ? false : { y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: skipDelay ? 0 : 1.0 }}
      className="fixed bottom-6 left-6 z-20 max-w-xs"
    >
      <div className="bg-space-950/85 backdrop-blur-sm border border-white/10 rounded p-4">
        <p className="text-gold text-xs uppercase tracking-widest mb-3">Scale</p>
        <ol className="space-y-3">
          {scaleTranslations.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-gold/50 text-xs mt-0.5 shrink-0 font-medium">{i + 1}</span>
              <p className="text-white/55 text-xs leading-relaxed">{item}</p>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}

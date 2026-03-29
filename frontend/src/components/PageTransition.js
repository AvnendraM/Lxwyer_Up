import { motion } from 'framer-motion';

/**
 * PageTransition — opacity-only fade (no transform).
 * Avoids creating a new stacking context so position:fixed
 * children (floating AI buttons, GlobalBackButton) still work.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

import type { Variants, Transition } from "framer-motion";

// ─── Custom easing ─────────────────────────────────────────────────────────────
export const ease = {
  // Smooth deceleration — feels natural and premium
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // Quick ease-in for exits
  in: [0.55, 0, 1, 0.45] as [number, number, number, number],
  // Spring-like bounce easing
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
};

// ─── Page Transition ────────────────────────────────────────────────────────────
// Used at App level — wraps entire route in AnimatePresence
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.52,
      ease: ease.out,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: {
      duration: 0.22,
      ease: ease.in,
    },
  },
};

// ─── Stagger Grid (cards, lists) ───────────────────────────────────────────────
// Container — animate="show" triggers stagger on children
export const staggerGrid: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Individual card
export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 230,
      damping: 22,
    },
  },
};

// ─── Scroll-triggered Section ──────────────────────────────────────────────────
export const sectionReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: ease.out },
};

// Stagger for a section's children (whileInView mode)
export const sectionStagger: Variants = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 },
  },
};

// Child item for sectionStagger
export const sectionItem: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ease.out },
  },
};

// ─── Hero Word Reveal ──────────────────────────────────────────────────────────
// Returns props for each word in a "slide up" headline reveal.
// Wrap each word in: <span className="inline-block overflow-hidden">
//   <motion.span className="inline-block" {...wordReveal(i)} />
// </span>
export function wordReveal(index: number, baseDelay = 0.08): {
  initial: object;
  animate: object;
  transition: Transition;
} {
  return {
    initial: { y: "110%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    transition: {
      duration: 0.75,
      ease: ease.out,
      delay: baseDelay + index * 0.065,
    },
  };
}

// ─── Fade Up (general purpose) ─────────────────────────────────────────────────
export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export const fadeUpTransition = (delay = 0): Transition => ({
  duration: 0.6,
  ease: ease.out,
  delay,
});

// ─── PageWrapper backward-compat exports ───────────────────────────────────────
// Keep these so existing home.tsx imports don't break
export const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: ease.out },
};

export const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.11 },
  },
  viewport: { once: true, margin: "-80px" },
};

export const staggerItem = {
  initial: { opacity: 0, y: 22 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: ease.out },
  },
};

import type { Variants, Transition } from "framer-motion";

// ─── Custom easing ──────────────────────────────────────────────────────────
export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  in: [0.55, 0, 1, 0.45] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
};

// ─── Page Transition ────────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.52, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: ease.in },
  },
};

// ─── Stagger Grid (cards — animate mode) ────────────────────────────────────
// Use with initial="hidden" animate="show" exit="exit" — for filter-driven grids
export const staggerGrid: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: ease.in },
  },
};

// Individual card — animate mode (stagger child)
export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.1 } },
};

// ─── Stagger Grid (whileInView mode) ────────────────────────────────────────
// Use with initial="hidden" whileInView="show" — for scroll-reveal grids
export const staggerGridInView: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const cardVariantInView: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 230, damping: 22 },
  },
};

// ─── Scroll-triggered Section ───────────────────────────────────────────────
export const sectionReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: ease.out },
};

export const sectionStagger: Variants = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
};

export const sectionItem: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ease.out },
  },
};

// ─── Hero Word Reveal ───────────────────────────────────────────────────────
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

// ─── Fade Up ────────────────────────────────────────────────────────────────
export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export const fadeUpTransition = (delay = 0): Transition => ({
  duration: 0.6,
  ease: ease.out,
  delay,
});

// ─── Backward-compat exports (used by home.tsx, for-offices.tsx etc.) ────────
export const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: ease.out },
};

export const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.11 } },
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

import { ReactNode } from "react";

// Page transition is handled at the App level (AnimatedRoutes in App.tsx).
// PageWrapper is now a plain semantic wrapper with no motion — motion lives at App level.
export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}

// ─── Re-export shared animation variants ──────────────────────────────────────
// Kept here for backward compatibility with home.tsx and other pages
export {
  fadeInUp,
  staggerContainer,
  staggerItem,
  sectionReveal,
  sectionStagger,
  sectionItem,
  staggerGrid,
  cardVariant,
  wordReveal,
  fadeUp,
  fadeUpTransition,
} from "@/lib/motion";

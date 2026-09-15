// src/components/dashboard/brand/onboarding-points-badge.tsx
// Running points counter, with a floating "+N" pop whenever points are
// awarded — echoes the reference's HP badge, framed as "Brand Points"
// to stay on-tone for a B2B setup flow rather than literal game currency.
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface OnboardingPointsBadgeProps {
  points: number;
  lastAward: number | null; // the amount just added, triggers the "+N" pop
}

export function OnboardingPointsBadge({ points, lastAward }: OnboardingPointsBadgeProps) {
  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    if (lastAward) {
      setShowPop(true);
      const t = setTimeout(() => setShowPop(false), 1200);
      return () => clearTimeout(t);
    }
  }, [lastAward, points]);

  return (
    <div className="relative inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
      <Zap className="h-3.5 w-3.5 text-foreground" />
      <motion.span
        key={points}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-semibold tabular-nums"
      >
        {points} pts
      </motion.span>

      <AnimatePresence>
        {showPop && lastAward && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -22, scale: 1 }}
            exit={{ opacity: 0, y: -34 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute -top-1 right-2 text-xs font-bold text-emerald-500"
          >
            +{lastAward}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
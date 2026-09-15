// src/components/dashboard/brand/onboarding-card-stack-wrapper.tsx
// The peeking cards behind the active one now show real journey context
// — a completed step with a checkmark, and a glimpse of what's next —
// so the stack reads as an actual flow, not decoration.
"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface OnboardingCardStackWrapperProps {
  children: ReactNode;
  behindLabel: string; // the step just completed
  aheadLabel: string;  // what's coming next
}

export function OnboardingCardStackWrapper({ children, behindLabel, aheadLabel }: OnboardingCardStackWrapperProps) {
  return (
    <div className="relative pb-3 pt-3">
      {/* Behind card — completed step */}
      <motion.div
        initial={{ opacity: 0, y: 6, rotate: -2 }}
        animate={{ opacity: 1, y: 10, rotate: -2 }}
        transition={{ delay: 0.05 }}
        className="absolute inset-x-2 top-0 flex items-center gap-2 rounded-t-2xl border border-border bg-card/70 px-4 py-2.5"
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-2.5 w-2.5" />
        </span>
        <span className="truncate text-[11px] text-muted-foreground line-through decoration-muted-foreground/40">
          {behindLabel}
        </span>
      </motion.div>

      {/* Ahead card — what's next, faded and slightly hidden below */}
      <motion.div
        initial={{ opacity: 0, y: -4, rotate: 1.5 }}
        animate={{ opacity: 1, y: 6, rotate: 1.5 }}
        transition={{ delay: 0.1 }}
        className="absolute inset-x-2 bottom-0 flex items-center justify-end gap-2 rounded-b-2xl border border-border bg-card/50 px-4 py-2.5"
      >
        <span className="truncate text-[11px] text-muted-foreground/70">{aheadLabel}</span>
        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
      </motion.div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
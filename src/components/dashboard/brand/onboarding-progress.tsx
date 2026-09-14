// src/components/dashboard/brand/onboarding-progress.tsx
"use client";

import { motion } from "framer-motion";

interface OnboardingProgressProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          className="h-1 rounded-full bg-border"
          animate={{
            width: i === currentStep ? 24 : 8,
            backgroundColor: i <= currentStep ? "hsl(var(--foreground))" : "hsl(var(--border))",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
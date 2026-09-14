// src/components/dashboard/brand/onboarding-hero-stack.tsx
// A fanned card stack, echoing the reference's angled-card motif —
// each card represents a piece of what the Brand Brain will learn:
// website, socials, content, and the finished profile on top.
"use client";

import { motion } from "framer-motion";
import { Globe, Instagram, Sparkles, Fingerprint } from "lucide-react";

const CARDS = [
  { icon: Globe, label: "Website", rotate: -14, x: -36, delay: 0 },
  { icon: Instagram, label: "Socials", rotate: 10, x: 34, delay: 0.08 },
  { icon: Sparkles, label: "Content", rotate: -6, x: -12, delay: 0.16 },
  { icon: Fingerprint, label: "Brand Brain", rotate: 0, x: 0, delay: 0.24, top: true },
];

export function OnboardingHeroStack() {
  return (
    <div className="relative mx-auto flex h-40 w-full max-w-[220px] items-center justify-center">
      {CARDS.map(({ icon: Icon, label, rotate, x, delay, top }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 24, rotate: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, rotate, scale: 1, x }}
          transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className={`absolute flex h-24 w-20 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card shadow-lg ${
            top ? "z-10 shadow-xl ring-1 ring-foreground/10" : "shadow-md"
          }`}
          style={{ transformOrigin: "bottom center" }}
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${top ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
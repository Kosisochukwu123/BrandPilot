// src/components/dashboard/brand/onboarding-hero-stack.tsx
// The welcome centerpiece: the real hero image up front, with the two
// path images peeking behind at an angle — this isn't decorative, it's
// foreshadowing: the person is about to choose between exactly these
// two paths on the next screen.
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function OnboardingHeroStack() {
  return (
    <div className="relative mx-auto flex h-56 w-full max-w-[280px] items-center justify-center">
      {/* Back-left: website path, peeking */}
      <motion.div
        initial={{ opacity: 0, x: -20, rotate: 0, scale: 0.85 }}
        animate={{ opacity: 1, x: -48, rotate: -12, scale: 0.85 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute h-40 w-32 overflow-hidden rounded-2xl border border-border shadow-lg"
        style={{ transformOrigin: "bottom center" }}
      >
        <Image src="/onboarding/path-website.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-background/40" />
      </motion.div>

      {/* Back-right: social path, peeking */}
      <motion.div
        initial={{ opacity: 0, x: 20, rotate: 0, scale: 0.85 }}
        animate={{ opacity: 1, x: 48, rotate: 12, scale: 0.85 }}
        transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="absolute h-40 w-32 overflow-hidden rounded-2xl border border-border shadow-lg"
        style={{ transformOrigin: "bottom center" }}
      >
        <Image src="/onboarding/path-social.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-background/40" />
      </motion.div>

      {/* Front and center: the real hero */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 h-48 w-40 overflow-hidden rounded-3xl border border-border shadow-2xl ring-1 ring-foreground/10"
      >
        <Image src="/onboarding/welcome-hero.png" alt="Your Brand Brain" fill className="object-cover" priority />
      </motion.div>
    </div>
  );
}
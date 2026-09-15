// src/app/dashboard/brand/success/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Confetti } from "@/components/ui/confetti";
import {
  Sparkles,
  Globe,
  Image as ImageIcon,
  Radio,
  LayoutDashboard,
  ArrowRight,
  Check,
} from "lucide-react";

const NEXT_STEPS = [
  {
    href: "/dashboard/generate",
    label: "Generate Content",
    description: "Turn your brand into posts, ideas, and campaigns.",
    icon: Sparkles,
    accent: "yellow",
  },
  {
    href: "/dashboard/brand/report",
    label: "View Brand Report",
    description: "See the full analysis of your brand voice.",
    icon: Globe,
    accent: "blue",
  },
  {
    href: "/dashboard/posters/new",
    label: "Create Poster",
    description: "Design on-brand visuals in seconds.",
    icon: ImageIcon,
    accent: "purple",
  },
  {
    href: "/dashboard/channels",
    label: "Connect Socials",
    description: "Publish everywhere from one place.",
    icon: Radio,
    accent: "green",
  },
] as const;

const ACCENT = {
  yellow: {
    bg: "bg-[#e8ff47]",
    text: "text-black",
    glow: "bg-[#e8ff47]/20",
    ring: "group-hover:border-[#e8ff47]/40",
    hover: "group-hover:bg-[#e8ff47]/[0.04]",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-white",
    glow: "bg-blue-500/20",
    ring: "group-hover:border-blue-500/40",
    hover: "group-hover:bg-blue-500/[0.04]",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-500 to-pink-500",
    text: "text-white",
    glow: "bg-purple-500/20",
    ring: "group-hover:border-purple-500/40",
    hover: "group-hover:bg-purple-500/[0.04]",
  },
  green: {
    bg: "bg-emerald-500",
    text: "text-white",
    glow: "bg-emerald-500/20",
    ring: "group-hover:border-emerald-500/40",
    hover: "group-hover:bg-emerald-500/[0.04]",
  },
} as const;

export default function BrandBrainSuccessPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-16 font-sans antialiased">
      {/* ============ BACKGROUND ============ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#131315] via-[#0a0a0a] to-[#050505]" />

        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#e8ff47]/[0.15] blur-[140px]"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/[0.12] blur-[140px]"
        />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Confetti />

      {/* ============ HERO ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Success badge with pulsing rings */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <motion.span
            animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#e8ff47]/30"
          />
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 rounded-full bg-[#e8ff47]/40"
          />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e8ff47] shadow-[0_0_60px_rgba(232,255,71,0.4)]">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
            >
              <Check className="h-10 w-10 text-black" strokeWidth={3} />
            </motion.div>
          </div>
        </div>

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-xl"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8ff47]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Brand Brain ready
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem]"
        >
          Your brand is now
          <br />
          <span className="bg-gradient-to-r from-[#e8ff47] to-[#a8e82b] bg-clip-text text-transparent">
            fully understood.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 max-w-md text-sm leading-6 text-white/50 sm:text-base"
        >
          BrandPilot now understands your business. Every content generation,
          poster, and recommendation from here on will use this profile.
        </motion.p>
      </motion.div>

      {/* ============ NEXT STEPS GRID ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-12 w-full max-w-2xl"
      >
        <div className="mb-4 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            What you can do now
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
            4 actions
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {NEXT_STEPS.map((step, i) => {
            const Icon = step.icon;
            const accent = ACCENT[step.accent];

            return (
              <motion.div
                key={step.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.65 + i * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={step.href}
                  className={[
                    "group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all",
                    "hover:scale-[1.01] hover:border-white/20",
                    accent.ring,
                    accent.hover,
                  ].join(" ")}
                >
                  {/* Icon tile with glow */}
                  <div className="relative shrink-0">
                    <div className={[
                      "absolute inset-0 rounded-xl blur-md opacity-40 transition-opacity group-hover:opacity-70",
                      accent.glow,
                    ].join(" ")} />
                    <div className={[
                      "relative flex h-11 w-11 items-center justify-center rounded-xl",
                      accent.bg,
                      accent.text,
                    ].join(" ")}>
                      <Icon className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">
                        {step.label}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/70" />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      {step.description}
                    </p>
                  </div>

                  {/* Corner sheen on hover */}
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.03] opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ============ PRIMARY CTA ============ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-10 flex w-full max-w-2xl flex-col items-center gap-4"
      >
        <Link
          href="/dashboard"
          className="group relative flex w-full max-w-md items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#e8ff47] py-4 text-sm font-bold text-black shadow-[0_20px_40px_-15px_rgba(232,255,71,0.5)] transition-all hover:scale-[1.01] active:scale-[0.98] sm:w-auto sm:px-10"
        >
          <LayoutDashboard className="relative z-10 h-4 w-4" strokeWidth={2.5} />
          <span className="relative z-10">Go to Dashboard</span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />

          {/* Sheen */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        {/* Footer note */}
        <div className="mt-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
          <span className="h-1 w-1 rounded-full bg-[#e8ff47]/60" />
          Everything is saved to your workspace
          <span className="h-1 w-1 rounded-full bg-[#e8ff47]/60" />
        </div>
      </motion.div>

      {/* Top edge highlight */}
      <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#e8ff47]/30 to-transparent" />
    </div>
  );
}
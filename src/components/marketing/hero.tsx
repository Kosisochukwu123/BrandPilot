"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Check,
  Instagram,
  Facebook,
  MessageCircle,
  Twitter,
} from "lucide-react";

const platforms = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "X" },
  { icon: MessageCircle, label: "WhatsApp" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 pb-20 pt-28 md:pt-32">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-foreground/[0.04] blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-foreground/[0.04] blur-[120px]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--foreground)_7%,transparent),transparent_55%)]" />
      </div>

      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_40%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl"
        >
          <motion.span
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-foreground/70" />
          </motion.span>
          AI-powered marketing for your brand
          <span className="ml-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] text-foreground">
            New
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl md:text-7xl lg:text-8xl"
        >
          Turn your website into
          <br />
          <span className="relative inline-block">
            <span className="bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              a month of marketing.
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1,
                delay: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -bottom-2 left-[10%] h-px w-[80%] origin-left bg-foreground/20"
            />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Paste your website. BrandPilot understands your business, learns your
          brand voice, and creates marketing content ready for every platform
          you use.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            className="group relative h-12 overflow-hidden rounded-full bg-foreground px-7 text-[13px] font-medium text-background shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground/90 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
            asChild
          >
            <Link href="/register">
              <span className="relative z-10">Analyze my website</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute inset-0 translate-y-full bg-background/10 transition-transform duration-500 group-hover:translate-y-0" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="group h-12 rounded-full border-border/80 bg-background/60 px-7 text-[13px] font-medium backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-secondary/40"
            asChild
          >
            <a href="#how-it-works">
              See how it works
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Button>
        </motion.div>

        {/* Quick benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          {[
            "No credit card required",
            "AI-generated content",
            "Ready in minutes",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-foreground/60" />
              {item}
            </div>
          ))}
        </motion.div>

        {/* Product preview - now more colorful */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{
            opacity: 1,
            y: [0, -8, 0],
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.8 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.8, delay: 0.8 },
          }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-3xl" />

          <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/80 p-3 shadow-2xl backdrop-blur-xl">
            {/* Fake browser top */}
            <div className="flex items-center gap-2 border-b border-border/60 px-3 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <div className="ml-3 h-6 flex-1 rounded-md bg-secondary/50" />
            </div>

            {/* Preview content */}
            <div className="grid gap-3 p-3 md:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-4 text-left">
                <p className="text-xs text-muted-foreground">Your brand</p>
                <h3 className="mt-2 font-medium">Acme Studio</h3>
                <div className="mt-5 space-y-3">
                  <div className="h-2 w-full rounded-full bg-violet-500/30" />
                  <div className="h-2 w-4/5 rounded-full bg-fuchsia-500/25" />
                  <div className="h-2 w-3/5 rounded-full bg-cyan-500/20" />
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background p-4 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">AI Content Plan</p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Generated
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-medium">
                  Your next 30 days of content
                </h3>

                <div className="mt-4 space-y-3">
                  {[
                    { color: "bg-violet-500/20", delay: 0.4 },
                    { color: "bg-fuchsia-500/20", delay: 0.8 },
                    { color: "bg-cyan-500/20", delay: 1.2 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 3,
                        delay: item.delay,
                        repeat: Infinity,
                      }}
                      className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
                    >
                      <div className={`h-8 w-8 rounded-md ${item.color}`} />
                      <div className="flex-1">
                        <div className="h-2 w-3/4 rounded-full bg-foreground/10" />
                        <div className="mt-2 h-2 w-1/2 rounded-full bg-foreground/5" />
                      </div>
                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        Ready
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platforms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-5 text-muted-foreground/60"
        >
          {platforms.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
// src/components/marketing/cta.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-background py-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-foreground/5 to-transparent blur-3xl" />
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-foreground/5 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-foreground/5 blur-2xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3" />
            No credit card required
          </motion.div>

          {/* Heading with gradient */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="text-3xl font-medium tracking-tight md:text-5xl"
          >
            Ready to see your{" "}
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              brand profile
            </span>
            ?
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground"
          >
            Start with our free plan. No credit card required.
            <br className="hidden sm:block" />
            See what BrandPilot can do for your business.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="group rounded-full bg-foreground px-8 text-background transition-all hover:bg-foreground/90 hover:shadow-lg hover:scale-[1.02]"
              asChild
            >
              <Link href="/register">
                Analyze my website
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="group rounded-full px-8 text-muted-foreground hover:text-foreground"
              asChild
            >
              <a href="#how-it-works">
                Learn more
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Free forever plan
            </span>
            <span className="h-4 w-px bg-border/50" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              No credit card
            </span>
            <span className="h-4 w-px bg-border/50" />
            <span className="flex items-center gap-2">
              <span className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-5 w-5 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 border border-background"
                  />
                ))}
              </span>
              2,000+ brands
            </span>
          </motion.div>

          {/* Craft detail */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-border" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/40">
                Start building today
              </span>
              <span className="h-px w-12 bg-border" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
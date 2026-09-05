// src/components/dashboard/posters/poster-studio.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Brain } from "lucide-react";

const STAGES = [
  "Reading your Brand Brain",
  "Understanding your audience",
  "Selecting brand colors",
  "Writing headline",
  "Designing layout",
  "Positioning CTA",
  "Optimizing typography",
  "Rendering final poster",
];

const STAGE_MS = 500; // 8 stages ≈ 4s, matches "premium but not sluggish"

interface PosterStudioProps {
  brandName: string | null;
  isDone: boolean;
}

export function PosterStudio({ brandName, isDone }: PosterStudioProps) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (isDone) return;
    const timer = setInterval(() => {
      setActiveStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, STAGE_MS);
    return () => clearInterval(timer);
  }, [isDone]);

  // Blur sharpens progressively with stage progress — purely visual,
  // no real image exists yet at this point, so this is a placeholder
  // gradient standing in for "the AI painting the design."
  const blurAmount = Math.max(0, 24 - activeStage * 3);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Brain className="h-4 w-4" />
          <span className="font-medium">Brand Brain Loaded</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Using {brandName ?? "your"} saved brand identity...
        </p>

        <div className="mt-6 space-y-3">
          {STAGES.map((stage, i) => {
            const done = i < activeStage || isDone;
            const active = i === activeStage && !isDone;
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={
                    done
                      ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      : "flex h-5 w-5 items-center justify-center rounded-full border border-border"
                  }
                >
                  {done && <Check className="h-3 w-3" />}
                  {active && (
                    <motion.span
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  )}
                </span>
                <span className={done || active ? "text-foreground" : "text-muted-foreground"}>{stage}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
        <motion.div
          animate={{ filter: `blur(${blurAmount}px)`, opacity: isDone ? 0 : 0.6 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full bg-gradient-to-br from-primary/30 via-muted to-primary/10"
          style={{ aspectRatio: "1 / 1" }}
        />
        <AnimatePresence>
          {!isDone && (
            <motion.p
              exit={{ opacity: 0 }}
              className="absolute text-xs text-muted-foreground"
            >
              Painting your poster...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
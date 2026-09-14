// src/components/dashboard/brand/brand-brain-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";

const STAGES = [
  "Reading business information",
  "Understanding your audience",
  "Detecting your brand voice",
  "Discovering content opportunities",
  "Building marketing profile",
  "Preparing AI assistant",
];

const STAGE_DURATION_MS = 700;

interface BrandBrainModalProps {
  isOpen: boolean;
  run: () => Promise<{ success: boolean; error?: string }>;
  onDone: (result: { success: boolean; error?: string }) => void;
}

export function BrandBrainModal({ isOpen, run, onDone }: BrandBrainModalProps) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setActiveStage(0);
      return;
    }

    let cancelled = false;
    const workPromise = run();

    const stageTimer = setInterval(() => {
      setActiveStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, STAGE_DURATION_MS);

    const minDelay = new Promise((resolve) => setTimeout(resolve, STAGE_DURATION_MS * STAGES.length));

    Promise.all([workPromise, minDelay]).then(([result]) => {
      clearInterval(stageTimer);
      if (!cancelled) onDone(result);
    });

    return () => {
      cancelled = true;
      clearInterval(stageTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const progressPct = ((activeStage + 1) / STAGES.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-2xl"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </div>

            <h2 className="mt-4 text-center text-lg font-semibold">Building your Brand Brain</h2>

            {/* Progress bar */}
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full rounded-full bg-foreground"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="mt-6 space-y-3">
              {STAGES.map((stage, i) => {
                const done = i < activeStage;
                const active = i === activeStage;
                return (
                  <div key={stage} className="flex items-center gap-3 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border">
                      <AnimatePresence mode="wait">
                        {done ? (
                          <motion.span
                            key="done"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background"
                          >
                            <Check className="h-3 w-3" />
                          </motion.span>
                        ) : active ? (
                          <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                        ) : null}
                      </AnimatePresence>
                    </span>
                    <span className={done || active ? "text-foreground" : "text-muted-foreground"}>{stage}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
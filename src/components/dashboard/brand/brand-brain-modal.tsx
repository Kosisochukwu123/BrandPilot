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

    const minDelay = new Promise((resolve) =>
      setTimeout(resolve, STAGE_DURATION_MS * STAGES.length)
    );

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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
        >
          {/* ============ MODAL SHEET ============ */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0a0a0a] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* ============ LAYERED BACKGROUND ============ */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-[#131315] via-[#0a0a0a] to-[#050505]" />

              {/* Radial glows */}
              <motion.div
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#e8ff47]/[0.15] blur-[120px]"
              />
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.08, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-32 -left-32 h-[350px] w-[350px] rounded-full bg-purple-500/[0.12] blur-[120px]"
              />

              {/* Dot grid */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* ============ CONTENT ============ */}
            <div className="relative z-10 p-7">

              {/* Grab handle */}
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/10" />

              {/* Icon with pulsing ring */}
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                {/* Pulsing rings */}
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-[#e8ff47]/30"
                />
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                  className="absolute inset-0 rounded-full bg-[#e8ff47]/40"
                />

                {/* Core tile */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8ff47] shadow-[0_0_40px_rgba(232,255,71,0.4)]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-7 w-7 text-black" strokeWidth={2.5} />
                  </motion.div>
                </div>
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 text-center text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-white"
              >
                Building your
                <br />
                <span className="bg-gradient-to-r from-[#e8ff47] to-[#a8e82b] bg-clip-text text-transparent">
                  Brand Brain
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-2 text-center text-xs font-medium text-white/40"
              >
                This usually takes a few seconds
              </motion.p>

              {/* ============ PROGRESS BAR ============ */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                  <span>Progress</span>
                  <span className="text-[#e8ff47]">
                    {Math.round(progressPct)}%
                  </span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="relative h-full rounded-full bg-gradient-to-r from-[#e8ff47] to-[#a8e82b]"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Shimmer */}
                    <motion.span
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              {/* ============ STAGE LIST ============ */}
              <div className="mt-6 space-y-2">
                {STAGES.map((stage, i) => {
                  const done = i < activeStage;
                  const active = i === activeStage;
                  return (
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className={[
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-white/[0.04]"
                          : "bg-transparent",
                      ].join(" ")}
                    >
                      {/* Status icon */}
                      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                        <AnimatePresence mode="wait">
                          {done ? (
                            <motion.span
                              key="done"
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 22 }}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8ff47] text-black"
                            >
                              <Check className="h-3 w-3" strokeWidth={3.5} />
                            </motion.span>
                          ) : active ? (
                            <motion.span
                              key="active"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex h-5 w-5 items-center justify-center rounded-full border border-[#e8ff47]/40 bg-[#e8ff47]/10"
                            >
                              <Loader2 className="h-3 w-3 animate-spin text-[#e8ff47]" strokeWidth={3} />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="pending"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]"
                            >
                              <span className="h-1 w-1 rounded-full bg-white/20" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>

                      {/* Label */}
                      <span
                        className={[
                          "text-[13px] font-medium transition-colors",
                          done
                            ? "text-white/50"
                            : active
                            ? "text-white"
                            : "text-white/30",
                        ].join(" ")}
                      >
                        {stage}
                      </span>

                      {/* Done checkmark on right */}
                      {done && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="ml-auto text-[9px] font-bold uppercase tracking-[0.15em] text-[#e8ff47]/70"
                        >
                          Done
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* ============ FOOTER ============ */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-5"
              >
                <div className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="h-1 w-1 rounded-full bg-[#e8ff47]"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="h-1 w-1 rounded-full bg-[#e8ff47]"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                    className="h-1 w-1 rounded-full bg-[#e8ff47]"
                  />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                  Please don&apos;t close this
                </span>
              </motion.div>
            </div>

            {/* Top edge highlight */}
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#e8ff47]/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const STAGES = [
  { 
    label: "Discovery & Brief Analysis", 
    note: "Parsing caption, offer and contact details"
  },
  { 
    label: "Brand Voice & Visual Identity", 
    note: "Colors, handle, logo placement rules"
  },
  { 
    label: "Layout Selection & Composition", 
    note: "Matching templates to your message"
  },
  { 
    label: "Artwork & Visual Design", 
    note: "Backgrounds, depth and focal balance"
  },
  { 
    label: "Typography & Hierarchy", 
    note: "Headline hierarchy, kerning, safe margins"
  },
  { 
    label: "Final Polish & Export", 
    note: "Export-ready at print resolution"
  },
];

/** Stage dwell in ms — slower to match actual AI generation time */
const DWELL = 8000; // 8 seconds per stage = ~48 seconds total

export function PosterGenerating() {
  const [stage, setStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStage((s) => Math.min(STAGES.length - 1, s + 1));
    }, DWELL);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Smooth progress animation
  useEffect(() => {
    const target = Math.min(96, ((stage + 1) / STAGES.length) * 92 + (elapsed % 4));
    const duration = 1200;
    const startTime = Date.now();
    const startProgress = progress;

    const animate = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const t = Math.min(elapsedTime / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const currentProgress = startProgress + (target - startProgress) * eased;
      setProgress(Math.min(currentProgress, target));

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [stage, elapsed]);

  const currentStage = STAGES[stage];
  const isComplete = stage === STAGES.length - 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pt-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            {isComplete ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-accent"
              >
                ◆
              </motion.span>
            ) : (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-6 w-6 text-accent" />
              </motion.span>
            )}
            {isComplete ? "Finalizing" : "Generating poster"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isComplete 
              ? "Applying final touches..." 
              : currentStage?.note || "Processing your request"
            }
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Processing
          </p>
          <p className="font-mono text-lg tabular-nums font-semibold">
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
            {String(elapsed % 60).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Premium progress bar with glow */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent/60"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        {/* Glow effect on progress bar */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-[shimmer_2s_infinite]" />
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-8 w-8 -ml-4 rounded-full bg-accent/20 blur-xl"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Process steps - 3 column grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STAGES.map((s, i) => {
          const state = i < stage ? "done" : i === stage ? "active" : "todo";
          const isActive = state === "active";
          const isDone = state === "done";

          return (
            <motion.div
              key={s.label}
              className={`
                relative rounded-xl border p-4 transition-all duration-700
                ${isDone ? "border-accent/30 bg-accent/5" : ""}
                ${isActive ? "border-accent/50 bg-accent/10 shadow-[0_0_30px_-8px_rgba(99,102,241,0.15)]" : ""}
                ${state === "todo" ? "border-border/50 opacity-35" : ""}
              `}
              initial={false}
              animate={{
                scale: isActive ? 1.02 : 1,
                opacity: state === "todo" ? 0.35 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Active glow */}
              {isActive && (
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-accent/20 via-accent/10 to-transparent opacity-50 blur-xl -z-10" />
              )}

              <div className="flex items-start gap-3">
                {/* Step number */}
                <div className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all
                  ${isDone ? "bg-accent text-white" : ""}
                  ${isActive ? "bg-accent/20 text-accent ring-1 ring-accent/50" : ""}
                  ${state === "todo" ? "bg-muted text-muted-foreground" : ""}
                `}>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium transition-colors ${
                      isActive ? "text-accent" : ""
                    }`}>
                      {s.label}
                    </p>
                    {isDone && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent/70">
                        complete
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {s.note}
                  </p>
                </div>
              </div>

              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DWELL / 1000, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Live status indicator */}
      <motion.div
        className="flex items-center gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="relative flex h-2 w-2"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </motion.span>
          <span className="text-xs text-muted-foreground">Live preview updating</span>
        </div>
        <span className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground">
          {Math.round(progress)}% complete
        </span>
      </motion.div>

      {/* Premium poster placeholder */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-secondary/50 to-secondary/20"
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
          {/* Premium gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.05]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--accent)/0.08,transparent_70%)]" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-[shimmer_3s_linear_infinite] bg-[linear-gradient(105deg,transparent_40%,var(--accent)/0.06_50%,transparent_60%)] bg-[length:200%_100%]" />

          {/* Ghost layout blocks with animated opacity */}
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            <div className="flex items-center justify-between">
              <motion.div 
                className="h-10 w-10 rounded-full border border-border/50 bg-foreground/5"
                animate={{ 
                  opacity: stage >= 0 ? 1 : 0.2,
                }}
              />
              <motion.div 
                className="h-2 w-20 rounded-full bg-foreground/10"
                animate={{ opacity: stage >= 1 ? 1 : 0.2 }}
              />
            </div>
            
            <div className="space-y-4">
              <motion.div 
                className="h-8 w-4/5 rounded-lg bg-foreground/10"
                animate={{ 
                  opacity: stage >= 2 ? 0.8 : 0.2,
                  width: stage >= 4 ? "85%" : "70%",
                }}
              />
              <motion.div 
                className="h-8 w-3/5 rounded-lg bg-foreground/8"
                animate={{ opacity: stage >= 3 ? 0.6 : 0.2 }}
              />
              <motion.div 
                className="h-2 w-2/5 rounded-full bg-foreground/6"
                animate={{ opacity: stage >= 4 ? 1 : 0.2 }}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                className="h-10 w-32 rounded-full bg-foreground/10"
                animate={{ opacity: stage >= 5 ? 1 : 0.3 }}
              />
              <motion.div 
                className="h-2 w-24 rounded-full bg-foreground/6"
                animate={{ opacity: stage >= 5 ? 0.6 : 0.2 }}
              />
            </div>
          </div>

          {/* Scanning line with glow */}
          <div className="pointer-events-none absolute inset-x-0 h-px animate-[scan_4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gradient-to-r from-transparent via-accent/60 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.3)]" />

          {/* Corner accents - premium */}
          <div className="absolute top-4 left-4 h-6 w-6 border-l-2 border-t-2 border-accent/20" />
          <div className="absolute top-4 right-4 h-6 w-6 border-r-2 border-t-2 border-accent/20" />
          <div className="absolute bottom-4 left-4 h-6 w-6 border-l-2 border-b-2 border-accent/20" />
          <div className="absolute bottom-4 right-4 h-6 w-6 border-r-2 border-b-2 border-accent/20" />

          {/* Floating particles - subtle */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 w-0.5 rounded-full bg-accent/20"
                initial={{
                  x: 10 + Math.random() * 80,
                  y: 10 + Math.random() * 80,
                  opacity: 0,
                }}
                animate={{
                  x: [null, 10 + Math.random() * 80],
                  y: [null, 10 + Math.random() * 80],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Center glow pulse */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent)/0.05,transparent_70%)]" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PosterGenerating;
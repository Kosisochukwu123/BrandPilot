"use client";

import { motion } from "framer-motion";
import { GripHorizontal, RotateCcw } from "lucide-react";

import { BrandHealthWidget } from "./brand-health-widget";

interface DraggableBrandHealthProps {
  score: number;
  delta: number;
}

export function DraggableBrandHealth({
  score,
  delta,
}: DraggableBrandHealthProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={{
        top: -160,
        right: 120,
        bottom: 260,
        left: -320,
      }}
      whileDrag={{
        scale: 1.03,
        zIndex: 50,
      }}
      className="group relative cursor-grab active:cursor-grabbing"
    >
      {/* Soft floating glow */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-violet-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        {/* Drag indicator */}
        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-1 opacity-0 shadow-sm transition-all duration-300 group-hover:-top-4 group-hover:opacity-100">
          <GripHorizontal className="h-3 w-3 text-muted-foreground" />

          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
            Drag
          </span>
        </div>

        <BrandHealthWidget score={score} delta={delta} />

        {/* Reset hint */}
        <div className="pointer-events-none absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <RotateCcw className="h-3 w-3 text-muted-foreground/50" />

          <span className="text-[9px] text-muted-foreground/50">
            Drag anywhere
          </span>
        </div>
      </div>
    </motion.div>
  );
}
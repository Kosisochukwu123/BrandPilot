"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Activity,
  Sparkles,
} from "lucide-react";

import { SpotlightCard } from "./motion-primitives";
import { ActivityFeed } from "./activity-feed";

interface RecentActivityPreviewProps {
  items: React.ComponentProps<typeof ActivityFeed>["items"];
}

export function RecentActivityPreview({
  items,
}: RecentActivityPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, 2);

  return (
    <SpotlightCard className="relative h-full overflow-hidden p-0">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      {/* Header */}
      <div className="border-b border-border/60 bg-gradient-to-br from-violet-500/[0.045] via-background to-indigo-500/[0.025] px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/10">
                <Activity className="h-3.5 w-3.5 text-violet-500" />
              </span>

              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Activity
              </span>
            </div>

            <h2 className="mt-3 text-[16px] font-semibold tracking-tight">
              Recent activity
            </h2>

            <p className="mt-1 text-[12px] text-muted-foreground">
              Your latest work inside BrandPilot.
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-500/10 bg-violet-500/[0.05]">
            <Sparkles className="h-3.5 w-3.5 text-violet-500/70" />
          </div>
        </div>
      </div>

      {/* Activity items */}
      <div className="p-5">
        <AnimatePresence initial={false}>
          <motion.div
            key={expanded ? "expanded" : "collapsed"}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <ActivityFeed items={visibleItems} />
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Your recent activity will appear here.
            </p>
          </div>
        )}

        {/* See more */}
        {items.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-secondary/20 py-2.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-violet-300/50 hover:bg-violet-500/[0.05] hover:text-violet-600"
          >
            {expanded ? (
              <>
                Show less

                <ChevronUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              </>
            ) : (
              <>
                See more activity

                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Live footer */}
      <div className="flex items-center gap-2 border-t border-border/60 bg-secondary/[0.15] px-5 py-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60">
          Tracking workspace activity
        </span>
      </div>
    </SpotlightCard>
  );
}
// src/components/dashboard/overview/suggestion-card.tsx

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Megaphone,
  BarChart3,
} from "lucide-react";

import type { Suggestion } from "@/server/services/ai/suggestion-engine";

import { SpotlightCard } from "./motion-primitives";

function getSuggestionStyle(title: string) {
  const value = title.toLowerCase();

  if (
    value.includes("content") ||
    value.includes("post") ||
    value.includes("create")
  ) {
    return {
      icon: Megaphone,
      iconClass:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      glow:
        "bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_55%)]",
      accent: "bg-violet-500",
      progress: "bg-violet-500",
    };
  }

  if (
    value.includes("grow") ||
    value.includes("engagement") ||
    value.includes("audience")
  ) {
    return {
      icon: TrendingUp,
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      glow:
        "bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_55%)]",
      accent: "bg-emerald-500",
      progress: "bg-emerald-500",
    };
  }

  if (
    value.includes("performance") ||
    value.includes("analytics") ||
    value.includes("improve")
  ) {
    return {
      icon: BarChart3,
      iconClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      glow:
        "bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_55%)]",
      accent: "bg-blue-500",
      progress: "bg-blue-500",
    };
  }

  return {
    icon: Lightbulb,
    iconClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    glow:
      "bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_55%)]",
    accent: "bg-amber-500",
    progress: "bg-amber-500",
  };
}

export function SuggestionCard({
  suggestion,
}: {
  suggestion: Suggestion;
}) {
  const style = getSuggestionStyle(suggestion.title);
  const Icon = style.icon;

  return (
    <SpotlightCard
      as="article"
      className="group relative h-full overflow-hidden border border-border/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg sm:p-5"
    >
      {/* Soft coloured atmosphere */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 opacity-80 ${style.glow}`}
      />

      {/* Top accent */}
      <div
        className={`absolute left-0 top-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${style.accent}`}
      />

      <div className="relative flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`grid size-9 shrink-0 place-items-center rounded-xl ${style.iconClass}`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-violet-500" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  AI Suggestion
                </span>
              </div>

              <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                Personalized for your brand
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-border/60 bg-background/60 px-2 py-1 text-[9px] font-medium text-muted-foreground backdrop-blur">
            Recommended
          </span>
        </div>

        {/* Content */}
        <div className="mt-5">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground">
            {suggestion.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
            {suggestion.description}
          </p>
        </div>

        {/* AI relevance */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">
              AI relevance
            </span>

            <span className="font-medium text-foreground/70">
              High
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full w-[88%] rounded-full transition-all duration-700 group-hover:w-full ${style.progress}`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link
            href={suggestion.actionHref}
            className="group/button inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-3 py-2 text-xs font-medium text-background transition-all duration-200 hover:opacity-90"
          >
            {suggestion.actionLabel}

            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/button:translate-x-1" />
          </Link>

          <button
            type="button"
            aria-label="Dismiss suggestion"
            className="rounded-xl border border-border/70 px-3 py-2 text-[11px] font-medium text-muted-foreground transition-all hover:border-border hover:bg-secondary hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default SuggestionCard;
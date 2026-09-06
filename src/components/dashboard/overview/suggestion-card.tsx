// src/components/dashboard/overview/suggestion-card.tsx

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ImageIcon,
  Target,
  Brain,
} from "lucide-react";

import type {
  Suggestion,
  SuggestionKind,
} from "@/server/services/ai/suggestion-engine";

import { SpotlightCard } from "./motion-primitives";

const suggestionConfig: Record<
  SuggestionKind,
  {
    label: string;
    icon: typeof Sparkles;
    iconClass: string;
    accentClass: string;
  }
> = {
  content: {
    label: "Content idea",
    icon: Sparkles,
    iconClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    accentClass: "from-violet-500/20",
  },

  poster: {
    label: "Visual campaign",
    icon: ImageIcon,
    iconClass:
      "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
    accentClass: "from-fuchsia-500/20",
  },

  opportunity: {
    label: "Growth opportunity",
    icon: Target,
    iconClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    accentClass: "from-amber-500/20",
  },

  brand: {
    label: "Brand setup",
    icon: Brain,
    iconClass:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    accentClass: "from-indigo-500/20",
  },
};

export function SuggestionCard({
  suggestion,
}: {
  suggestion: Suggestion;
}) {
  const config = suggestionConfig[suggestion.kind];
  const Icon = config.icon;

  return (
    <SpotlightCard
      as="article"
      className="group relative h-full overflow-hidden p-5"
    >
      {/* Ambient accent */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${config.accentClass} to-transparent opacity-60`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${config.iconClass}`}
          >
            <Icon className="size-5" />
          </div>

          <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
            {config.label}
          </span>
        </div>

        <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
          {suggestion.title}
        </h3>

        <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
          {suggestion.description}
        </p>

        <Link
          href={suggestion.actionHref}
          className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-foreground transition-transform group-hover:translate-x-0.5"
        >
          {suggestion.actionLabel}

          <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
      </div>
    </SpotlightCard>
  );
}

export default SuggestionCard;
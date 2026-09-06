// src/server/services/ai/suggestion-engine.ts

// Generates dashboard suggestions from real Brand Report data.
// If no report exists, returns a setup suggestion instead of
// inventing recommendations without brand data.

import type { BrandReport } from "@prisma/client";

export type SuggestionKind =
  | "content"
  | "poster"
  | "opportunity"
  | "brand";

export interface Suggestion {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  kind: SuggestionKind;
}

interface PlatformRanking {
  platform: string;
  stars: number;
  reason: string;
}

interface Opportunity {
  title: string;
  detail: string;
}

export function buildTodaysSuggestions(
  report: BrandReport | null,
): Suggestion[] {
  // No Brand Report yet — do not fabricate personalised suggestions.
  if (!report) {
    return [
      {
        title: "Set up your Brand Brain",
        description:
          "Analyze your website or add your brand preferences so BrandPilot can start giving you recommendations built around your business.",
        actionHref: "/dashboard/brand",
        actionLabel: "Set up brand",
        kind: "brand",
      },
    ];
  }

  const platformRankings =
    report.platformRankings as unknown as PlatformRanking[];

  const opportunities =
    report.opportunities as unknown as Opportunity[];

  const topPlatform =
    platformRankings?.[0]?.platform ?? "Instagram";

  const topPillar =
    report.contentPillars?.[0] ?? "your business";

  const suggestions: Suggestion[] = [
    {
      title: `Create a ${topPlatform} post`,
      description: `${topPlatform} is currently your strongest-ranked platform. Create content around ${topPillar.toLowerCase()} to build on that opportunity.`,
      actionHref: "/dashboard/generate",
      actionLabel: "Generate content",
      kind: "content",
    },

    {
      title: "Turn an idea into a poster",
      description: `Create a visual campaign using your brand direction and ${report.typography.toLowerCase()} typography style.`,
      actionHref: "/dashboard/posters/new",
      actionLabel: "Create poster",
      kind: "poster",
    },
  ];

  // Use a real opportunity generated in the Brand Report.
  if (opportunities?.[0]) {
    suggestions.push({
      title: opportunities[0].title,
      description: opportunities[0].detail,
      actionHref: "/dashboard/generate",
      actionLabel: "Explore opportunity",
      kind: "opportunity",
    });
  }

  // Add another real content pillar if available.
  if (report.contentPillars?.[1]) {
    suggestions.push({
      title: `Explore ${report.contentPillars[1]}`,
      description:
        "This is another important content pillar identified in your Brand Report and is worth developing further.",
      actionHref: "/dashboard/generate",
      actionLabel: "Create content",
      kind: "content",
    });
  }

  // Dashboard should stay focused.
  return suggestions.slice(0, 3);
}
// src/server/services/ai/suggestion-engine.ts
// Generates "Today's AI Suggestions" from the Brand Report's content
// pillars and platform rankings — not generic filler cards. If no report
// exists yet, falls back to a single "finish setup" suggestion instead
// of fabricating brand-specific advice with no data behind it.
import type { BrandReport } from "@prisma/client";

export interface Suggestion {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}

interface PlatformRanking { platform: string; stars: number; reason: string }
interface Opportunity { title: string; detail: string }

export function buildTodaysSuggestions(report: BrandReport | null): Suggestion[] {
  if (!report) {
    return [
      {
        title: "Set up your Brand Brain",
        description: "Analyze your website or fill in your preferences so BrandPilot can start making suggestions.",
        actionHref: "/dashboard/brand",
        actionLabel: "Get started",
      },
    ];
  }

  const platformRankings = report.platformRankings as unknown as PlatformRanking[];
  const opportunities = report.opportunities as unknown as Opportunity[];
  const topPlatform = platformRankings?.[0]?.platform ?? "Instagram";
  const topPillar = report.contentPillars?.[0] ?? "your business";

  const suggestions: Suggestion[] = [
    {
      title: `Create a ${topPlatform} post`,
      description: `${topPlatform} is your strongest-ranked platform — try a post about ${topPillar.toLowerCase()}.`,
      actionHref: "/dashboard/generate",
      actionLabel: "Generate content",
    },
    {
      title: "Design a poster",
      description: `Turn today's content into a poster using your brand colors and ${report.typography.toLowerCase()} style.`,
      actionHref: "/dashboard/posters/new",
      actionLabel: "Create poster",
    },
  ];

  if (opportunities?.[0]) {
    suggestions.push({
      title: opportunities[0].title,
      description: opportunities[0].detail,
      actionHref: "/dashboard/generate",
      actionLabel: "Act on this",
    });
  }

  if (report.contentPillars?.[1]) {
    suggestions.push({
      title: `Write about ${report.contentPillars[1]}`,
      description: "Another recurring theme from your Brand Report worth covering.",
      actionHref: "/dashboard/generate",
      actionLabel: "Generate content",
    });
  }

  return suggestions.slice(0, 4);
}
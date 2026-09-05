// src/server/services/ai/regenerate-poster-parts.ts
import { openai } from "./openai-client";
import type { CompiledPosterContent } from "./poster-prompt-builder";
import type { PosterScore } from "./score-poster";
import type { PosterTemplate } from "@/lib/constants/poster-templates";
import type { Brand, BrandReport, PosterTextMode } from "@prisma/client";
import { compilePosterContent } from "./poster-prompt-builder";
import { generatePosterImage } from "./image-generation";

export type RegenerateTarget =
  | "headline"
  | "cta"
  | "plan"
  | "image"
  | "full";

/**
 * Decides the smallest useful regeneration target from a score.
 */
export function decideRegenerateTarget(score: PosterScore): RegenerateTarget {
  if (score.overall < 65) return "full";

  const critical = [
    score.hierarchy < 60,
    score.brandFit < 60,
    score.composition < 60,
  ].filter(Boolean).length;

  if (critical >= 2) return "full";
  if (score.composition < 65 || score.hierarchy < 65) return "plan";
  if (score.readability < 68) return "headline";
  if (score.ctaClarity < 68) return "cta";

  return "plan";
}

/**
 * Regenerates only the weak part of an existing poster plan.
 */
export async function regeneratePosterParts(options: {
  target: RegenerateTarget;
  caption: string;
  brand: Brand | null;
  report: BrandReport | null;
  textMode: PosterTextMode;
  template: PosterTemplate;
  existing: CompiledPosterContent;
  score: PosterScore;
}): Promise<{
  content: CompiledPosterContent;
  newImageBase64?: string | null;
  target: RegenerateTarget;
}> {
  const { target, caption, brand, report, textMode, template, existing, score } =
    options;

  // Full replan or plan-only
  if (target === "full" || target === "plan") {
    const content = await compilePosterContent(
      caption,
      brand,
      report,
      textMode,
      template,
    );

    let newImageBase64: string | null | undefined = undefined;

    if (target === "full" && content.imagePrompt) {
      newImageBase64 = await generatePosterImage({
        prompt: content.imagePrompt,
        businessType: brand?.businessType,
        visualStyle: content.visualStyle,
        imageMood: content.imageMood,
        hierarchy: content.hierarchy,
        colors: report?.colors ?? [],
      });
    }

    return { content, newImageBase64, target };
  }

  // Image only
  if (target === "image") {
    if (!existing.imagePrompt || template.backgroundMode !== "PHOTO") {
      return { content: existing, newImageBase64: null, target };
    }

    const newImageBase64 = await generatePosterImage({
      prompt: existing.imagePrompt,
      businessType: brand?.businessType,
      visualStyle: existing.visualStyle,
      imageMood: existing.imageMood,
      hierarchy: existing.hierarchy,
      colors: report?.colors ?? [],
    });

    return { content: existing, newImageBase64, target };
  }

  // Headline only
  if (target === "headline") {
    const updated = await regenerateHeadlineOnly({
      caption,
      brand,
      existing,
      issues: score.issues,
    });
    return {
      content: { ...existing, ...updated },
      target,
    };
  }

  // CTA only
  if (target === "cta") {
    const ctaSuggestion = await regenerateCtaOnly({
      caption,
      brand,
      existing,
      issues: score.issues,
    });
    return {
      content: { ...existing, ctaSuggestion },
      target,
    };
  }

  return { content: existing, target };
}

// ── Helpers ─────────────────────────────────────────────────────

async function regenerateHeadlineOnly(options: {
  caption: string;
  brand: Brand | null;
  existing: CompiledPosterContent;
  issues: string[];
}): Promise<Pick<CompiledPosterContent, "headline" | "subheadline">> {
  const { caption, brand, existing, issues } = options;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior copywriter. Rewrite only the headline and subheadline for a marketing poster.

Respond with ONLY valid JSON:
{
  "headline": "3-7 word punchy headline, title case",
  "subheadline": "one short supporting line, max 14 words (empty string if not needed)"
}

Rules:
- Do not copy the caption verbatim.
- Fix the specific issues mentioned.
- Keep the same campaign goal and tone.
- Make the headline stronger and more scannable.`,
      },
      {
        role: "user",
        content: `Caption: ${caption}
Brand: ${brand?.brandName ?? "Unknown"} (${brand?.businessType ?? "Unknown"})
Current headline: ${existing.headline}
Current subheadline: ${existing.subheadline || "(none)"}
Concept: ${existing.concept}
Issues to fix: ${issues.join("; ") || "headline feels weak"}

Rewrite headline + subheadline only.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: any = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  return {
    headline: parsed.headline ?? existing.headline,
    subheadline: parsed.subheadline ?? existing.subheadline,
  };
}

async function regenerateCtaOnly(options: {
  caption: string;
  brand: Brand | null;
  existing: CompiledPosterContent;
  issues: string[];
}): Promise<string> {
  const { caption, brand, existing, issues } = options;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You write short, strong calls-to-action for marketing posters.

Respond with ONLY valid JSON:
{ "ctaSuggestion": "2-4 word CTA" }

Make it clear, action-oriented, and appropriate for the brand.`,
      },
      {
        role: "user",
        content: `Caption: ${caption}
Brand type: ${brand?.businessType ?? "Unknown"}
Headline: ${existing.headline}
Campaign goal: ${existing.campaignGoal}
Current CTA: ${existing.ctaSuggestion}
Issues: ${issues.join("; ") || "CTA is weak"}

Give a better CTA.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: any = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  return parsed.ctaSuggestion ?? existing.ctaSuggestion;
}
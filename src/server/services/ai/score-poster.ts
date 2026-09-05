// src/server/services/ai/score-poster.ts
import { openai } from "./openai-client";
import type { CompiledPosterContent } from "./poster-prompt-builder";
import type { PosterTemplate } from "@/lib/constants/poster-templates";
import type { Brand } from "@prisma/client";

export interface PosterScore {
  overall: number; // 0–100
  hierarchy: number;
  readability: number;
  brandFit: number;
  marketingStrength: number;
  composition: number;
  ctaClarity: number;
  issues: string[];       // concrete problems
  strengths: string[];    // what worked
  shouldRegenerate: boolean;
  regenerateReason?: string;
}

/**
 * Reviews a completed poster plan and returns a structured quality score.
 * Used after compilePosterContent + template selection.
 */
export async function scorePosterPlan(options: {
  caption: string;
  brand: Brand | null;
  template: PosterTemplate;
  content: CompiledPosterContent;
}): Promise<PosterScore> {
  const { caption, brand, template, content } = options;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior creative director reviewing a marketing poster plan before it goes live.

Score the plan honestly on these dimensions (0–100 each):
- hierarchy: Does the visual hierarchy make the most important message dominate?
- readability: Is the headline scannable and strong? Is secondary text under control?
- brandFit: Does the concept, tone, and style match the brand and business type?
- marketingStrength: Will this actually drive the intended action (awareness / conversion / etc.)?
- composition: Do layout choice, spacing mood, and image direction work together?
- ctaClarity: Is the call-to-action clear and appropriately emphasized?

Then give an overall score (weighted average, be strict).

Respond with ONLY valid JSON:
{
  "overall": number,
  "hierarchy": number,
  "readability": number,
  "brandFit": number,
  "marketingStrength": number,
  "composition": number,
  "ctaClarity": number,
  "issues": ["short concrete problem", ...],
  "strengths": ["short concrete strength", ...],
  "shouldRegenerate": boolean,
  "regenerateReason": "one sentence if shouldRegenerate is true, otherwise empty string"
}

Rules:
- Be strict. A mediocre plan should score 60–75.
- Only mark shouldRegenerate: true if overall < 72 OR a critical dimension is below 60.
- Never invent problems that aren't visible in the plan.
- Prefer actionable issues ("Headline is too long and weak" not "Could be better").`,
      },
      {
        role: "user",
        content: `ORIGINAL CAPTION:
${caption}

BRAND:
- Name: ${brand?.brandName ?? "Unknown"}
- Business type: ${brand?.businessType ?? "Unknown"}
- Tone: ${brand?.tone ?? "Neutral"}

TEMPLATE CHOSEN:
- id: ${template.id}
- name: ${template.name}
- layout: ${template.layout}
- background: ${template.backgroundMode}

CREATIVE PLAN:
- Concept: ${content.concept}
- Strategy: ${content.creativeStrategy}
- Campaign goal: ${content.campaignGoal}
- Visual style: ${content.visualStyle}
- Hierarchy: ${content.hierarchy}
- Image focus: ${content.imageFocus}
- Spacing mood: ${content.spacingMood}
- CTA emphasis: ${content.ctaEmphasis}
- Image mood: ${content.imageMood}

COPY:
- Headline: ${content.headline}
- Subheadline: ${content.subheadline || "(none)"}
- Bullets: ${content.bullets.length ? content.bullets.join(" | ") : "(none)"}
- CTA suggestion: ${content.ctaSuggestion}

Review this plan and score it.`,
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

  const overall = clamp(parsed.overall ?? 75);
  const shouldRegenerate =
    typeof parsed.shouldRegenerate === "boolean"
      ? parsed.shouldRegenerate
      : overall < 72;

  return {
    overall,
    hierarchy: clamp(parsed.hierarchy ?? 75),
    readability: clamp(parsed.readability ?? 75),
    brandFit: clamp(parsed.brandFit ?? 75),
    marketingStrength: clamp(parsed.marketingStrength ?? 75),
    composition: clamp(parsed.composition ?? 75),
    ctaClarity: clamp(parsed.ctaClarity ?? 75),
    issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 5) : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
    shouldRegenerate,
    regenerateReason: parsed.regenerateReason || undefined,
  };
}

function clamp(n: number): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 70;
  return Math.max(0, Math.min(100, Math.round(n)));
}
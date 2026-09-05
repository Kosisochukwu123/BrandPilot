// src/server/services/ai/poster-prompt-builder.ts
import { openai } from "./openai-client";
import type { Brand, BrandReport, PosterTextMode } from "@prisma/client";
import type { PosterTemplate } from "@/lib/constants/poster-templates";

export interface CompiledPosterContent {
  // ── Creative Strategy (new) ──────────────────────────────────
  concept: string;                 // one-sentence creative concept
  creativeStrategy: string;        // short strategy explanation
  campaignGoal: "awareness" | "conversion" | "engagement" | "launch" | "promotion";

  // ── Design decisions ─────────────────────────────────────────
  visualStyle: "minimal" | "bold" | "luxury" | "energetic" | "clean" | "warm" | "editorial";
  hierarchy: "headline-dominant" | "image-dominant" | "balanced" | "offer-dominant";
  imageFocus: "product" | "lifestyle" | "person" | "environment" | "abstract" | "none";
  spacingMood: "airy" | "compact" | "dramatic";
  ctaEmphasis: "high" | "medium" | "low";
  decorationHints: string[];

  // ── Copy ─────────────────────────────────────────────────────
  headline: string;
  subheadline: string;
  bullets: string[];
  ctaSuggestion: string;           // AI can now suggest a better CTA

  // ── Image ────────────────────────────────────────────────────
  imagePrompt: string | null;
  imageMood: string;               // e.g. "cinematic warm", "bright airy", "dark moody"

  // ── Meta ─────────────────────────────────────────────────────
  matchScore: number;
  recommendedPlatform: string;
  engagementLevel: string;
  explanationPoints: string[];
}

const PLANNER_SYSTEM_PROMPT = `You are the Creative Director of a high-end marketing agency.

Your job is to plan a single professional marketing poster from start to finish.

You must think in this exact order and never skip steps:

1. Understand the brand, business type, tone, and the caption's real intent.
2. Decide the campaign goal (awareness / conversion / engagement / launch / promotion).
3. Invent a clear one-sentence creative concept.
4. Choose the visual strategy (style, hierarchy, image focus, spacing, CTA strength, decorations).
5. Only then write the headline, subheadline, bullets, and CTA.
6. Finally write a detailed, high-end image direction (if a photo is needed).

Respond with ONLY a valid JSON object (no markdown, no extra text):

{
  "campaignGoal": "awareness" | "conversion" | "engagement" | "launch" | "promotion",
  "concept": "One clear sentence describing the creative idea behind this poster",
  "creativeStrategy": "2-3 sentences explaining why this approach will work for this brand and caption",

  "visualStyle": "minimal" | "bold" | "luxury" | "energetic" | "clean" | "warm" | "editorial",
  "hierarchy": "headline-dominant" | "image-dominant" | "balanced" | "offer-dominant",
  "imageFocus": "product" | "lifestyle" | "person" | "environment" | "abstract" | "none",
  "spacingMood": "airy" | "compact" | "dramatic",
  "ctaEmphasis": "high" | "medium" | "low",
  "decorationHints": ["soft-gradient-overlay", "glass-panel", "subtle-shadow", "accent-shape", "light-flare"],

  "headline": "3-7 word punchy headline in title case. Never copy the caption.",
  "subheadline": "One short supporting line, max 14 words. Empty string if the design should stay minimal.",
  "bullets": ["short phrase", ...],  // 0-4 items. Prefer empty for luxury / minimal / image-dominant.
  "ctaSuggestion": "Short strong call-to-action (2-4 words)",

  "subject": "Concrete visual subject for the background photo",
  "imageMood": "Short mood description, e.g. 'cinematic warm lighting', 'bright airy', 'dark dramatic', 'soft editorial'",

  "matchScore": number (70-95),
  "recommendedPlatform": "Instagram" | "Facebook" | "LinkedIn" | "X",
  "engagementLevel": "High" | "Medium" | "Low",
  "explanationPoints": [
    "4-6 short bullets that explain the key creative decisions and why they fit this brand + caption"
  ]
}

Rules:
- Be decisive. A real creative director does not hedge.
- Short, punchy, sales-oriented captions → favor offer-dominant or headline-dominant + high CTA emphasis.
- Long / educational / service captions → favor balanced or image-dominant with more breathing room.
- Luxury, fashion, beauty → lean minimal, editorial, or luxury with airy spacing.
- Fitness, energy, action → bold, dramatic, high contrast.
- Never invent benefits that are not implied by the caption.
- Headlines must be scannable and strong.`;

export async function compilePosterContent(
  caption: string,
  brand: Brand | null,
  report: BrandReport | null,
  textMode: PosterTextMode,
  template: PosterTemplate,
): Promise<CompiledPosterContent> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: PLANNER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `CAPTION:
${caption}

BRAND CONTEXT:
- Name: ${brand?.brandName ?? "Unknown"}
- Business type: ${brand?.businessType ?? "Unknown"}
- Tone: ${brand?.tone ?? "Neutral"}
- Colors: ${report?.colors?.join(", ") || "not specified"}

TEMPLATE CONSTRAINTS (respect these):
- id: ${template.id}
- name: ${template.name}
- layout philosophy: ${template.layout}
- backgroundMode: ${template.backgroundMode}
- typography: ${JSON.stringify(template.typography)}
- image guidance: ${template.image ? JSON.stringify(template.image) : "none (color or gradient panel)"}
- button: ${template.button.style} / ${template.button.size}
- spacing: padding ${template.spacing.padding}px, gap ${template.spacing.gap}px
- decoration: ${JSON.stringify(template.decoration)}
- best suited for: ${template.suitableFor.join(", ") || "general"}

Act as Creative Director. First decide strategy and concept, then produce the poster plan.`,
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

  // ── Build a much stronger image prompt ─────────────────────────
  let imagePrompt: string | null = null;

  if (template.backgroundMode === "PHOTO") {
    const colorDirection = report?.colors?.length
      ? `Strictly use this brand color palette as accents only: ${report.colors.join(", ")}.`
      : "";

    const textInstruction =
      textMode === "OVERLAY"
        ? "Absolutely no text, letters, numbers, logos, or watermarks anywhere in the image. Leave clean, intentional negative space for later text overlay."
        : `Render the exact headline "${parsed.headline ?? ""}" once, large, clean, and perfectly legible.`;

    const style = parsed.visualStyle ?? "clean";
    const focus = parsed.imageFocus ?? template.image?.crop ?? "lifestyle";
    const mood = parsed.imageMood ?? "professional cinematic lighting";
    const hierarchy = parsed.hierarchy ?? "balanced";

    imagePrompt = [
      `Award-winning commercial advertising photography, square 1:1 aspect ratio.`,
      `Creative concept: ${parsed.concept ?? "professional brand poster"}.`,
      `Subject: ${parsed.subject ?? caption.slice(0, 90)}.`,
      `Primary visual focus: ${focus}.`,
      `Overall style: ${style}.`,
      `Mood & lighting: ${mood}.`,
      `Composition must strongly support a ${hierarchy} visual hierarchy and leave clear space for headline and CTA.`,
      colorDirection,
      textInstruction,
      `Premium studio or location lighting, highly detailed, photorealistic, professional color grading.`,
      `No stock-photo look, no generic templates, no watermarks, no borders, no frames, no distorted anatomy, no extra limbs.`,
      `Original composition created specifically for this brand.`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return {
    // Strategy
    concept: parsed.concept ?? "Professional brand poster",
    creativeStrategy: parsed.creativeStrategy ?? "",
    campaignGoal: parsed.campaignGoal ?? "awareness",

    // Design
    visualStyle: parsed.visualStyle ?? "clean",
    hierarchy: parsed.hierarchy ?? "balanced",
    imageFocus: parsed.imageFocus ?? "lifestyle",
    spacingMood: parsed.spacingMood ?? "airy",
    ctaEmphasis: parsed.ctaEmphasis ?? "medium",
    decorationHints: Array.isArray(parsed.decorationHints) ? parsed.decorationHints : [],

    // Copy
    headline: parsed.headline ?? "New Arrival",
    subheadline: parsed.subheadline ?? "",
    bullets: Array.isArray(parsed.bullets) ? parsed.bullets : [],
    ctaSuggestion: parsed.ctaSuggestion ?? "Learn More",

    // Image
    imagePrompt,
    imageMood: parsed.imageMood ?? "professional",

    // Meta
    matchScore: typeof parsed.matchScore === "number" ? parsed.matchScore : 80,
    recommendedPlatform: parsed.recommendedPlatform ?? "Instagram",
    engagementLevel: parsed.engagementLevel ?? "Medium",
    explanationPoints: Array.isArray(parsed.explanationPoints) ? parsed.explanationPoints : [],
  };
}
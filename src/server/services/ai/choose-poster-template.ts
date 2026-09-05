// src/server/services/ai/choose-poster-template.ts
import { openai } from "./openai-client";
import {
  POSTER_TEMPLATES,
  type PosterTemplate,
} from "@/lib/constants/poster-templates";
import type { Brand } from "@prisma/client";

/**
 * Asks the AI to choose the best template for this caption + brand.
 * Returns a real PosterTemplate object.
 * Falls back to the first matching template if parsing fails.
 */
export async function choosePosterTemplate(options: {
  caption: string;
  brand: Brand | null;
  excludeIds?: string[];
}): Promise<PosterTemplate> {
  const { caption, brand, excludeIds = [] } = options;

  // Only offer templates that haven't been shown yet (if any remain)
  const available = POSTER_TEMPLATES.filter((t) => !excludeIds.includes(t.id));
  const pool = available.length > 0 ? available : POSTER_TEMPLATES;

  // Build a compact catalog the AI can read
  const catalog = pool
    .map(
      (t) =>
        `- id: "${t.id}" | name: ${t.name} | layout: ${t.layout} | best for: ${t.suitableFor.join(", ") || "general"} | background: ${t.backgroundMode}`,
    )
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior art director. Your only job is to choose the single best poster template for the given caption and brand.

Respond with ONLY valid JSON:
{
  "templateId": "exact-id-from-the-list",
  "reason": "one short sentence explaining why this template fits"
}

Rules:
- Prefer templates whose suitableFor matches the business type.
- For SaaS, local services, coaching, studios, agencies, and promo/sale captions: strongly prefer graphic layouts (graphic-bold, graphic-split, graphic-offer, graphic-type, centered-badge, saas-clean, sale-burst, corporate-trust) over lifestyle photo templates.
- Only choose pure PHOTO templates when the caption clearly needs product, food, fashion model, property, or event photography.
- Short promotional / sale captions → favor graphic-offer, sale-burst, or graphic-bold.
- Luxury / fashion / beauty → prefer minimal-luxury, editorial, dark-premium, beauty-soft, magazine-cover.
- Food / restaurant → prefer restaurant-promo or photo-hero.
- SaaS / software / studios → prefer graphic-bold, graphic-type, graphic-split, saas-clean, tech-grid, centered-badge.
- Fitness / energy → prefer bold-action, diagonal-energy, or graphic-bold.
- Never invent an id. Only use an id that appears in the list.`,
      },
      {
        role: "user",
        content: `CAPTION:
${caption}

BRAND:
- Name: ${brand?.brandName ?? "Unknown"}
- Business type: ${brand?.businessType ?? "Unknown"}
- Tone: ${brand?.tone ?? "Neutral"}

AVAILABLE TEMPLATES:
${catalog}

Choose the single best templateId.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: { templateId?: string } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const chosen =
    pool.find((t) => t.id === parsed.templateId) ??
    pool.find((t) =>
      brand?.businessType ? t.suitableFor.includes(brand.businessType) : true,
    ) ??
    pool[0];

  return chosen;
}

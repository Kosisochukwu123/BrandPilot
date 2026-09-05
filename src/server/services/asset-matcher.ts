// src/server/services/asset-matcher.ts
// Finds the best-fit background/object from the library for a given
// brand — this is what generatePosterVariations calls BEFORE falling
// back to fresh AI image generation. Ranks by overlap: business type
// match is weighted highest, tone/style match second.
import { db } from "@/lib/db";
import type { Brand, BrandReport } from "@prisma/client";

function toneToStyleTags(tone: string | null): string[] {
  const map: Record<string, string[]> = {
    "Professional": ["clean", "minimal", "corporate"],
    "Friendly & Casual": ["warm", "approachable"],
    "Playful & Fun": ["vibrant", "energetic"],
    "Luxury & Premium": ["luxurious", "elegant", "dark"],
    "Bold & Energetic": ["bold", "energetic", "vibrant"],
    "Minimal & Calm": ["minimal", "airy", "calm"],
  };
  return tone ? map[tone] ?? [] : [];
}

async function findBestAsset(
  type: "BACKGROUND" | "OBJECT",
  brand: Brand | null
) {
  const styleTags = toneToStyleTags(brand?.tone ?? null);
  const businessType = brand?.businessType ?? null;

  const candidates = await db.posterAsset.findMany({ where: { type } });
  if (candidates.length === 0) return null;

  // Score each candidate: +3 per matching business type, +1 per matching style tag
  const scored = candidates.map((asset) => {
    let score = 0;
    if (businessType && asset.businessTypes.includes(businessType)) score += 3;
    score += asset.styleTags.filter((t) => styleTags.includes(t)).length;
    return { asset, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Require at least SOME match — a completely unrelated asset (score 0)
  // is worse than falling back to fresh AI generation.
  const best = scored[0];
  if (!best || best.score === 0) return null;

  return best.asset;
}

export async function findBestBackground(brand: Brand | null) {
  return findBestAsset("BACKGROUND", brand);
}

export async function findBestObject(brand: Brand | null) {
  return findBestAsset("OBJECT", brand);
}

// Called when generation falls back to fresh AI image creation — saves
// the new image into the library, tagged, so the library grows itself
// over time instead of regenerating similar images repeatedly.
export async function seedLibraryFromGeneration(
  imageUrl: string,
  brand: Brand | null,
  styleTags: string[]
) {
  await db.posterAsset.create({
    data: {
      type: "BACKGROUND",
      imageUrl,
      description: `AI-generated background for ${brand?.businessType ?? "general use"}`,
      businessTypes: brand?.businessType ? [brand.businessType] : [],
      styleTags,
      colorTags: [],
      transparent: false,
      source: "AI_SEEDED",
    },
  });
}

// Finds up to 2 reference posters matching the brand's business type/tone —
// these guide the image model's visual style, not its content. Fewer,
// well-matched references beat many loosely-related ones.
export async function findReferencePosters(brand: Brand | null, limit = 2) {
  const styleTags = toneToStyleTags(brand?.tone ?? null);
  const businessType = brand?.businessType ?? null;

  const candidates = await db.posterAsset.findMany({ where: { type: "POSTER_REFERENCE" } });
  if (candidates.length === 0) return [];

  const scored = candidates.map((asset) => {
    let score = 0;
    if (businessType && asset.businessTypes.includes(businessType)) score += 3;
    score += asset.styleTags.filter((t) => styleTags.includes(t)).length;
    return { asset, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.asset);
}
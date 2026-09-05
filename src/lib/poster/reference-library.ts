// src/lib/poster/reference-library.ts

export interface ReferenceEntry {
  /** Path relative to public/poster-references/ */
  path: string;
  businessTypes: string[]; // match Brand.businessType values when possible
  style: string; // luxury | bold | minimal | editorial | corporate | graphic
  mood: string; // elegant | energetic | warm | dark | clean
  tags: string[];
}

/**
 * Curated reference library.
 * Add more entries as you add images under public/poster-references/
 */
export const REFERENCE_LIBRARY: ReferenceEntry[] = [
  {
    path: "studio/01.png",
    businessTypes: [
      "SaaS / Software",
      "Local Service Business",
      "Education / Coaching",
    ],
    style: "corporate",
    mood: "clean",
    tags: ["studio", "agency", "services"],
  },
  {
    path: "studio/02.png",
    businessTypes: [
      "SaaS / Software",
      "Local Service Business",
      "Education / Coaching",
    ],
    style: "minimal",
    mood: "elegant",
    tags: ["studio", "agency"],
  },
  {
    path: "studio/03.png",
    businessTypes: [
      "SaaS / Software",
      "Local Service Business",
      "Fashion & Apparel",
    ],
    style: "bold",
    mood: "clean",
    tags: ["studio", "modern"],
  },
  // Add more as you create folders, e.g.:
  // { path: "real-estate/01.png", businessTypes: ["Real Estate"], style: "luxury", mood: "elegant", tags: ["property"] },
];

/**
 * Picks up to `limit` references for this business type.
 * Falls back to any refs if nothing matches.
 */
export function pickReferences(
  businessType: string | null | undefined,
  limit = 3,
): ReferenceEntry[] {
  const type = businessType?.trim() || null;

  const matching = type
    ? REFERENCE_LIBRARY.filter((r) => r.businessTypes.includes(type))
    : [];

  const pool = matching.length > 0 ? matching : [...REFERENCE_LIBRARY];

  // Shuffle lightly so regenerate isn't always identical
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.min(limit, shuffled.length));
}
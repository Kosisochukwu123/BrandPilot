// src/server/services/poster/pick-poster-references.ts
import { db } from "@/lib/db";
import { pickReferences as pickStaticReferences } from "@/lib/poster/reference-library";

export type PickedReference = {
  id?: string;
  /** Local path under public/poster-references OR a full https URL */
  pathOrUrl: string;
  source: "db" | "static";
};

/**
 * Prefers admin-uploaded POSTER_REFERENCE assets.
 * Falls back to static REFERENCE_LIBRARY if DB has none.
 */
export async function pickPosterReferences(
  businessType: string | null | undefined,
  limit = 3,
): Promise<PickedReference[]> {
  const type = businessType?.trim() || null;

  // 1) DB assets
  const dbAssets = await db.posterAsset.findMany({
    where: {
      type: "POSTER_REFERENCE",
      ...(type
        ? {
            OR: [
              { businessTypes: { has: type } },
              { businessTypes: { isEmpty: true } }, // generic refs
            ],
          }
        : {}),
    },
    orderBy: [{ usageCount: "desc" }, { createdAt: "desc" }],
    take: 24,
  });

  if (dbAssets.length > 0) {
    // Light shuffle among top candidates
    const shuffled = [...dbAssets].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(limit, shuffled.length));

    // Bump usageCount (fire-and-forget)
    void Promise.all(
      chosen.map((a) =>
        db.posterAsset.update({
          where: { id: a.id },
          data: { usageCount: { increment: 1 } },
        }),
      ),
    );

    return chosen.map((a) => ({
      id: a.id,
      pathOrUrl: a.imageUrl,
      source: "db" as const,
    }));
  }

  // 2) Static fallback
  const staticRefs = pickStaticReferences(type, limit);
  return staticRefs.map((r) => ({
    pathOrUrl: r.path,
    source: "static" as const,
  }));
}
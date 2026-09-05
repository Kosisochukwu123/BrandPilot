// src/server/services/brand-context.ts
// Single place that answers "what does this user's Brand Brain know" —
// used anywhere a feature needs to stop asking for brand info the user
// already gave once (Content Generator, Poster Generator, and later the
// AI Assistant all call this same function).
import { db } from "@/lib/db";

export async function getBrandContext(userId: string) {
  const brand = await db.brand.findFirst({ where: { userId } });
  if (!brand) return { brand: null, report: null };

  const report = await db.brandReport.findFirst({
    where: { brandId: brand.id },
    orderBy: { createdAt: "desc" },
  });

  return { brand, report };
}
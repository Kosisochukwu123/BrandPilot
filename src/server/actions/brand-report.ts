// src/server/actions/brand-report.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { logActivity } from "@/server/services/activity-log";
import { buildBrandReport } from "@/server/services/ai/brand-report-builder";
import { revalidatePath } from "next/cache";

type GenerateBrandReportResult =
  | { success: true; data: { reportId: string } }
  | { success: false; error: string };

export async function generateBrandReport(): Promise<GenerateBrandReportResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const brand = await db.brand.findFirst({
    where: { userId: session.user.id },
  });
  if (!brand)
    return { success: false, error: "Set up your brand preferences first" };

  try {
    const report = await buildBrandReport(brand);

    const saved = await db.brandReport.create({
      data: {
        brandId: brand.id,
        score: report.score,
        scoreExplanation: report.scoreExplanation,
        summary: report.summary,
        audienceRatings: report.audienceRatings,
        personality: report.personality,
        voiceTags: report.voiceTags,
        colors: report.colors,
        typography: report.typography,
        contentPillars: report.contentPillars,
        platformRankings: report.platformRankings,
        opportunities: report.opportunities,
      },
    });

    await logActivity(
      session.user.id,
      "BRAND_BRAIN_UPDATED",
      "Brand Brain updated",
    );

    revalidatePath("/dashboard/brand/report");
    return { success: true, data: { reportId: saved.id } };
  } catch (err) {
    logger.error("Brand report generation failed", {
      userId: session.user.id,
      error: String(err),
    });
    return {
      success: false,
      error: "Couldn't build your Brand Brain report. Please try again.",
    };
  }
}

export async function getLatestBrandReport(userId: string) {
  const brand = await db.brand.findFirst({ where: { userId } });
  if (!brand) return null;

  return db.brandReport.findFirst({
    where: { brandId: brand.id },
    orderBy: { createdAt: "desc" },
  });
}

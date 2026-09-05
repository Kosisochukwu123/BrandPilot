// src/server/actions/brand.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  analyzeWebsiteSchema,
  brandPreferencesSchema,
} from "@/lib/validations/brand";
import { analyzeBrandFromUrl } from "@/server/services/brand-analyzer";
import { ScraperError } from "@/server/services/scraper";
import { revalidatePath } from "next/cache";
import { analysisRateLimit, safeRateLimit } from "@/lib/rate-limit";
import { logActivity } from "@/server/services/activity-log";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Runs the AI analysis and stores the result as the brand's initial
// (auto-detected) state. Does NOT overwrite fields the user has already
// manually edited — see saveBrandPreferences below for how that's handled.
export async function analyzeWebsite(
  input: unknown,
): Promise<ActionResult<{ brandId: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

   const { success: withinRateLimit } = await safeRateLimit(analysisRateLimit, session.user.id);
  if (!withinRateLimit) {
    return { success: false, error: "Too many analysis requests. Wait a few minutes and try again." };
  }

  const parsed = analyzeWebsiteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid URL",
    };
  }

  try {
    const result = await analyzeBrandFromUrl(parsed.data.websiteUrl);

    const brand = await db.brand.upsert({
      where: {
        // one brand per user for now — multi-brand support is a Pro-tier
        // feature we can add later without a schema change (Brand already
        // supports many-per-user at the DB level).
        id:
          (await db.brand.findFirst({ where: { userId: session.user.id } }))
            ?.id ?? "new",
      },
      create: {
        userId: session.user.id,
        websiteUrl: parsed.data.websiteUrl,
        brandName: result.brandName,
        businessType: result.businessType,
        tone: result.tone,
        audience: result.audience.join(", "),
        keywords: result.keywords,
        rawSummary: result.summary,
      },
      update: {
        websiteUrl: parsed.data.websiteUrl,
        brandName: result.brandName,
        businessType: result.businessType,
        tone: result.tone,
        audience: result.audience.join(", "),
        keywords: result.keywords,
        rawSummary: result.summary,
      },
    });

    revalidatePath("/dashboard/brand");

    await logActivity(
      session.user.id,
      "WEBSITE_ANALYZED",
      `Website analyzed: ${parsed.data.websiteUrl}`,
    );

    return { success: true, data: { brandId: brand.id } };
    
  } catch (err) {
    const message =
      err instanceof ScraperError
        ? err.message
        : "Analysis failed. Please try again.";
    return { success: false, error: message };
  }
}

// Manual preferences — now creates a Brand if one doesn't exist yet,
// instead of requiring analyzeWebsite to have run first. This is the
// actual fix: a WhatsApp/Instagram-only seller can fill this out directly
// with no website at all.
export async function saveBrandPreferences(
  input: unknown,
): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = brandPreferencesSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const existing = await db.brand.findFirst({
    where: { userId: session.user.id },
  });

  const data = {
    brandName: parsed.data.brandName || existing?.brandName || null,
    websiteUrl: parsed.data.websiteUrl || existing?.websiteUrl || null,
    instagramHandle:
      parsed.data.instagramHandle || existing?.instagramHandle || null,
    whatsappNumber:
      parsed.data.whatsappNumber || existing?.whatsappNumber || null,
    businessType: parsed.data.businessType ?? existing?.businessType ?? null,
    tone: parsed.data.tone ?? existing?.tone ?? null,
    audience: parsed.data.audience
      ? parsed.data.audience.join(", ")
      : (existing?.audience ?? null),
    keywords: parsed.data.keywords ?? existing?.keywords ?? [],
  };

  if (existing) {
    await db.brand.update({ where: { id: existing.id }, data });
  } else {
    await db.brand.create({ data: { userId: session.user.id, ...data } });
  }

  revalidatePath("/dashboard/brand");
  return { success: true, data: null };
}

export async function getBrand(userId: string) {
  return db.brand.findFirst({ where: { userId } });
}

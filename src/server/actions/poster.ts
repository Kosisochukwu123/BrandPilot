// src/server/actions/poster.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { compilePosterContent } from "@/server/services/ai/poster-prompt-builder";
import { generatePosterImage } from "@/server/services/ai/image-generation";
import { uploadBase64Image } from "@/server/services/cloudinary";
import { getBrandContext } from "@/server/services/brand-context";
import { generationRateLimit, safeRateLimit } from "@/lib/rate-limit";
import { assertUnderLimit, incrementUsage } from "@/server/services/usage";
import { logActivity } from "@/server/services/activity-log";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

import { planReferencePoster } from "@/server/services/ai/reference-poster-director";

import { pickReferences } from "@/lib/poster/reference-library";

import { findReferencePosters } from "@/server/services/asset-matcher";
import { loadReferenceImagesFromUrls } from "@/server/services/ai/load-reference-images";

import { scorePosterPlan } from "@/server/services/ai/score-poster";
import { choosePosterTemplate } from "@/server/services/ai/choose-poster-template";
import { pickTemplate } from "@/lib/constants/poster-templates";

import { generatePosterFromReferences } from "@/server/services/ai/image-generation";
import { loadReferenceImages } from "@/server/services/ai/load-reference-images";
// import { uploadBase64Image } from "@/server/services/cloudinary";

import {
  findBestBackground,
  seedLibraryFromGeneration,
} from "@/server/services/asset-matcher";

import {
  decideRegenerateTarget,
  regeneratePosterParts,
} from "@/server/services/ai/regenerate-poster-parts";
// import { scorePosterPlan } from "@/server/services/ai/score-poster";
import { POSTER_TEMPLATES } from "@/lib/constants/poster-templates";
import type { CompiledPosterContent } from "@/server/services/ai/poster-prompt-builder";

import type { PosterTextMode } from "@prisma/client";
import { pickPosterReferences } from "../services/poster/pick-poster-references";

const DEFAULT_CTA_BY_TYPE: Record<string, string> = {
  "E-commerce / Retail": "Shop Now",
  "SaaS / Software": "Try It Free",
  "Local Service Business": "Book Now",
  "Restaurant / Food & Beverage": "Order Now",
  "Health & Wellness": "Book a Session",
  "Fashion & Apparel": "Shop the Look",
  "Beauty & Cosmetics": "Shop Now",
  "Real Estate": "Schedule a Viewing",
  "Education / Coaching": "Enroll Today",
};

export async function generatePosterVariations(input: {
  caption: string;
  contentId?: string;
  textMode: PosterTextMode;
  excludeTemplateIds?: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const { success: withinRateLimit } = await safeRateLimit(
    generationRateLimit,
    session.user.id,
  );
  if (!withinRateLimit) {
    return {
      success: false,
      error: "Too many requests, try again in a moment.",
    };
  }

  try {
    await assertUnderLimit(session.user.id);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Limit reached",
    };
  }

  const { brand, report } = await getBrandContext(session.user.id);

  const excludeIds = input.excludeTemplateIds ?? [];

  const primaryTemplate = await choosePosterTemplate({
    caption: input.caption,
    brand,
    excludeIds,
  });

  const secondaryTemplate = await choosePosterTemplate({
    caption: input.caption,
    brand,
    excludeIds: [...excludeIds, primaryTemplate.id],
  });

  const templatesToGenerate =
    primaryTemplate.id === secondaryTemplate.id
      ? [primaryTemplate]
      : [primaryTemplate, secondaryTemplate];

  const batchId = crypto.randomUUID();

  const results: {
    posterId: string;
    templateName: string;
    design: {
      concept: string;
      creativeStrategy: string;
      campaignGoal: string;
      visualStyle: string; // ← must be visualStyle, NOT POSTER_TEMPLATES
      hierarchy: string;
      imageFocus: string;
      spacingMood: string;
      ctaEmphasis: string;
      decorationHints: string[];
      imageMood: string;
      ctaSuggestion: string;
    };
    score?: {
      overall: number;
      shouldRegenerate: boolean;
      issues: string[];
      strengths: string[];
    };
  }[] = [];

  for (const template of templatesToGenerate) {
    const poster = await db.poster.create({
      data: {
        userId: session.user.id,
        contentId: input.contentId,
        textMode: input.textMode,
        headline: "",
        imagePrompt: "",
        status: "GENERATING",
        batchId,
        variationLabel: template.name,
        templateId: template.id,
      },
    });

    try {
      const content = await compilePosterContent(
        input.caption,
        brand,
        report,
        input.textMode,
        template,
      );

      const score = await scorePosterPlan({
        caption: input.caption,
        brand,
        template,
        content,
      });

      let backgroundUrl: string | null = null;

      if (template.backgroundMode === "PHOTO") {
        const libraryMatch = await findBestBackground(brand);

        if (libraryMatch) {
          // Tier 1: exact background already in the library — cheapest, fastest.
          backgroundUrl = libraryMatch.imageUrl;
          await db.posterAsset.update({
            where: { id: libraryMatch.id },
            data: { usageCount: { increment: 1 } },
          });
        } else {
          const references = await findReferencePosters(brand, 2);

          if (references.length > 0 && content.imagePrompt) {
            // Tier 2: no exact background match, but we have style
            // references — generate guided by real examples instead of
            // pure text description.
            try {
              const referenceBuffers = await loadReferenceImagesFromUrls(
                references.map((r) => r.imageUrl),
              );

              const base64Image = await generatePosterFromReferences({
                prompt: content.imagePrompt,
                referenceImages: referenceBuffers,
                businessName: brand?.brandName ?? undefined,
                businessType: brand?.businessType ?? undefined,
                brandColors: report?.colors ?? [],
                noText: true,
                size: "1024x1024",
                inputFidelity: "low",
              });

              backgroundUrl = await uploadBase64Image(
                base64Image,
                `brandpilot/${session.user.id}`,
              );

              // Track that these references were used — helps future
              // ranking/popularity, same as background usageCount.
              await db.posterAsset.updateMany({
                where: { id: { in: references.map((r) => r.id) } },
                data: { usageCount: { increment: 1 } },
              });

              await seedLibraryFromGeneration(backgroundUrl, brand, [
                content.visualStyle,
              ]);
            } catch (err) {
              logger.error(
                "Reference-guided generation failed, falling back to plain prompt",
                {
                  error: err instanceof Error ? err.message : String(err),
                },
              );
              // Fall through to Tier 3 below.
            }
          }

          if (!backgroundUrl && content.imagePrompt) {
            // Tier 3: no library match, no references (or reference
            // generation failed) — plain text-to-image, same as before.
            const base64Image = await generatePosterImage({
              prompt: content.imagePrompt,
              businessType: brand?.businessType,
              visualStyle: content.visualStyle,
              imageMood: content.imageMood,
              hierarchy: content.hierarchy,
              colors: report?.colors ?? [],
            });
            backgroundUrl = await uploadBase64Image(
              base64Image,
              `brandpilot/${session.user.id}`,
            );
            await seedLibraryFromGeneration(backgroundUrl, brand, [
              content.visualStyle,
            ]);
          }
        }
      }

      await db.poster.update({
        where: { id: poster.id },
        data: {
          headline: content.headline,
          subheadline: content.subheadline,
          bullets: content.bullets,
          imagePrompt: content.imagePrompt ?? "",
          backgroundUrl,
          finalUrl: input.textMode === "BAKED_IN" ? backgroundUrl : null,
          status: "READY",
          matchScore: content.matchScore,
          recommendedPlatform: content.recommendedPlatform,
          engagementLevel: content.engagementLevel,
          explanationPoints: content.explanationPoints,

          concept: content.concept,
          creativeStrategy: content.creativeStrategy,
          campaignGoal: content.campaignGoal,
          ctaSuggestion: content.ctaSuggestion,
          imageMood: content.imageMood,
          visualStyle: content.visualStyle,
          hierarchy: content.hierarchy,
          imageFocus: content.imageFocus,
          spacingMood: content.spacingMood,
          ctaEmphasis: content.ctaEmphasis,
          decorationHints: content.decorationHints,
        },
      });

      await incrementUsage(session.user.id);

      results.push({
        posterId: poster.id,
        templateName: template.name,
        design: {
          concept: content.concept,
          creativeStrategy: content.creativeStrategy,
          campaignGoal: content.campaignGoal,
          visualStyle: content.visualStyle,
          hierarchy: content.hierarchy,
          imageFocus: content.imageFocus,
          spacingMood: content.spacingMood,
          ctaEmphasis: content.ctaEmphasis,
          decorationHints: content.decorationHints,
          imageMood: content.imageMood,
          ctaSuggestion: content.ctaSuggestion,
        },

        score: {
          overall: score.overall,
          shouldRegenerate: score.shouldRegenerate,
          issues: score.issues,
          strengths: score.strengths,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error("Poster template generation failed", {
        error: message,
        template: template.id,
      });
      await db.poster.update({
        where: { id: poster.id },
        data: { status: "FAILED", errorMessage: message },
      });
    }
  }

  await logActivity(
    session.user.id,
    "POSTER_GENERATED",
    "Poster variations generated",
  );
  revalidatePath("/dashboard/posters");
  revalidatePath("/dashboard");

  // Prefer AI-suggested CTA when available
  const aiCta = results[0]?.design.ctaSuggestion;
  const fallbackCta =
    DEFAULT_CTA_BY_TYPE[brand?.businessType ?? ""] ?? "Learn More";

  return {
    success: true,
    data: {
      batchId,
      posterIds: results.map((r) => r.posterId),
      templateIds: templatesToGenerate.map((t) => t.id),
      designs: results.map((r) => r.design),
      scores: results.map((r) => r.score),
      suggestedCta: aiCta || fallbackCta,
      brandName: brand?.brandName ?? null,
      instagramHandle: brand?.instagramHandle ?? null,
      websiteUrl: brand?.websiteUrl ?? null,
      colors: report?.colors ?? [],
    },
  };
}

export async function improvePoster(input: {
  posterId: string;
  caption: string;
  forceTarget?: "headline" | "cta" | "plan" | "image" | "full";
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const poster = await db.poster.findFirst({
    where: { id: input.posterId, userId: session.user.id },
  });
  if (!poster) return { success: false, error: "Poster not found" };

  const { brand, report } = await getBrandContext(session.user.id);
  const template =
    POSTER_TEMPLATES.find((t) => t.id === poster.templateId) ??
    POSTER_TEMPLATES[0];

  const existing: CompiledPosterContent = {
    concept: "",
    creativeStrategy: "",
    campaignGoal: "awareness",
    visualStyle: "clean",
    hierarchy: "balanced",
    imageFocus: "lifestyle",
    spacingMood: "airy",
    ctaEmphasis: "medium",
    decorationHints: [],
    headline: poster.headline,
    subheadline: poster.subheadline ?? "",
    bullets: poster.bullets ?? [],
    ctaSuggestion: "Learn More",
    imagePrompt: poster.imagePrompt || null,
    imageMood: "professional",
    matchScore: poster.matchScore ?? 80,
    recommendedPlatform: poster.recommendedPlatform ?? "Instagram",
    engagementLevel: poster.engagementLevel ?? "Medium",
    explanationPoints: poster.explanationPoints ?? [],
  };

  const score = await scorePosterPlan({
    caption: input.caption,
    brand,
    template,
    content: existing,
  });

  const target = input.forceTarget ?? decideRegenerateTarget(score);

  const {
    content,
    newImageBase64,
    target: usedTarget,
  } = await regeneratePosterParts({
    target,
    caption: input.caption,
    brand,
    report,
    textMode: poster.textMode,
    template,
    existing,
    score,
  });

  let backgroundUrl = poster.backgroundUrl;
  if (newImageBase64) {
    backgroundUrl = await uploadBase64Image(
      newImageBase64,
      `brandpilot/${session.user.id}`,
    );
  }

  await db.poster.update({
    where: { id: poster.id },
    data: {
      headline: content.headline,
      subheadline: content.subheadline,
      bullets: content.bullets,
      imagePrompt: content.imagePrompt ?? poster.imagePrompt,
      backgroundUrl,
      matchScore: content.matchScore,
      recommendedPlatform: content.recommendedPlatform,
      engagementLevel: content.engagementLevel,
      explanationPoints: content.explanationPoints,
    },
  });

  revalidatePath("/dashboard/posters");

  return {
    success: true,
    data: {
      posterId: poster.id,
      target: usedTarget,
      score: {
        overall: score.overall,
        shouldRegenerate: score.shouldRegenerate,
        issues: score.issues,
        strengths: score.strengths,
      },
      design: {
        concept: content.concept,
        creativeStrategy: content.creativeStrategy,
        campaignGoal: content.campaignGoal,
        visualStyle: content.visualStyle,
        hierarchy: content.hierarchy,
        imageFocus: content.imageFocus,
        spacingMood: content.spacingMood,
        ctaEmphasis: content.ctaEmphasis,
        decorationHints: content.decorationHints,
        imageMood: content.imageMood,
        ctaSuggestion: content.ctaSuggestion,
      },
      suggestedCta: content.ctaSuggestion,
    },
  };
}

// Legacy single-poster generation
export async function generatePoster(input: {
  caption: string;
  contentId?: string;
  textMode: PosterTextMode;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const { success: withinRateLimit } = await safeRateLimit(
    generationRateLimit,
    session.user.id,
  );
  if (!withinRateLimit) {
    return {
      success: false,
      error: "Too many requests, try again in a moment.",
    };
  }

  try {
    await assertUnderLimit(session.user.id);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Limit reached",
    };
  }

  const { brand, report } = await getBrandContext(session.user.id);
  const template = pickTemplate(brand?.businessType ?? null);

  const poster = await db.poster.create({
    data: {
      userId: session.user.id,
      contentId: input.contentId,
      textMode: input.textMode,
      headline: "",
      imagePrompt: "",
      status: "GENERATING",
      templateId: template.id,
      variationLabel: template.name,
    },
  });

  try {
    const content = await compilePosterContent(
      input.caption,
      brand,
      report,
      input.textMode,
      template,
    );

    let backgroundUrl: string | null = null;
    if (content.imagePrompt) {
      const base64Image = await generatePosterImage({
        prompt: content.imagePrompt,
        businessType: brand?.businessType,
        visualStyle: content.visualStyle,
        imageMood: content.imageMood,
        hierarchy: content.hierarchy,
        colors: report?.colors ?? [],
      });
      backgroundUrl = await uploadBase64Image(
        base64Image,
        `brandpilot/${session.user.id}`,
      );
    }

    await db.poster.update({
      where: { id: poster.id },
      data: {
        headline: content.headline,
        subheadline: content.subheadline,
        bullets: content.bullets,
        imagePrompt: content.imagePrompt ?? "",
        backgroundUrl,
        finalUrl: input.textMode === "BAKED_IN" ? backgroundUrl : null,
        status: "READY",
        matchScore: content.matchScore,
        recommendedPlatform: content.recommendedPlatform,
        engagementLevel: content.engagementLevel,
        explanationPoints: content.explanationPoints,
      },
    });

    await incrementUsage(session.user.id);
    await logActivity(session.user.id, "POSTER_GENERATED", "Poster generated");
    revalidatePath("/dashboard/posters");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        posterId: poster.id,
        design: {
          concept: content.concept,
          creativeStrategy: content.creativeStrategy,
          campaignGoal: content.campaignGoal,
          visualStyle: content.visualStyle,
          hierarchy: content.hierarchy,
          imageFocus: content.imageFocus,
          spacingMood: content.spacingMood,
          ctaEmphasis: content.ctaEmphasis,
          decorationHints: content.decorationHints,
          imageMood: content.imageMood,
          ctaSuggestion: content.ctaSuggestion,
        },
        suggestedCta:
          content.ctaSuggestion ||
          DEFAULT_CTA_BY_TYPE[brand?.businessType ?? ""] ||
          "Learn More",
        brandName: brand?.brandName ?? null,
        instagramHandle: brand?.instagramHandle ?? null,
        websiteUrl: brand?.websiteUrl ?? null,
        colors: report?.colors ?? [],
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("Poster generation failed", { error: message });
    await db.poster.update({
      where: { id: poster.id },
      data: { status: "FAILED", errorMessage: message },
    });
    return { success: false, error: message };
  }
}

export async function savePosterFinal(
  posterId: string,
  finalImageBase64: string,
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const poster = await db.poster.findFirst({
    where: { id: posterId, userId: session.user.id },
  });
  if (!poster) return { success: false, error: "Poster not found" };

  const finalUrl = await uploadBase64Image(
    finalImageBase64,
    `brandpilot/${session.user.id}/final`,
  );
  await db.poster.update({ where: { id: posterId }, data: { finalUrl } });

  revalidatePath("/dashboard/posters");
  return { success: true, data: { finalUrl } };
}

export async function listPosters(userId: string) {
  return db.poster.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPoster(id: string, userId: string) {
  return db.poster.findFirst({ where: { id, userId } });
}

export async function getBatchPosters(batchId: string, userId: string) {
  return db.poster.findMany({
    where: { batchId, userId },
    orderBy: { variationLabel: "asc" },
  });
}

export async function deletePoster(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await db.poster.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/dashboard/posters");
  return { success: true };
}

/**
 * PROOF ACTION — reference-guided full poster.
 * Does not replace the main pipeline yet.
 */
/**
 * Main reference-guided poster generation.
 * Creates a real Poster row and returns batch/poster ids for in-app UI.
 */
/**
 * Main reference-guided poster generation.
 * Creates a real Poster row and returns batch/poster ids for in-app UI.
 */
/**
 * Main reference-guided poster generation.
 * Creates a real Poster row and returns batch/poster ids for in-app UI.
 */
export async function generateReferencePosterProof(input: {
  caption: string;
  contentId?: string;
  headline?: string;
  cta?: string;
  referencePaths?: string[];
  details?: {
    offer?: string;
    price?: string;
    date?: string;
    time?: string;
    address?: string;
    phone?: string;
    website?: string;
    extra?: string;
  };
  posterType?: string;
  goal?: string;
  mainMessage?: string;
  logoBase64?: string;
  mainImageBase64?: string;
  keywords?: string[];
  people?: {
    name?: string;
    role?: string;
    imageBase64?: string;
  }[];
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const { success: withinRateLimit } = await safeRateLimit(
    generationRateLimit,
    session.user.id,
  );
  if (!withinRateLimit) {
    return {
      success: false,
      error: "Too many requests, try again in a moment.",
    };
  }

  try {
    await assertUnderLimit(session.user.id);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Limit reached",
    };
  }

  const { brand, report } = await getBrandContext(session.user.id);
  const batchId = crypto.randomUUID();

  const poster = await db.poster.create({
    data: {
      userId: session.user.id,
      contentId: input.contentId,
      textMode: "BAKED_IN",
      headline: input.headline ?? "",
      imagePrompt: "",
      status: "GENERATING",
      batchId,
      variationLabel: "Reference",
      templateId: null,
    },
  });

  try {
    const plan = await planReferencePoster({
      caption: input.caption,
      brand,
      report,
      details: input.details,
      userCta: input.cta,
      keywords: input.keywords,
      people: input.people?.map((p) => ({
        name: p.name,
        role: p.role,
      })),
      posterType: input.posterType,
      goal: input.goal,
      mainMessage: input.mainMessage,
    });

    const peopleImages =
      input.people
        ?.map((p) => ({
          name: p.name,
          role: p.role,
          image: p.imageBase64
            ? Buffer.from(p.imageBase64, "base64")
            : null,
        }))
        .filter((p) => p.image || p.name || p.role) ?? [];

    const hasPersonPhotos = peopleImages.some((p) => p.image);
    const hasMainImage = !!input.mainImageBase64;
    const refCount = hasPersonPhotos || hasMainImage ? 1 : 3;

    const picked =
      input.referencePaths && input.referencePaths.length > 0
        ? input.referencePaths.map((p) => ({
            pathOrUrl: p,
            source: "static" as const,
          }))
        : await pickPosterReferences(brand?.businessType, refCount);

    if (picked.length === 0) {
      await db.poster.update({
        where: { id: poster.id },
        data: {
          status: "FAILED",
          errorMessage: "No reference images available",
        },
      });
      return {
        success: false,
        error: "No reference images available in the library",
      };
    }

    const refs = await loadReferenceImages(picked.map((p) => p.pathOrUrl));

    const logoImage = input.logoBase64
      ? Buffer.from(input.logoBase64, "base64")
      : null;

    const productImage = input.mainImageBase64
      ? Buffer.from(input.mainImageBase64, "base64")
      : null;

    console.log("main image bytes", productImage?.length ?? 0);
    console.log(
      "people images",
      peopleImages.map((p) => ({
        name: p.name,
        hasImage: !!p.image,
        bytes: p.image?.length ?? 0,
      })),
    );

    const b64 = await generatePosterFromReferences({
      prompt: `Marketing poster for this brief: ${input.caption}`,
      referenceImages: refs,
      logoImage,
      productImage,
      people: peopleImages,
      businessName: brand?.brandName,
      businessType: brand?.businessType,
      brandColors: report?.colors ?? [],
      headline: input.headline ?? plan.headline,
      subheadline: plan.subheadline,
      cta: input.cta ?? plan.cta,
      details: input.details,
      plan,
      keywords: input.keywords,
      size: "1024x1024",
      inputFidelity:
        hasPersonPhotos || !!input.logoBase64 || hasMainImage
          ? "high"
          : "low",
      posterType: input.posterType,
      goal: input.goal,
      mainMessage: input.mainMessage,
    });

    const url = await uploadBase64Image(
      b64,
      `brandpilot/${session.user.id}/posters`,
    );

    await db.poster.update({
      where: { id: poster.id },
      data: {
        headline: input.headline ?? plan.headline,
        subheadline: plan.subheadline || input.details?.offer || "",
        bullets: [
          input.details?.price,
          input.details?.date,
          input.details?.phone,
          input.details?.website,
          ...(input.people ?? [])
            .map((p) => [p.name, p.role].filter(Boolean).join(" — "))
            .filter(Boolean),
        ].filter(Boolean) as string[],
        backgroundUrl: url,
        finalUrl: url,
        status: "READY",
        matchScore: 85,
        recommendedPlatform: "Instagram",
        engagementLevel: "High",
        explanationPoints:
          plan.reasoning?.length > 0
            ? plan.reasoning
            : [
                "Reference-guided design from your library",
                "Brand colors and business context applied",
              ],
      },
    });

    await incrementUsage(session.user.id);
    await logActivity(
      session.user.id,
      "POSTER_GENERATED",
      "Reference poster generated",
    );
    revalidatePath("/dashboard/posters");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        batchId,
        posterId: poster.id,
        posterIds: [poster.id],
        imageUrl: url,
        referencePathsUsed: picked.map((p) => p.pathOrUrl),
        suggestedCta:
          input.cta ||
          plan.cta ||
          DEFAULT_CTA_BY_TYPE[brand?.businessType ?? ""] ||
          "Learn More",
        brandName: brand?.brandName ?? null,
        instagramHandle: brand?.instagramHandle ?? null,
        websiteUrl: brand?.websiteUrl ?? null,
        colors: report?.colors ?? [],
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("Reference poster generation failed", { error: message });
    await db.poster.update({
      where: { id: poster.id },
      data: { status: "FAILED", errorMessage: message },
    });
    return { success: false, error: message };
  }
}